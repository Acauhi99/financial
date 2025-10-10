package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

type OverviewData struct {
	Summary             Summary             `json:"summary"`
	BalanceData         []BalanceItem       `json:"balanceData"`
	MonthlyData         []MonthlyItem       `json:"monthlyData"`
	ExpenseCategories   []CategoryItem      `json:"expenseCategories"`
	InvestmentTypes     []InvestmentType    `json:"investmentTypes"`
}

type Summary struct {
	Balance          float64 `json:"balance"`
	TotalIncome      float64 `json:"totalIncome"`
	TotalExpenses    float64 `json:"totalExpenses"`
	TotalInvestments float64 `json:"totalInvestments"`
}

type BalanceItem struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
	Color string  `json:"color"`
}

type MonthlyItem struct {
	Month         string  `json:"month"`
	Receitas      float64 `json:"receitas"`
	Despesas      float64 `json:"despesas"`
	Saldo         float64 `json:"saldo"`
	Investimentos float64 `json:"investimentos"`
}

type CategoryItem struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
	Color string  `json:"color"`
}

type InvestmentType struct {
	Name       string  `json:"name"`
	Value      float64 `json:"value"`
	Color      string  `json:"color"`
	Percentage float64 `json:"percentage"`
}

func TestOverviewWithRealData(t *testing.T) {
	token, err := createAuthenticatedUser("overview@test.com", "Overview User")
	if err != nil {
		t.Fatalf("Failed to create authenticated user: %v", err)
	}

	// Create test data
	transactions := []map[string]interface{}{
		{"type": "income", "description": "Salary Oct", "amount": 5000.0, "date": "2024-10-15"},
		{"type": "expense", "description": "Rent Oct", "amount": 1500.0, "date": "2024-10-14"},
		{"type": "expense", "description": "Food Oct", "amount": 300.0, "date": "2024-10-13"},
	}

	for _, tx := range transactions {
		resp, err := makeRequestWithAuth("POST", "/api/transactions", tx, token)
		if err != nil {
			t.Fatalf("Failed to create transaction: %v", err)
		}
		resp.Body.Close()
	}

	investments := []map[string]interface{}{
		{"name": "Tesouro Selic", "amount": 10000.0, "rate": 100.0, "date": "2024-10-15", "type": "Tesouro Direto"},
		{"name": "CDB Bank", "amount": 5000.0, "rate": 110.0, "date": "2024-10-14", "type": "CDB"},
	}

	for _, inv := range investments {
		resp, err := makeRequestWithAuth("POST", "/api/investments", inv, token)
		if err != nil {
			t.Fatalf("Failed to create investment: %v", err)
		}
		resp.Body.Close()
	}

	// Test overview
	resp, err := makeRequestWithAuth("GET", "/api/overview", nil, token)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var overview OverviewData
	if err := json.NewDecoder(resp.Body).Decode(&overview); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	// Verify summary
	if overview.Summary.TotalIncome < 5000 {
		t.Errorf("Expected total income >= 5000, got %f", overview.Summary.TotalIncome)
	}

	if overview.Summary.TotalExpenses < 1800 {
		t.Errorf("Expected total expenses >= 1800, got %f", overview.Summary.TotalExpenses)
	}

	if overview.Summary.TotalInvestments < 15000 {
		t.Errorf("Expected total investments >= 15000, got %f", overview.Summary.TotalInvestments)
	}

	// Verify balance data structure
	if len(overview.BalanceData) != 3 {
		t.Errorf("Expected 3 balance items, got %d", len(overview.BalanceData))
	}

	// Verify investment types are populated
	if len(overview.InvestmentTypes) == 0 {
		t.Error("Expected investment types to be populated")
	}

	// Verify investment types have percentages
	for _, invType := range overview.InvestmentTypes {
		if invType.Percentage <= 0 {
			t.Errorf("Expected positive percentage for %s, got %f", invType.Name, invType.Percentage)
		}
	}
}