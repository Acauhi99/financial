package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

type DashboardSummary struct {
	Totals     Totals     `json:"totals"`
	Categories []Category `json:"categories"`
}

type Totals struct {
	Balance             float64 `json:"balance"`
	TotalIncome         float64 `json:"totalIncome"`
	TotalExpenses       float64 `json:"totalExpenses"`
	TotalInvestments    float64 `json:"totalInvestments"`
	TotalMonthlyReturn  float64 `json:"totalMonthlyReturn"`
	AverageRate         float64 `json:"averageRate"`
}

func TestDashboardSummary(t *testing.T) {
	token, err := createAuthenticatedUser("dashboard@test.com", "Dashboard User")
	if err != nil {
		t.Fatalf("Failed to create authenticated user: %v", err)
	}

	// Create some test data first
	transactions := []map[string]interface{}{
		{"type": "income", "description": "Salary", "amount": 5000.0, "date": "2024-10-09"},
		{"type": "expense", "description": "Rent", "amount": 1500.0, "date": "2024-10-09"},
		{"type": "income", "description": "Freelance", "amount": 800.0, "date": "2024-10-09"},
	}

	for _, tx := range transactions {
		resp, err := makeRequestWithAuth("POST", "/api/transactions", tx, token)
		if err != nil {
			t.Fatalf("Failed to create transaction: %v", err)
		}
		resp.Body.Close()
	}

	// Test dashboard summary
	resp, err := makeRequestWithAuth("GET", "/api/dashboard/summary", nil, token)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var summary DashboardSummary
	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	// Verify calculations
	expectedIncome := 5800.0  // 5000 + 800
	expectedExpenses := 1500.0
	expectedBalance := expectedIncome - expectedExpenses

	if summary.Totals.TotalIncome < expectedIncome {
		t.Errorf("Expected total income >= %f, got %f", expectedIncome, summary.Totals.TotalIncome)
	}

	if summary.Totals.TotalExpenses < expectedExpenses {
		t.Errorf("Expected total expenses >= %f, got %f", expectedExpenses, summary.Totals.TotalExpenses)
	}

	if summary.Totals.Balance < expectedBalance {
		t.Errorf("Expected balance >= %f, got %f", expectedBalance, summary.Totals.Balance)
	}

	if len(summary.Categories) == 0 {
		t.Error("Expected categories to be present")
	}
}
