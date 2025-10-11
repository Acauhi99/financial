package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

const (
	// Endpoints
	overviewEndpoint = "/api/overview"

	// Test data
	overviewUserEmail = "overview@test.com"
	overviewUserName = "Overview User"
	emptyOverviewUserEmail = "emptyoverview@test.com"
	emptyOverviewUserName = "Empty Overview User"

	// Transaction descriptions for overview
	salaryOctDesc = "Salary Oct"
	rentOctDesc = "Rent Oct"
	foodOctDesc = "Food Oct"

	// Investment names for overview
	tesouroSelicOverview = "Tesouro Selic"
	cdbBankOverview = "CDB Bank"

	// Amounts for overview tests
	overviewSalaryAmount = 5000.0
	overviewRentAmount = 1500.0
	overviewFoodAmount = 300.0
	overviewTotalExpenses = 1800.0 // 1500 + 300
	overviewInvestment1Amount = 10000.0
	overviewInvestment2Amount = 5000.0
	overviewTotalInvestments = 15000.0 // 10000 + 5000

	// Dates for overview
	overviewDate1 = "2024-10-15"
	overviewDate2 = "2024-10-14"
	overviewDate3 = "2024-10-13"

	// Expected balance data items
	expectedBalanceItems = 3

	// Error messages
	expectedInvestmentTypesToBePopulatedMsg = "Expected investment types to be populated"
	expectedPositivePercentageMsg = "Expected positive percentage for %s, got %f"
	expectedBalanceItemsMsg = "Expected %d balance items, got %d"
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
	token, err := createAuthenticatedUser(overviewUserEmail, overviewUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	transactions := []map[string]interface{}{
		{"type": incomeType, "description": salaryOctDesc, "amount": overviewSalaryAmount, "date": overviewDate1},
		{"type": expenseType, "description": rentOctDesc, "amount": overviewRentAmount, "date": overviewDate2},
		{"type": expenseType, "description": foodOctDesc, "amount": overviewFoodAmount, "date": overviewDate3},
	}

	for _, tx := range transactions {
		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tx, token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()
	}

	investments := []map[string]interface{}{
		{"name": tesouroSelicOverview, "amount": overviewInvestment1Amount, "rate": rate100, "date": overviewDate1, "type": tesouroDiretoType},
		{"name": cdbBankOverview, "amount": overviewInvestment2Amount, "rate": rate110, "date": overviewDate2, "type": cdbType},
	}

	for _, inv := range investments {
		resp, err := makeRequestWithAuth("POST", investmentsEndpoint, inv, token)
		if err != nil {
			t.Fatalf("Failed to create investment: %v", err)
		}
		resp.Body.Close()
	}

	resp, err := makeRequestWithAuth("GET", overviewEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var overview OverviewData
	if err := json.NewDecoder(resp.Body).Decode(&overview); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if overview.Summary.TotalIncome < overviewSalaryAmount {
		t.Errorf("Expected total income >= %f, got %f", overviewSalaryAmount, overview.Summary.TotalIncome)
	}

	if overview.Summary.TotalExpenses < overviewTotalExpenses {
		t.Errorf("Expected total expenses >= %f, got %f", overviewTotalExpenses, overview.Summary.TotalExpenses)
	}

	if overview.Summary.TotalInvestments < overviewTotalInvestments {
		t.Errorf("Expected total investments >= %f, got %f", overviewTotalInvestments, overview.Summary.TotalInvestments)
	}

	if len(overview.BalanceData) != expectedBalanceItems {
		t.Errorf(expectedBalanceItemsMsg, expectedBalanceItems, len(overview.BalanceData))
	}

	if len(overview.InvestmentTypes) == 0 {
		t.Error(expectedInvestmentTypesToBePopulatedMsg)
	}

	for _, invType := range overview.InvestmentTypes {
		if invType.Percentage <= 0 {
			t.Errorf(expectedPositivePercentageMsg, invType.Name, invType.Percentage)
		}
	}
}

func TestOverviewEmpty(t *testing.T) {
	token, err := createAuthenticatedUser(emptyOverviewUserEmail, emptyOverviewUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	resp, err := makeRequestWithAuth("GET", overviewEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var overview OverviewData
	if err := json.NewDecoder(resp.Body).Decode(&overview); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if overview.Summary.TotalIncome != 0 {
		t.Errorf("Expected total income 0, got %f", overview.Summary.TotalIncome)
	}

	if overview.Summary.TotalExpenses != 0 {
		t.Errorf("Expected total expenses 0, got %f", overview.Summary.TotalExpenses)
	}

	if overview.Summary.TotalInvestments != 0 {
		t.Errorf("Expected total investments 0, got %f", overview.Summary.TotalInvestments)
	}

	if overview.Summary.Balance != 0 {
		t.Errorf("Expected balance 0, got %f", overview.Summary.Balance)
	}
}

func TestOverviewUnauthorized(t *testing.T) {
	resp, err := makeRequest("GET", overviewEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestOverviewBalanceDataStructure(t *testing.T) {
	token, err := createAuthenticatedUser("balancedata@test.com", "Balance Data User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create some test data
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

	resp, err := makeRequestWithAuth("GET", overviewEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var overview OverviewData
	if err := json.NewDecoder(resp.Body).Decode(&overview); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	// Verify balance data structure
	for _, item := range overview.BalanceData {
		if item.Name == emptyString {
			t.Error("Balance item name should not be empty")
		}
		if item.Color == emptyString {
			t.Error("Balance item color should not be empty")
		}
		if item.Value < 0 {
			t.Errorf("Balance item value should not be negative, got %f", item.Value)
		}
	}
}

func TestOverviewInvestmentTypesCalculation(t *testing.T) {
	token, err := createAuthenticatedUser("invtypes@test.com", "Investment Types User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create investments of different types
	investments := []map[string]interface{}{
		{"name": "Tesouro 1", "amount": 6000.0, "rate": rate100, "date": testDate, "type": tesouroDiretoType},
		{"name": "Tesouro 2", "amount": 4000.0, "rate": rate105, "date": testDate, "type": tesouroDiretoType},
		{"name": "CDB 1", "amount": 10000.0, "rate": rate110, "date": testDate, "type": cdbType},
	}

	totalTesouro := 10000.0 // 6000 + 4000
	totalCDB := 10000.0
	totalInvestments := 20000.0

	for _, inv := range investments {
		resp, err := makeRequestWithAuth("POST", investmentsEndpoint, inv, token)
		if err != nil {
			t.Fatalf("Failed to create investment: %v", err)
		}
		resp.Body.Close()
	}

	resp, err := makeRequestWithAuth("GET", overviewEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var overview OverviewData
	if err := json.NewDecoder(resp.Body).Decode(&overview); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	// Verify investment types
	typeValues := make(map[string]float64)
	typePercentages := make(map[string]float64)

	for _, invType := range overview.InvestmentTypes {
		typeValues[invType.Name] = invType.Value
		typePercentages[invType.Name] = invType.Percentage
	}

	// Check Tesouro Direto
	if val, exists := typeValues[tesouroDiretoType]; exists {
		if val != totalTesouro {
			t.Errorf("Expected Tesouro Direto value %f, got %f", totalTesouro, val)
		}
		expectedPercentage := (totalTesouro / totalInvestments) * 100
		if pct := typePercentages[tesouroDiretoType]; pct != expectedPercentage {
			t.Errorf("Expected Tesouro Direto percentage %f, got %f", expectedPercentage, pct)
		}
	}

	// Check CDB
	if val, exists := typeValues[cdbType]; exists {
		if val != totalCDB {
			t.Errorf("Expected CDB value %f, got %f", totalCDB, val)
		}
		expectedPercentage := (totalCDB / totalInvestments) * 100
		if pct := typePercentages[cdbType]; pct != expectedPercentage {
			t.Errorf("Expected CDB percentage %f, got %f", expectedPercentage, pct)
		}
	}
}
