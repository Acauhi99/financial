package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

const (
	// Endpoints
	dashboardSummaryEndpoint = "/api/dashboard/summary"

	// Test data
	dashboardUserEmail = "dashboard@test.com"
	dashboardUserName = "Dashboard User"
	emptyDashboardUserEmail = "emptydash@test.com"
	emptyDashboardUserName = "Empty Dashboard User"

	// Transaction descriptions
	salaryDesc = "Salary"
	rentDesc = "Rent"
	freelanceDesc = "Freelance"
	groceriesDesc = "Groceries"

	// Amounts for dashboard tests
	dashboardSalaryAmount = 5000.0
	dashboardRentAmount = 1500.0
	dashboardFreelanceAmount = 800.0
	dashboardGroceriesAmount = 300.0

	// Expected calculations
	expectedTotalIncome = 5800.0  // 5000 + 800
	expectedTotalExpenses = 1800.0 // 1500 + 300
	expectedBalance = 4000.0      // 5800 - 1800

	// Error messages
	expectedCategoriesToBePresentMsg = "Expected categories to be present"
	expectedTotalsToBeCalculatedMsg = "Expected totals to be calculated correctly"
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

type Category struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
	Type  string `json:"type"`
}

func TestDashboardSummary(t *testing.T) {
	token, err := createAuthenticatedUser(dashboardUserEmail, dashboardUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	transactions := []map[string]interface{}{
		{"type": incomeType, "description": salaryDesc, "amount": dashboardSalaryAmount, "date": testDate},
		{"type": expenseType, "description": rentDesc, "amount": dashboardRentAmount, "date": testDate},
		{"type": incomeType, "description": freelanceDesc, "amount": dashboardFreelanceAmount, "date": testDate},
		{"type": expenseType, "description": groceriesDesc, "amount": dashboardGroceriesAmount, "date": testDate},
	}

	for _, tx := range transactions {
		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tx, token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()
	}

	resp, err := makeRequestWithAuth("GET", dashboardSummaryEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var summary DashboardSummary
	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if summary.Totals.TotalIncome < expectedTotalIncome {
		t.Errorf("Expected total income >= %f, got %f", expectedTotalIncome, summary.Totals.TotalIncome)
	}

	if summary.Totals.TotalExpenses < expectedTotalExpenses {
		t.Errorf("Expected total expenses >= %f, got %f", expectedTotalExpenses, summary.Totals.TotalExpenses)
	}

	if summary.Totals.Balance < expectedBalance {
		t.Errorf("Expected balance >= %f, got %f", expectedBalance, summary.Totals.Balance)
	}

	if len(summary.Categories) == 0 {
		t.Error(expectedCategoriesToBePresentMsg)
	}
}

func TestDashboardSummaryWithInvestments(t *testing.T) {
	token, err := createAuthenticatedUser("dashinv@test.com", "Dashboard Inv User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create transactions
	transactions := []map[string]interface{}{
		{"type": incomeType, "description": salaryDesc, "amount": dashboardSalaryAmount, "date": testDate},
		{"type": expenseType, "description": rentDesc, "amount": dashboardRentAmount, "date": testDate},
	}

	for _, tx := range transactions {
		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tx, token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()
	}

	// Create investments
	investments := []map[string]interface{}{
		{"name": tesouroSelicName, "amount": investmentAmount1, "rate": rate100, "date": testDate, "type": tesouroDiretoType},
		{"name": cdbBankName, "amount": investmentAmount2, "rate": rate110, "date": testDate, "type": cdbType},
	}

	for _, inv := range investments {
		resp, err := makeRequestWithAuth("POST", investmentsEndpoint, inv, token)
		if err != nil {
			t.Fatalf("Failed to create investment: %v", err)
		}
		resp.Body.Close()
	}

	resp, err := makeRequestWithAuth("GET", dashboardSummaryEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var summary DashboardSummary
	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	expectedTotalInvestments := investmentAmount1 + investmentAmount2
	if summary.Totals.TotalInvestments < expectedTotalInvestments {
		t.Errorf("Expected total investments >= %f, got %f", expectedTotalInvestments, summary.Totals.TotalInvestments)
	}

	if summary.Totals.TotalMonthlyReturn <= 0 {
		t.Error("Expected positive monthly return from investments")
	}

	if summary.Totals.AverageRate <= 0 {
		t.Error("Expected positive average rate from investments")
	}
}

func TestDashboardSummaryEmpty(t *testing.T) {
	token, err := createAuthenticatedUser(emptyDashboardUserEmail, emptyDashboardUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	resp, err := makeRequestWithAuth("GET", dashboardSummaryEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var summary DashboardSummary
	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if summary.Totals.TotalIncome != 0 {
		t.Errorf("Expected total income 0, got %f", summary.Totals.TotalIncome)
	}

	if summary.Totals.TotalExpenses != 0 {
		t.Errorf("Expected total expenses 0, got %f", summary.Totals.TotalExpenses)
	}

	if summary.Totals.Balance != 0 {
		t.Errorf("Expected balance 0, got %f", summary.Totals.Balance)
	}

	if summary.Totals.TotalInvestments != 0 {
		t.Errorf("Expected total investments 0, got %f", summary.Totals.TotalInvestments)
	}

	// Categories should still be present (default categories)
	if len(summary.Categories) == 0 {
		t.Error(expectedCategoriesToBePresentMsg)
	}
}

func TestDashboardSummaryUnauthorized(t *testing.T) {
	resp, err := makeRequest("GET", dashboardSummaryEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestDashboardSummaryCalculations(t *testing.T) {
	token, err := createAuthenticatedUser("calculations@test.com", "Calculations User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create specific transactions for calculation testing
	testTransactions := []struct {
		txType      string
		description string
		amount      float64
	}{
		{incomeType, "Income 1", 2000.0},
		{incomeType, "Income 2", 3000.0},
		{expenseType, "Expense 1", 800.0},
		{expenseType, "Expense 2", 1200.0},
	}

	var totalIncome, totalExpenses float64
	for _, tx := range testTransactions {
		payload := map[string]interface{}{
			"type":        tx.txType,
			"description": tx.description,
			"amount":      tx.amount,
			"date":        testDate,
		}

		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()

		if tx.txType == incomeType {
			totalIncome += tx.amount
		} else {
			totalExpenses += tx.amount
		}
	}

	resp, err := makeRequestWithAuth("GET", dashboardSummaryEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var summary DashboardSummary
	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	expectedBalance := totalIncome - totalExpenses

	if summary.Totals.TotalIncome != totalIncome {
		t.Errorf("Expected total income %f, got %f", totalIncome, summary.Totals.TotalIncome)
	}

	if summary.Totals.TotalExpenses != totalExpenses {
		t.Errorf("Expected total expenses %f, got %f", totalExpenses, summary.Totals.TotalExpenses)
	}

	if summary.Totals.Balance != expectedBalance {
		t.Errorf("Expected balance %f, got %f", expectedBalance, summary.Totals.Balance)
	}
}

func TestDashboardSummaryInvestmentCalculations(t *testing.T) {
	token, err := createAuthenticatedUser("invcalc@test.com", "Investment Calc User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	testInvestments := []struct {
		name   string
		amount float64
		rate   float64
	}{
		{"Investment A", 10000.0, 100.0},
		{"Investment B", 5000.0, 120.0},
		{"Investment C", 15000.0, 80.0},
	}

	var totalAmount, totalMonthlyReturn, totalRate float64
	for _, inv := range testInvestments {
		payload := map[string]interface{}{
			"name":   inv.name,
			"amount": inv.amount,
			"rate":   inv.rate,
			"date":   testDate,
		}

		resp, err := makeRequestWithAuth("POST", investmentsEndpoint, payload, token)
		if err != nil {
			t.Fatalf("Failed to create investment: %v", err)
		}
		resp.Body.Close()

		totalAmount += inv.amount
		totalMonthlyReturn += (inv.amount * (inv.rate / 100)) / 12
		totalRate += inv.rate
	}

	expectedAverageRate := totalRate / float64(len(testInvestments))

	resp, err := makeRequestWithAuth("GET", dashboardSummaryEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var summary DashboardSummary
	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if summary.Totals.TotalInvestments != totalAmount {
		t.Errorf("Expected total investments %f, got %f", totalAmount, summary.Totals.TotalInvestments)
	}

	if summary.Totals.TotalMonthlyReturn != totalMonthlyReturn {
		t.Errorf("Expected total monthly return %f, got %f", totalMonthlyReturn, summary.Totals.TotalMonthlyReturn)
	}

	if summary.Totals.AverageRate != expectedAverageRate {
		t.Errorf("Expected average rate %f, got %f", expectedAverageRate, summary.Totals.AverageRate)
	}
}
