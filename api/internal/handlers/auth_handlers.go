package handlers

import (
	"net/http"

	"financial-api/internal/logger"
	"financial-api/internal/models"
	"financial-api/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
)

type AuthHandlers struct {
	authService *services.AuthService
	validator   *validator.Validate
}

func NewAuthHandlers(authService *services.AuthService) *AuthHandlers {
	return &AuthHandlers{
		authService: authService,
		validator:   validator.New(),
	}
}

func (h *AuthHandlers) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
		return
	}

	response, err := h.authService.Register(&req)
	if err != nil {
		logger.Logger.Error("Failed to register user", 
			zap.Error(err),
			zap.String("email", req.Email),
		)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	logger.Logger.Info("User registered successfully", 
		zap.String("user_id", response.User.ID.Hex()),
		zap.String("email", response.User.Email),
	)

	c.JSON(http.StatusCreated, response)
}

func (h *AuthHandlers) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
		return
	}

	response, err := h.authService.Login(&req)
	if err != nil {
		logger.Logger.Warn("Failed login attempt", 
			zap.Error(err),
			zap.String("email", req.Email),
		)
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	logger.Logger.Info("User logged in successfully", 
		zap.String("user_id", response.User.ID.Hex()),
		zap.String("email", response.User.Email),
	)

	c.JSON(http.StatusOK, response)
}

func (h *AuthHandlers) Me(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get user from database
	user, err := h.authService.GetUserByID(userIDStr)
	if err != nil {
		logger.Logger.Error("Failed to get user", 
			zap.Error(err),
			zap.String("user_id", userIDStr),
		)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}