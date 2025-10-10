package services

import (
	"financial-api/internal/models"
	"financial-api/internal/repositories"
	"math"
)

type TransactionService struct {
	repo *repositories.TransactionRepository
}

func NewTransactionService(repo *repositories.TransactionRepository) *TransactionService {
	return &TransactionService{repo: repo}
}

func (s *TransactionService) CreateTransaction(transaction *models.Transaction, userID string) error {
	return s.repo.Create(transaction, userID)
}

func (s *TransactionService) GetTransactionsPaginated(page, limit int, search, transactionType, userID string) (*models.PaginatedResponse, error) {
	transactions, total, err := s.repo.FindPaginated(page, limit, search, transactionType, userID)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	return &models.PaginatedResponse{
		Data: transactions,
		Pagination: models.Pagination{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}, nil
}

func (s *TransactionService) GetTotals(userID string) (*models.Totals, error) {
	return s.repo.GetTotals(userID)
}
