package integration

import (
	"encoding/json"
	"testing"
)

const (
	// Test users
	user1Email = "user1@example.com"
	user1Name = "User One"
	user2Email = "user2@example.com"
	user2Name = "User Two"
	dashboardIsolationEmail = "dashboard@example.com"
	dashboardIsolationName = "Dashboard User"

	// Transaction descriptions for multitenancy
	user1SalaryDesc = "User 1 Salary"
	user2SalaryDesc = "User 2 Salary"
	isolatedIncomeDesc = "Isolated Income"
	isolatedExpenseDesc = "Isolated Expense"

	// Amounts for multitenancy tests
	user1SalaryAmount = 5000.0
	user2SalaryAmount = 3000.0
	isolatedIncomeAmount = 2000.0
	isolatedExpenseAmount = 500.0

	// Expected counts
	expectedSingleTransaction = 1

	// Error messages
	failedRegisterUser1Msg = "Failed to register user 1: %v"
	failedRegisterUser2Msg = "Failed to register user 2: %v"
	failedDecodeUser1ResponseMsg = "Failed to decode user 1 response: %v"
	failedDecodeUser2ResponseMsg = "Failed to decode user 2 response: %v"
	failedCreateTransactionUser1Msg = "Failed to create transaction for user 1: %v"
	failedCreateTransactionUser2Msg = "Failed to create transaction for user 2: %v"
	failedGetTransactionsUser1Msg = "Failed to get transactions for user 1: %v"
	failedGetTransactionsUser2Msg = "Failed to get transactions for user 2: %v"
	failedDecodeUser1TransactionsMsg = "Failed to decode user 1 transactions: %v"
	failedDecodeUser2TransactionsMsg = "Failed to decode user 2 transactions: %v"
	usersShouldNotSeeEachOthersTransactionsMsg = "Users should not see each other's transactions"
	user1ShouldSeeOwnTransactionMsg = "User 1 should see their own transaction, got %v"
	user2ShouldSeeOwnTransactionMsg = "User 2 should see their own transaction, got %v"
	user1ShouldSeeOneTransactionMsg = "User 1 should see %d transaction, got %d"
	user2ShouldSeeOneTransactionMsg = "User 2 should see %d transaction, got %d"
	failedGetDashboardMsg = "Failed to get dashboard: %v"
	failedDecodeDashboardMsg = "Failed to decode dashboard: %v"
)

func TestMultiTenancy(t *testing.T) {
	user1Payload := map[string]interface{}{
		"email":    user1Email,
		"password": testPassword,
		"name":     user1Name,
	}

	user2Payload := map[string]interface{}{
		"email":    user2Email,
		"password": testPassword,
		"name":     user2Name,
	}

	resp1, err := makeRequest("POST", registerEndpoint, user1Payload)
	if err != nil {
		t.Fatalf(failedRegisterUser1Msg, err)
	}
	defer resp1.Body.Close()

	var auth1 AuthResponse
	if err := json.NewDecoder(resp1.Body).Decode(&auth1); err != nil {
		t.Fatalf(failedDecodeUser1ResponseMsg, err)
	}

	resp2, err := makeRequest("POST", registerEndpoint, user2Payload)
	if err != nil {
		t.Fatalf(failedRegisterUser2Msg, err)
	}
	defer resp2.Body.Close()

	var auth2 AuthResponse
	if err := json.NewDecoder(resp2.Body).Decode(&auth2); err != nil {
		t.Fatalf(failedDecodeUser2ResponseMsg, err)
	}

	user1Transaction := map[string]interface{}{
		"type":        incomeType,
		"description": user1SalaryDesc,
		"amount":      user1SalaryAmount,
		"date":        testDate,
	}

	createResp1, err := makeRequestWithAuth("POST", transactionsEndpoint, user1Transaction, auth1.Token)
	if err != nil {
		t.Fatalf(failedCreateTransactionUser1Msg, err)
	}
	createResp1.Body.Close()

	user2Transaction := map[string]interface{}{
		"type":        incomeType,
		"description": user2SalaryDesc,
		"amount":      user2SalaryAmount,
		"date":        testDate,
	}

	createResp2, err := makeRequestWithAuth("POST", transactionsEndpoint, user2Transaction, auth2.Token)
	if err != nil {
		t.Fatalf(failedCreateTransactionUser2Msg, err)
	}
	createResp2.Body.Close()

	getResp1, err := makeRequestWithAuth("GET", transactionsEndpoint, nil, auth1.Token)
	if err != nil {
		t.Fatalf(failedGetTransactionsUser1Msg, err)
	}
	defer getResp1.Body.Close()

	var user1Transactions PaginatedResponse
	if err := json.NewDecoder(getResp1.Body).Decode(&user1Transactions); err != nil {
		t.Fatalf(failedDecodeUser1TransactionsMsg, err)
	}

	if user1Transactions.Pagination.Total != expectedSingleTransaction {
		t.Errorf(user1ShouldSeeOneTransactionMsg, expectedSingleTransaction, user1Transactions.Pagination.Total)
	}

	getResp2, err := makeRequestWithAuth("GET", transactionsEndpoint, nil, auth2.Token)
	if err != nil {
		t.Fatalf(failedGetTransactionsUser2Msg, err)
	}
	defer getResp2.Body.Close()

	var user2Transactions PaginatedResponse
	if err := json.NewDecoder(getResp2.Body).Decode(&user2Transactions); err != nil {
		t.Fatalf(failedDecodeUser2TransactionsMsg, err)
	}

	if user2Transactions.Pagination.Total != expectedSingleTransaction {
		t.Errorf(user2ShouldSeeOneTransactionMsg, expectedSingleTransaction, user2Transactions.Pagination.Total)
	}

	if len(user1Transactions.Data) > 0 && len(user2Transactions.Data) > 0 {
		user1Tx := user1Transactions.Data[0]
		user2Tx := user2Transactions.Data[0]

		if user1Tx.Description == user2Tx.Description {
			t.Error(usersShouldNotSeeEachOthersTransactionsMsg)
		}

		if user1Tx.Description != user1SalaryDesc {
			t.Errorf(user1ShouldSeeOwnTransactionMsg, user1Tx.Description)
		}

		if user2Tx.Description != user2SalaryDesc {
			t.Errorf(user2ShouldSeeOwnTransactionMsg, user2Tx.Description)
		}
	}
}

