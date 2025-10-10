package services

import (
	"financial-api/internal/models"
	"financial-api/internal/repositories"
	"math"
)

type InvestmentService struct {
	repo *repositories.InvestmentRepository
}

func NewInvestmentService(repo *repositories.InvestmentRepository) *InvestmentService {
	return &InvestmentService{repo: repo}
}

func (s *InvestmentService) CreateInvestment(investment *models.Investment, userID string) error {
	return s.repo.Create(investment, userID)
}

func (s *InvestmentService) GetInvestmentsPaginated(page, limit int, search, userID string) (*models.PaginatedResponse, error) {
	investments, total, err := s.repo.FindPaginated(page, limit, search, userID)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	return &models.PaginatedResponse{
		Data: investments,
		Pagination: models.Pagination{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}, nil
}
