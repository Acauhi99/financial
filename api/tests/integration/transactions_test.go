package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"
)

const (
	// Endpoints
	transactionsEndpoint = "/api/transactions"

	// Test data
	transactionUserEmail = "transaction@test.com"
	transactionUserName = "Transaction User"
	getTransUserEmail = "gettrans@test.com"
	getTransUserName = "Get Trans User"
	validationUserEmail = "validation@test.com"
	validationUserName = "Validation User"

	// Transaction types
	incomeType = "income"
	expenseType = "expense"
	invalidType = "invalid"

	// Descriptions
	testSalaryDesc = "Test Salary"
	testExpenseDesc = "Test Expense"
	testDesc = "Test"

	// Amounts
	salaryAmount = 5000.0
	expenseAmount = 100.0
	negativeAmount = -100.0

	// Dates
	testDate = "2024-10-09"

	// Error messages
	failedCreateUserMsg = "Failed to create authenticated user: %v"
	failedCreateTransactionMsg = "Failed to create transaction: %v"
	expectedTransactionIDMsg = "Expected transaction ID to be set"
	expectedAtLeastOneTransactionMsg = "Expected at least one transaction"
	expectedTransactionsDataNotEmptyMsg = "Expected transactions data to not be empty"

	// Rate limiting
	rateLimitDelay = 200 * time.Millisecond
)

type Transaction struct {
	ID          string    `json:"id"`
	Type        string    `json:"type"`
	Description string    `json:"description"`
	Amount      float64   `json:"amount"`
	Date        string    `json:"date"`
	CategoryID  *string   `json:"categoryId,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type PaginatedResponse struct {
	Data       []Transaction `json:"data"`
	Pagination Pagination    `json:"pagination"`
}

type Pagination struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"totalPages"`
}

func TestCreateTransaction(t *testing.T) {
	token, err := createAuthenticatedUser(transactionUserEmail, transactionUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	payload := map[string]interface{}{
		"type":        incomeType,
		"description": testSalaryDesc,
		"amount":      salaryAmount,
		"date":        testDate,
	}

	resp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", resp.StatusCode)
	}

	var transaction Transaction
	if err := json.NewDecoder(resp.Body).Decode(&transaction); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if transaction.ID == emptyString {
		t.Error(expectedTransactionIDMsg)
	}

	if transaction.Type != incomeType {
		t.Errorf("Expected type '%s', got %s", incomeType, transaction.Type)
	}

	if transaction.Description != testSalaryDesc {
		t.Errorf("Expected description '%s', got %s", testSalaryDesc, transaction.Description)
	}

	if transaction.Amount != salaryAmount {
		t.Errorf("Expected amount %f, got %f", salaryAmount, transaction.Amount)
	}
}