func TestDashboardIsolation(t *testing.T) {
	userPayload := map[string]interface{}{
		"email":    dashboardIsolationEmail,
		"password": testPassword,
		"name":     dashboardIsolationName,
	}

	registerResp, err := makeRequest("POST", registerEndpoint, userPayload)
	if err != nil {
		t.Fatalf(failedRegisterMsg, err)
	}
	defer registerResp.Body.Close()

	var auth AuthResponse
	if err := json.NewDecoder(registerResp.Body).Decode(&auth); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	transactions := []map[string]interface{}{
		{"type": incomeType, "description": isolatedIncomeDesc, "amount": isolatedIncomeAmount, "date": testDate},
		{"type": expenseType, "description": isolatedExpenseDesc, "amount": isolatedExpenseAmount, "date": testDate},
	}

	for _, tx := range transactions {
		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tx, auth.Token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()
	}

	dashResp, err := makeRequestWithAuth("GET", dashboardSummaryEndpoint, nil, auth.Token)
	if err != nil {
		t.Fatalf(failedGetDashboardMsg, err)
	}
	defer dashResp.Body.Close()

	var dashboard DashboardSummary
	if err := json.NewDecoder(dashResp.Body).Decode(&dashboard); err != nil {
		t.Fatalf(failedDecodeDashboardMsg, err)
	}

	expectedBalance := isolatedIncomeAmount - isolatedExpenseAmount

	if dashboard.Totals.TotalIncome != isolatedIncomeAmount {
		t.Errorf("Expected income %f, got %f", isolatedIncomeAmount, dashboard.Totals.TotalIncome)
	}

	if dashboard.Totals.TotalExpenses != isolatedExpenseAmount {
		t.Errorf("Expected expenses %f, got %f", isolatedExpenseAmount, dashboard.Totals.TotalExpenses)
	}

	if dashboard.Totals.Balance != expectedBalance {
		t.Errorf("Expected balance %f, got %f", expectedBalance, dashboard.Totals.Balance)
	}
}

