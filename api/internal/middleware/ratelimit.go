package middleware

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"

	"financial-api/internal/logger"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"golang.org/x/time/rate"
)

type IPRateLimiter struct {
	ips     map[string]*rateLimiterEntry
	mu      *sync.RWMutex
	r       rate.Limit
	b       int
	cleanup *time.Ticker
}

type rateLimiterEntry struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

func NewIPRateLimiter(r rate.Limit, b int) *IPRateLimiter {
	rl := &IPRateLimiter{
		ips:    make(map[string]*rateLimiterEntry),
		mu:     &sync.RWMutex{},
		r:      r,
		b:      b,
		cleanup: time.NewTicker(5 * time.Minute),
	}

	// Cleanup old entries
	go func() {
		for range rl.cleanup.C {
			rl.cleanupOldEntries()
		}
	}()

	return rl
}

func (i *IPRateLimiter) cleanupOldEntries() {
	i.mu.Lock()
	defer i.mu.Unlock()

	cutoff := time.Now().Add(-10 * time.Minute)
	for ip, entry := range i.ips {
		if entry.lastSeen.Before(cutoff) {
			delete(i.ips, ip)
		}
	}
}

func (i *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
	i.mu.RLock()
	entry, exists := i.ips[ip]
	if exists {
		entry.lastSeen = time.Now()
		i.mu.RUnlock()
		return entry.limiter
	}
	i.mu.RUnlock()

	// Create new limiter
	i.mu.Lock()
	defer i.mu.Unlock()

	// Double-check after acquiring write lock
	if entry, exists := i.ips[ip]; exists {
		entry.lastSeen = time.Now()
		return entry.limiter
	}

	limiter := rate.NewLimiter(i.r, i.b)
	i.ips[ip] = &rateLimiterEntry{
		limiter:  limiter,
		lastSeen: time.Now(),
	}
	return limiter
}

func RateLimit(enabled bool, rps, burst int) gin.HandlerFunc {
	if !enabled {
		return gin.HandlerFunc(func(c *gin.Context) {
			c.Next()
		})
	}

	rateLimit := rate.Every(time.Second / time.Duration(rps))
	limiter := NewIPRateLimiter(rateLimit, burst)

	return gin.HandlerFunc(func(c *gin.Context) {
		// Timeout context
		ctx, cancel := context.WithTimeout(c.Request.Context(), 100*time.Millisecond)
		defer cancel()

		ip := c.ClientIP()
		rl := limiter.GetLimiter(ip)

		if !rl.AllowN(time.Now(), 1) {
			logger.Logger.Warn("Rate limit exceeded",
				zap.String("ip", ip),
				zap.String("path", c.Request.URL.Path),
				zap.String("method", c.Request.Method),
				zap.Int("rps_limit", rps),
				zap.Int("burst_limit", burst))

			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":       "Rate limit exceeded",
				"retry_after": fmt.Sprintf("%dms", 1000/rps),
				"limit":       rps,
			})
			c.Abort()
			return
		}

		select {
		case <-ctx.Done():
			c.JSON(http.StatusRequestTimeout, gin.H{"error": "Request timeout"})
			c.Abort()
			return
		default:
			c.Next()
		}
	})
}
