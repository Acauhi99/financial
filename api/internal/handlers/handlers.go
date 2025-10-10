package handlers

import (
	"net/http"
	"strconv"

	"financial-api/internal/logger"
	"financial-api/internal/models"
	"financial-api/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
)

var validate = validator.New()

type Handlers struct {
	transactionService *services.TransactionService
	investmentService  *services.InvestmentService
	dashboardService   *services.DashboardService
}

func NewHandlers(
	transactionService *services.TransactionService,
	investmentService *services.InvestmentService,
	dashboardService *services.DashboardService,
) *Handlers {
	return &Handlers{
		transactionService: transactionService,
		investmentService:  investmentService,
		dashboardService:   dashboardService,
	}
}



// Transaction handlers
func (h *Handlers) getTransactions(c *gin.Context) {
	userID := c.GetString("user_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "15"))
	search := c.Query("search")
	transactionType := c.DefaultQuery("type", "all")

	response, err := h.transactionService.GetTransactionsPaginated(page, limit, search, transactionType, userID)
	if err != nil {
		logger.Logger.Error("Failed to get transactions", 
			zap.Error(err),
			zap.Int("page", page),
			zap.Int("limit", limit),
			zap.String("search", search),
			zap.String("type", transactionType),
		)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handlers) createTransaction(c *gin.Context) {
	userID := c.GetString("user_id")
	var req models.CreateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	if err := validate.Struct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
		return
	}

	transaction := models.Transaction{
		Type:        req.Type,
		Description: req.Description,
		Amount:      req.Amount,
		Date:        req.Date,
		CategoryID:  req.CategoryID,
	}

	if err := h.transactionService.CreateTransaction(&transaction, userID); err != nil {
		logger.Logger.Error("Failed to create transaction", 
			zap.Error(err),
			zap.String("type", transaction.Type),
			zap.Float64("amount", transaction.Amount),
		)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	logger.Logger.Info("Transaction created successfully", 
		zap.String("id", transaction.ID.Hex()),
		zap.String("type", transaction.Type),
		zap.Float64("amount", transaction.Amount),
	)

	c.JSON(http.StatusCreated, transaction)
}

// Investment handlers
func (h *Handlers) getInvestments(c *gin.Context) {
	userID := c.GetString("user_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")

	response, err := h.investmentService.GetInvestmentsPaginated(page, limit, search, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handlers) createInvestment(c *gin.Context) {
	userID := c.GetString("user_id")
	var req models.CreateInvestmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	if err := validate.Struct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
		return
	}

	investment := models.Investment{
		Name:   req.Name,
		Amount: req.Amount,
		Rate:   req.Rate,
		Date:   req.Date,
		Type:   req.Type,
	}

	if err := h.investmentService.CreateInvestment(&investment, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, investment)
}

// Category handlers
func (h *Handlers) getCategories(c *gin.Context) {
	userID := c.GetString("user_id")
	summary, err := h.dashboardService.GetSummary(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, summary.Categories)
}

// Dashboard handlers
func (h *Handlers) getDashboardSummary(c *gin.Context) {
	userID := c.GetString("user_id")
	summary, err := h.dashboardService.GetSummary(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, summary)
}

// Overview handlers
func (h *Handlers) getOverview(c *gin.Context) {
	userID := c.GetString("user_id")
	overview, err := h.dashboardService.GetOverview(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, overview)
}