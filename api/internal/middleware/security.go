package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func Security() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		// Timeout context
		ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
		defer cancel()

		select {
		case <-ctx.Done():
			c.JSON(http.StatusRequestTimeout, gin.H{"error": "Security check timeout"})
			c.Abort()
			return
		default:
		}

		// Security headers
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Content-Security-Policy", "default-src 'self'")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		c.Next()
	})
}
