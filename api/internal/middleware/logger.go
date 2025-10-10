package middleware

import (
	"context"
	"time"

	"financial-api/internal/logger"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Logger() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery
		clientIP := c.ClientIP()
		method := c.Request.Method
		userAgent := c.GetHeader("User-Agent")
		referer := c.GetHeader("Referer")

		// Timeout context
		ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
		defer cancel()
		c.Request = c.Request.WithContext(ctx)

		// Log incoming request
		logger.Logger.Info("Incoming request",
			zap.String("method", method),
			zap.String("path", path),
			zap.String("ip", clientIP),
			zap.String("user_agent", userAgent),
			zap.String("referer", referer))

		// Process request
		c.Next()

		// Log response
		latency := time.Since(start)
		statusCode := c.Writer.Status()
		userID, _ := c.Get("user_id")
		userEmail, _ := c.Get("user_email")

		if raw != "" {
			path = path + "?" + raw
		}

		logFields := []zap.Field{
			zap.String("method", method),
			zap.String("path", path),
			zap.Int("status", statusCode),
			zap.String("ip", clientIP),
			zap.Duration("latency", latency),
			zap.String("user_agent", userAgent),
		}

		if userID != nil {
			logFields = append(logFields, zap.String("user_id", userID.(string)))
		}
		if userEmail != nil {
			logFields = append(logFields, zap.String("user_email", userEmail.(string)))
		}

		// Log based on status code
		if statusCode >= 500 {
			logger.Logger.Error("Request failed", logFields...)
		} else if statusCode >= 400 {
			logger.Logger.Warn("Request error", logFields...)
		} else {
			logger.Logger.Info("Request completed", logFields...)
		}

		// Audit log for sensitive operations
		if method != "GET" && userID != nil {
			logger.Logger.Info("Audit: Data modification",
				zap.String("user_id", userID.(string)),
				zap.String("action", method),
				zap.String("resource", path),
				zap.Int("status", statusCode),
				zap.String("ip", clientIP))
		}
	})
}
