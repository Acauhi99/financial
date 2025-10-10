package services

import (
	"financial-api/internal/models"
	"financial-api/internal/repositories"
)

type DashboardService struct {
	transactionRepo   *repositories.TransactionRepository
	investmentRepo    *repositories.InvestmentRepository
	categoryRepo      *repositories.CategoryRepository
	aggregationRepo   *repositories.AggregationRepository
}

func NewDashboardService(
	transactionRepo *repositories.TransactionRepository,
	investmentRepo *repositories.InvestmentRepository,
	categoryRepo *repositories.CategoryRepository,
	aggregationRepo *repositories.AggregationRepository,
) *DashboardService {
	return &DashboardService{
		transactionRepo: transactionRepo,
		investmentRepo:  investmentRepo,
		categoryRepo:    categoryRepo,
		aggregationRepo: aggregationRepo,
	}
}

func (s *DashboardService) GetSummary(userID string) (*models.DashboardSummary, error) {
	// Get transaction totals
	transactionTotals, err := s.transactionRepo.GetTotals(userID)
	if err != nil {
		return nil, err
	}

	// Get investment totals
	totalInvestments, totalMonthlyReturn, averageRate, err := s.investmentRepo.GetTotals(userID)
	if err != nil {
		return nil, err
	}

	// Get categories
	categories, err := s.categoryRepo.FindAll()
	if err != nil {
		return nil, err
	}

	// Combine totals
	totals := models.Totals{
		Balance:             transactionTotals.Balance,
		TotalIncome:         transactionTotals.TotalIncome,
		TotalExpenses:       transactionTotals.TotalExpenses,
		TotalInvestments:    totalInvestments,
		TotalMonthlyReturn:  totalMonthlyReturn,
		AverageRate:         averageRate,
	}

	return &models.DashboardSummary{
		Totals:     totals,
		Categories: categories,
	}, nil
}

func (s *DashboardService) GetOverview(userID string) (*models.OverviewData, error) {
	// Get basic totals
	summary, err := s.GetSummary(userID)
	if err != nil {
		return nil, err
	}

	// Get aggregated data
	monthlyData, err := s.aggregationRepo.GetMonthlyData(userID)
	if err != nil {
		monthlyData = []models.MonthlyItem{} // Fallback to empty
	}

	expenseCategories, err := s.aggregationRepo.GetExpenseCategories(userID)
	if err != nil {
		expenseCategories = []models.CategoryItem{} // Fallback to empty
	}

	investmentTypes, err := s.aggregationRepo.GetInvestmentTypes(userID)
	if err != nil {
		investmentTypes = []models.InvestmentType{} // Fallback to empty
	}

	overview := &models.OverviewData{
		Summary: models.Summary{
			Balance:          summary.Totals.Balance,
			TotalIncome:      summary.Totals.TotalIncome,
			TotalExpenses:    summary.Totals.TotalExpenses,
			TotalInvestments: summary.Totals.TotalInvestments,
		},
		BalanceData: []models.BalanceItem{
			{Name: "Receitas", Value: summary.Totals.TotalIncome, Color: "#10b981"},
			{Name: "Despesas", Value: summary.Totals.TotalExpenses, Color: "#ef4444"},
			{Name: "Investimentos", Value: summary.Totals.TotalInvestments, Color: "#6b7280"},
		},
		MonthlyData:       monthlyData,
		ExpenseCategories: expenseCategories,
		InvestmentTypes:   investmentTypes,
	}

	return overview, nil
}