func TestInvestmentIsolation(t *testing.T) {
	user1Token, err := createAuthenticatedUser("invuser1@test.com", "Investment User 1")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	user2Token, err := createAuthenticatedUser("invuser2@test.com", "Investment User 2")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// User 1 creates investment
	user1Investment := map[string]interface{}{
		"name":   "User 1 Investment",
		"amount": investmentAmount1,
		"rate":   rate100,
		"date":   testDate,
		"type":   tesouroDiretoType,
	}

	createResp1, err := makeRequestWithAuth("POST", investmentsEndpoint, user1Investment, user1Token)
	if err != nil {
		t.Fatalf("Failed to create investment for user 1: %v", err)
	}
	createResp1.Body.Close()

	// User 2 creates investment
	user2Investment := map[string]interface{}{
		"name":   "User 2 Investment",
		"amount": investmentAmount2,
		"rate":   rate110,
		"date":   testDate,
		"type":   cdbType,
	}

	createResp2, err := makeRequestWithAuth("POST", investmentsEndpoint, user2Investment, user2Token)
	if err != nil {
		t.Fatalf("Failed to create investment for user 2: %v", err)
	}
	createResp2.Body.Close()

	// User 1 gets investments - should only see their own
	getResp1, err := makeRequestWithAuth("GET", investmentsEndpoint, nil, user1Token)
	if err != nil {
		t.Fatalf("Failed to get investments for user 1: %v", err)
	}
	defer getResp1.Body.Close()

	var user1Investments InvestmentPaginatedResponse
	if err := json.NewDecoder(getResp1.Body).Decode(&user1Investments); err != nil {
		t.Fatalf("Failed to decode user 1 investments: %v", err)
	}

	// User 2 gets investments - should only see their own
	getResp2, err := makeRequestWithAuth("GET", investmentsEndpoint, nil, user2Token)
	if err != nil {
		t.Fatalf("Failed to get investments for user 2: %v", err)
	}
	defer getResp2.Body.Close()

	var user2Investments InvestmentPaginatedResponse
	if err := json.NewDecoder(getResp2.Body).Decode(&user2Investments); err != nil {
		t.Fatalf("Failed to decode user 2 investments: %v", err)
	}

	if user1Investments.Pagination.Total != expectedSingleTransaction {
		t.Errorf("User 1 should see %d investment, got %d", expectedSingleTransaction, user1Investments.Pagination.Total)
	}

	if user2Investments.Pagination.Total != expectedSingleTransaction {
		t.Errorf("User 2 should see %d investment, got %d", expectedSingleTransaction, user2Investments.Pagination.Total)
	}

	// Verify data isolation
	if len(user1Investments.Data) > 0 && len(user2Investments.Data) > 0 {
		user1Inv := user1Investments.Data[0]
		user2Inv := user2Investments.Data[0]

		if user1Inv.Name == user2Inv.Name {
			t.Error("Users should not see each other's investments")
		}

		if user1Inv.Name != "User 1 Investment" {
			t.Errorf("User 1 should see their own investment, got %s", user1Inv.Name)
		}

		if user2Inv.Name != "User 2 Investment" {
			t.Errorf("User 2 should see their own investment, got %s", user2Inv.Name)
		}
	}
}

func TestOverviewIsolation(t *testing.T) {
	user1Token, err := createAuthenticatedUser("overviewuser1@test.com", "Overview User 1")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	user2Token, err := createAuthenticatedUser("overviewuser2@test.com", "Overview User 2")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// User 1 creates data
	user1Data := []map[string]interface{}{
		{"type": incomeType, "description": "User 1 Income", "amount": 1000.0, "date": testDate},
	}

	for _, tx := range user1Data {
		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tx, user1Token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()
	}

	// User 2 creates different data
	user2Data := []map[string]interface{}{
		{"type": incomeType, "description": "User 2 Income", "amount": 2000.0, "date": testDate},
	}

	for _, tx := range user2Data {
		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tx, user2Token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()
	}

	// Get overview for user 1
	overviewResp1, err := makeRequestWithAuth("GET", overviewEndpoint, nil, user1Token)
	if err != nil {
		t.Fatalf("Failed to get overview for user 1: %v", err)
	}
	defer overviewResp1.Body.Close()

	var overview1 OverviewData
	if err := json.NewDecoder(overviewResp1.Body).Decode(&overview1); err != nil {
		t.Fatalf("Failed to decode user 1 overview: %v", err)
	}

	// Get overview for user 2
	overviewResp2, err := makeRequestWithAuth("GET", overviewEndpoint, nil, user2Token)
	if err != nil {
		t.Fatalf("Failed to get overview for user 2: %v", err)
	}
	defer overviewResp2.Body.Close()

	var overview2 OverviewData
	if err := json.NewDecoder(overviewResp2.Body).Decode(&overview2); err != nil {
		t.Fatalf("Failed to decode user 2 overview: %v", err)
	}

	// Verify isolation
	if overview1.Summary.TotalIncome != 1000.0 {
		t.Errorf("User 1 should see income 1000.0, got %f", overview1.Summary.TotalIncome)
	}

	if overview2.Summary.TotalIncome != 2000.0 {
		t.Errorf("User 2 should see income 2000.0, got %f", overview2.Summary.TotalIncome)
	}

	if overview1.Summary.TotalIncome == overview2.Summary.TotalIncome {
		t.Error("Users should see different overview data")
	}
}
