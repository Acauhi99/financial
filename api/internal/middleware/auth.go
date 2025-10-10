package middleware

import (
	"net/http"
	"strings"
	"time"

	"financial-api/internal/logger"
	"financial-api/internal/models"
	"financial-api/internal/services"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type authContext struct {
	clientIP  string
	userAgent string
	path      string
}

func (a *authContext) logAndAbort(c *gin.Context, status int, message, logMessage string, err error) {
	logFields := []zap.Field{
		zap.String("ip", a.clientIP),
		zap.String("user_agent", a.userAgent),
		zap.String("path", a.path),
	}
	if err != nil {
		logFields = append(logFields, zap.Error(err))
	}
	logger.Logger.Warn(logMessage, logFields...)
	c.JSON(status, gin.H{"error": message})
	c.Abort()
}

func extractToken(authHeader string) (string, bool) {
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" || parts[1] == "" {
		return "", false
	}
	return parts[1], true
}

func validateClaims(claims *models.JWTClaims) bool {
	return claims != nil && claims.UserID != "" && claims.Email != ""
}

func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		start := time.Now()
		auth := &authContext{
			clientIP:  c.ClientIP(),
			userAgent: c.GetHeader("User-Agent"),
			path:      c.Request.URL.Path,
		}

		if ctxErr := c.Request.Context().Err(); ctxErr != nil {
			auth.logAndAbort(c, http.StatusRequestTimeout, "Request timeout", "Auth middleware context error", ctxErr)
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			auth.logAndAbort(c, http.StatusUnauthorized, "Authorization required", "Auth attempt without header", nil)
			return
		}

		token, valid := extractToken(authHeader)
		if !valid {
			auth.logAndAbort(c, http.StatusUnauthorized, "Invalid authorization format", "Auth attempt with invalid format", nil)
			return
		}

		claims, err := authService.ValidateToken(token)
		if err != nil {
			auth.logAndAbort(c, http.StatusUnauthorized, "Access denied", "Auth attempt with invalid token", err)
			return
		}
		if !validateClaims(claims) {
			auth.logAndAbort(c, http.StatusUnauthorized, "Access denied", "Auth attempt with invalid claims", nil)
			return
		}

		logger.Logger.Info("Successful auth",
			zap.String("user_id", claims.UserID),
			zap.String("email", claims.Email),
			zap.String("ip", auth.clientIP),
			zap.String("path", auth.path),
			zap.Duration("duration", time.Since(start)))

		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Next()
	})
}
