package handlers

import (
	"github.com/gin-gonic/gin"
)

func (h *Handlers) SetupRoutes(r *gin.Engine, authHandlers *AuthHandlers, authMiddleware gin.HandlerFunc) {
	api := r.Group("/api")
	{
		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandlers.Register)
			auth.POST("/login", authHandlers.Login)
			auth.GET("/me", authMiddleware, authHandlers.Me)
		}

		// Protected routes
		protected := api.Group("/")
		protected.Use(authMiddleware)
		{
			// Transactions
			protected.GET("/transactions", h.getTransactions)
			protected.POST("/transactions", h.createTransaction)

			// Investments
			protected.GET("/investments", h.getInvestments)
			protected.POST("/investments", h.createInvestment)

			// Categories
			protected.GET("/categories", h.getCategories)

			// Dashboard
			protected.GET("/dashboard/summary", h.getDashboardSummary)

			// Overview
			protected.GET("/overview", h.getOverview)
		}
	}
}