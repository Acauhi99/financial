package integration

import (
	"encoding/json"
	"net/http"
	"testing"
	"time"
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
	payload := map[string]interface{}{
		"type":        "income",
		"description": "Test Salary",
		"amount":      5000.0,
		"date":        "2024-10-09",
	}

	resp, err := makeRequest("POST", "/api/transactions", payload)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", resp.StatusCode)
	}

	var transaction Transaction
	if err := json.NewDecoder(resp.Body).Decode(&transaction); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if transaction.ID == "" {
		t.Error("Expected transaction ID to be set")
	}

	if transaction.Type != "income" {
		t.Errorf("Expected type 'income', got %s", transaction.Type)
	}

	if transaction.Description != "Test Salary" {
		t.Errorf("Expected description 'Test Salary', got %s", transaction.Description)
	}

	if transaction.Amount != 5000.0 {
		t.Errorf("Expected amount 5000.0, got %f", transaction.Amount)
	}
}

func TestGetTransactions(t *testing.T) {
	// First create a transaction
	payload := map[string]interface{}{
		"type":        "expense",
		"description": "Test Expense",
		"amount":      100.0,
		"date":        "2024-10-09",
	}

	createResp, err := makeRequest("POST", "/api/transactions", payload)
	if err != nil {
		t.Fatalf("Failed to create transaction: %v", err)
	}
	createResp.Body.Close()

	// Now get transactions
	resp, err := makeRequest("GET", "/api/transactions", nil)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var response PaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Pagination.Total == 0 {
		t.Error("Expected at least one transaction")
	}

	if len(response.Data) == 0 {
		t.Error("Expected transactions data to not be empty")
	}
}

func TestTransactionValidation(t *testing.T) {
	tests := []struct {
		name     string
		payload  map[string]interface{}
		expected int
	}{
		{
			name:     "missing type",
			payload:  map[string]interface{}{"description": "Test", "amount": 100.0, "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "invalid type",
			payload:  map[string]interface{}{"type": "invalid", "description": "Test", "amount": 100.0, "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing amount",
			payload:  map[string]interface{}{"type": "income", "description": "Test", "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "negative amount",
			payload:  map[string]interface{}{"type": "income", "description": "Test", "amount": -100.0, "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Add small delay to avoid rate limiting
			time.Sleep(200 * time.Millisecond)

			resp, err := makeRequest("POST", "/api/transactions", tt.payload)
			if err != nil {
				t.Fatalf("Failed to make request: %v", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != tt.expected {
				t.Errorf("Expected status %d, got %d", tt.expected, resp.StatusCode)
			}
		})
	}
}
