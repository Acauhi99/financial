package integration

import (
	"encoding/json"
	"testing"
)

func TestMultiTenancy(t *testing.T) {
	// Register two different users
	user1Payload := map[string]interface{}{
		"email":    "user1@example.com",
		"password": "password123",
		"name":     "User One",
	}

	user2Payload := map[string]interface{}{
		"email":    "user2@example.com",
		"password": "password123",
		"name":     "User Two",
	}

	// Register user 1
	resp1, err := makeRequest("POST", "/api/auth/register", user1Payload)
	if err != nil {
		t.Fatalf("Failed to register user 1: %v", err)
	}
	defer resp1.Body.Close()

	var auth1 AuthResponse
	if err := json.NewDecoder(resp1.Body).Decode(&auth1); err != nil {
		t.Fatalf("Failed to decode user 1 response: %v", err)
	}

	// Register user 2
	resp2, err := makeRequest("POST", "/api/auth/register", user2Payload)
	if err != nil {
		t.Fatalf("Failed to register user 2: %v", err)
	}
	defer resp2.Body.Close()

	var auth2 AuthResponse
	if err := json.NewDecoder(resp2.Body).Decode(&auth2); err != nil {
		t.Fatalf("Failed to decode user 2 response: %v", err)
	}

	// User 1 creates a transaction
	user1Transaction := map[string]interface{}{
		"type":        "income",
		"description": "User 1 Salary",
		"amount":      5000.0,
		"date":        "2024-10-09",
	}

	createResp1, err := makeRequestWithAuth("POST", "/api/transactions", user1Transaction, auth1.Token)
	if err != nil {
		t.Fatalf("Failed to create transaction for user 1: %v", err)
	}
	createResp1.Body.Close()

	// User 2 creates a transaction
	user2Transaction := map[string]interface{}{
		"type":        "income",
		"description": "User 2 Salary",
		"amount":      3000.0,
		"date":        "2024-10-09",
	}

	createResp2, err := makeRequestWithAuth("POST", "/api/transactions", user2Transaction, auth2.Token)
	if err != nil {
		t.Fatalf("Failed to create transaction for user 2: %v", err)
	}
	createResp2.Body.Close()

	// User 1 gets their transactions - should only see their own
	getResp1, err := makeRequestWithAuth("GET", "/api/transactions", nil, auth1.Token)
	if err != nil {
		t.Fatalf("Failed to get transactions for user 1: %v", err)
	}
	defer getResp1.Body.Close()

	var user1Transactions PaginatedResponse
	if err := json.NewDecoder(getResp1.Body).Decode(&user1Transactions); err != nil {
		t.Fatalf("Failed to decode user 1 transactions: %v", err)
	}

	if user1Transactions.Pagination.Total != 1 {
		t.Errorf("User 1 should see 1 transaction, got %d", user1Transactions.Pagination.Total)
	}

	// User 2 gets their transactions - should only see their own
	getResp2, err := makeRequestWithAuth("GET", "/api/transactions", nil, auth2.Token)
	if err != nil {
		t.Fatalf("Failed to get transactions for user 2: %v", err)
	}
	defer getResp2.Body.Close()

	var user2Transactions PaginatedResponse
	if err := json.NewDecoder(getResp2.Body).Decode(&user2Transactions); err != nil {
		t.Fatalf("Failed to decode user 2 transactions: %v", err)
	}

	if user2Transactions.Pagination.Total != 1 {
		t.Errorf("User 2 should see 1 transaction, got %d", user2Transactions.Pagination.Total)
	}

	// Verify transaction descriptions are different (data isolation)
	if len(user1Transactions.Data) > 0 && len(user2Transactions.Data) > 0 {
		user1Tx := user1Transactions.Data[0]
		user2Tx := user2Transactions.Data[0]

		if user1Tx.Description == user2Tx.Description {
			t.Error("Users should not see each other's transactions")
		}

		if user1Tx.Description != "User 1 Salary" {
			t.Errorf("User 1 should see their own transaction, got %v", user1Tx.Description)
		}

		if user2Tx.Description != "User 2 Salary" {
			t.Errorf("User 2 should see their own transaction, got %v", user2Tx.Description)
		}
	}
}

func TestDashboardIsolation(t *testing.T) {
	// Register user
	userPayload := map[string]interface{}{
		"email":    "dashboard@example.com",
		"password": "password123",
		"name":     "Dashboard User",
	}

	registerResp, err := makeRequest("POST", "/api/auth/register", userPayload)
	if err != nil {
		t.Fatalf("Failed to register user: %v", err)
	}
	defer registerResp.Body.Close()

	var auth AuthResponse
	if err := json.NewDecoder(registerResp.Body).Decode(&auth); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	// Create some data for this user
	transactions := []map[string]interface{}{
		{"type": "income", "description": "Isolated Income", "amount": 2000.0, "date": "2024-10-09"},
		{"type": "expense", "description": "Isolated Expense", "amount": 500.0, "date": "2024-10-09"},
	}

	for _, tx := range transactions {
		resp, err := makeRequestWithAuth("POST", "/api/transactions", tx, auth.Token)
		if err != nil {
			t.Fatalf("Failed to create transaction: %v", err)
		}
		resp.Body.Close()
	}

	// Get dashboard summary - should only include this user's data
	dashResp, err := makeRequestWithAuth("GET", "/api/dashboard/summary", nil, auth.Token)
	if err != nil {
		t.Fatalf("Failed to get dashboard: %v", err)
	}
	defer dashResp.Body.Close()

	var dashboard DashboardSummary
	if err := json.NewDecoder(dashResp.Body).Decode(&dashboard); err != nil {
		t.Fatalf("Failed to decode dashboard: %v", err)
	}

	// Verify totals match only this user's data
	expectedIncome := 2000.0
	expectedExpenses := 500.0
	expectedBalance := expectedIncome - expectedExpenses

	if dashboard.Totals.TotalIncome != expectedIncome {
		t.Errorf("Expected income %f, got %f", expectedIncome, dashboard.Totals.TotalIncome)
	}

	if dashboard.Totals.TotalExpenses != expectedExpenses {
		t.Errorf("Expected expenses %f, got %f", expectedExpenses, dashboard.Totals.TotalExpenses)
	}

	if dashboard.Totals.Balance != expectedBalance {
		t.Errorf("Expected balance %f, got %f", expectedBalance, dashboard.Totals.Balance)
	}
}