func TestGetTransactions(t *testing.T) {
	token, err := createAuthenticatedUser(getTransUserEmail, getTransUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	payload := map[string]interface{}{
		"type":        expenseType,
		"description": testExpenseDesc,
		"amount":      expenseAmount,
		"date":        testDate,
	}

	createResp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
	if err != nil {
		t.Fatalf(failedCreateTransactionMsg, err)
	}
	createResp.Body.Close()

	resp, err := makeRequestWithAuth("GET", transactionsEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var response PaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if response.Pagination.Total == 0 {
		t.Error(expectedAtLeastOneTransactionMsg)
	}

	if len(response.Data) == 0 {
		t.Error(expectedTransactionsDataNotEmptyMsg)
	}
}

func TestTransactionValidation(t *testing.T) {
	token, err := createAuthenticatedUser(validationUserEmail, validationUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	tests := []struct {
		name     string
		payload  map[string]interface{}
		expected int
	}{
		{
			name:     "missing type",
			payload:  map[string]interface{}{"description": testDesc, "amount": expenseAmount, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "invalid type",
			payload:  map[string]interface{}{"type": invalidType, "description": testDesc, "amount": expenseAmount, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing amount",
			payload:  map[string]interface{}{"type": incomeType, "description": testDesc, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "negative amount",
			payload:  map[string]interface{}{"type": incomeType, "description": testDesc, "amount": negativeAmount, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing description",
			payload:  map[string]interface{}{"type": incomeType, "amount": expenseAmount, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty description",
			payload:  map[string]interface{}{"type": incomeType, "description": emptyString, "amount": expenseAmount, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing date",
			payload:  map[string]interface{}{"type": incomeType, "description": testDesc, "amount": expenseAmount},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty date",
			payload:  map[string]interface{}{"type": incomeType, "description": testDesc, "amount": expenseAmount, "date": emptyString},
			expected: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			time.Sleep(rateLimitDelay)

			resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tt.payload, token)
			if err != nil {
				t.Fatalf(failedRequestMsg, err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != tt.expected {
				t.Errorf("Expected status %d, got %d", tt.expected, resp.StatusCode)
			}
		})
	}
}

func TestTransactionUnauthorizedAccess(t *testing.T) {
	payload := map[string]interface{}{
		"type":        incomeType,
		"description": testSalaryDesc,
		"amount":      salaryAmount,
		"date":        testDate,
	}

	resp, err := makeRequest("POST", transactionsEndpoint, payload)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}

	resp, err = makeRequest("GET", transactionsEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestTransactionPagination(t *testing.T) {
	// Use unique email to avoid conflicts with other tests
	uniqueEmail := fmt.Sprintf("pagination-%d@test.com", time.Now().UnixNano())
	token, err := createAuthenticatedUser(uniqueEmail, "Pagination User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create multiple transactions
	for i := 1; i <= 25; i++ {
		payload := map[string]interface{}{
			"type":        incomeType,
			"description": "Transaction " + string(rune(i)),
			"amount":      float64(100 * i),
			"date":        testDate,
		}

		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
		if err != nil {
			t.Fatalf("Failed to create transaction %d: %v", i, err)
		}
		resp.Body.Close()
	}

	// Wait for transactions to be persisted
	time.Sleep(100 * time.Millisecond)

	// Test pagination
	resp, err := makeRequestWithAuth("GET", transactionsEndpoint+"?page=1&limit=10", nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var response PaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if response.Pagination.Page != 1 {
		t.Errorf("Expected page 1, got %d", response.Pagination.Page)
	}

	if response.Pagination.Limit != 10 {
		t.Errorf("Expected limit 10, got %d", response.Pagination.Limit)
	}

	if len(response.Data) > 10 {
		t.Errorf("Expected max 10 items, got %d", len(response.Data))
	}
}

func TestTransactionSearch(t *testing.T) {
	// Use unique email to avoid conflicts with other tests
	uniqueEmail := fmt.Sprintf("search-%d@test.com", time.Now().UnixNano())
	token, err := createAuthenticatedUser(uniqueEmail, "Search User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	searchableDesc := "Searchable Transaction"
	payload := map[string]interface{}{
		"type":        incomeType,
		"description": searchableDesc,
		"amount":      salaryAmount,
		"date":        testDate,
	}

	createResp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
	if err != nil {
		t.Fatalf(failedCreateTransactionMsg, err)
	}
	createResp.Body.Close()

	// Wait for transaction to be persisted
	time.Sleep(100 * time.Millisecond)

	resp, err := makeRequestWithAuth("GET", transactionsEndpoint+"?search=Searchable", nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var response PaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	found := false
	for _, tx := range response.Data {
		if tx.Description == searchableDesc {
			found = true
			break
		}
	}

	if !found {
		t.Error("Expected to find searchable transaction in results")
	}
}

func TestTransactionTypeFilter(t *testing.T) {
	token, err := createAuthenticatedUser("filter@test.com", "Filter User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create income and expense transactions
	transactions := []map[string]interface{}{
		{"type": incomeType, "description": "Income 1", "amount": 1000.0, "date": testDate},
		{"type": expenseType, "description": "Expense 1", "amount": 500.0, "date": testDate},
	}

	for _, tx := range transactions {
		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tx, token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()
	}

	// Test income filter
	resp, err := makeRequestWithAuth("GET", transactionsEndpoint+"?type="+incomeType, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var response PaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	for _, tx := range response.Data {
		if tx.Type != incomeType {
			t.Errorf("Expected only income transactions, found %s", tx.Type)
		}
	}
}
