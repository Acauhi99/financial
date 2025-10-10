package main

import (
	"log"

	"financial-api/internal/config"
	"financial-api/internal/database"
	"financial-api/internal/handlers"
	"financial-api/internal/logger"
	"financial-api/internal/middleware"
	"financial-api/internal/repositories"
	"financial-api/internal/services"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// Initialize logger
	if err := logger.Init(); err != nil {
		log.Fatal("Failed to initialize logger:", err)
	}
	defer logger.Sync()

	// Load configuration
	cfg := config.Load()
	logger.Logger.Info("Starting Financial API", zap.String("port", cfg.Port))

	// Connect to database
	db, err := database.Connect(cfg.MongoURI)
	if err != nil {
		logger.Logger.Fatal("Failed to connect to database", zap.Error(err))
	}
	defer database.Disconnect(db)
	logger.Logger.Info("Connected to MongoDB successfully")

	// Create database indexes
	if err := database.CreateIndexes(db); err != nil {
		logger.Logger.Warn("Failed to create indexes", zap.Error(err))
	}

	// Initialize repositories
	transactionRepo := repositories.NewTransactionRepository(db)
	investmentRepo := repositories.NewInvestmentRepository(db)
	categoryRepo := repositories.NewCategoryRepository(db)
	aggregationRepo := repositories.NewAggregationRepository(db)
	userRepo := repositories.NewUserRepository(db)

	// Seed default categories
	if err := categoryRepo.SeedDefaultCategories(); err != nil {
		logger.Logger.Warn("Failed to seed categories", zap.Error(err))
	} else {
		logger.Logger.Info("Categories seeded successfully")
	}

	// Initialize services
	transactionService := services.NewTransactionService(transactionRepo)
	investmentService := services.NewInvestmentService(investmentRepo)
	dashboardService := services.NewDashboardService(transactionRepo, investmentRepo, categoryRepo, aggregationRepo)
	authService := services.NewAuthService(userRepo)

	// Initialize handlers
	h := handlers.NewHandlers(transactionService, investmentService, dashboardService)
	authHandlers := handlers.NewAuthHandlers(authService)
	authMiddleware := middleware.AuthMiddleware(authService)

	// Setup router
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.Security())
	r.Use(middleware.CORS())
	r.Use(middleware.RateLimit())

	// Health check
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Financial API v1.0",
			"status":  "running",
		})
	})

	// Setup routes
	h.SetupRoutes(r, authHandlers, authMiddleware)

	// Start server
	logger.Logger.Info("Server starting", zap.String("port", cfg.Port))
	if err := r.Run(":" + cfg.Port); err != nil {
		logger.Logger.Fatal("Failed to start server", zap.Error(err))
	}
}