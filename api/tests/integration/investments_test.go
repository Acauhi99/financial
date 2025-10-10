package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"
)

type Investment struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Amount        float64   `json:"amount"`
	Rate          float64   `json:"rate"`
	MonthlyReturn float64   `json:"monthlyReturn"`
	Date          string    `json:"date"`
	Type          *string   `json:"type,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type InvestmentPaginatedResponse struct {
	Data       []Investment `json:"data"`
	Pagination Pagination   `json:"pagination"`
}

func TestCreateInvestment(t *testing.T) {
	token, err := createAuthenticatedUser("investment@test.com", "Investment User")
	if err != nil {
		t.Fatalf("Failed to create authenticated user: %v", err)
	}

	payload := map[string]interface{}{
		"name":   "Tesouro Selic 2029",
		"amount": 10000.0,
		"rate":   100.0,
		"date":   "2024-10-09",
		"type":   "Tesouro Direto",
	}

	resp, err := makeRequestWithAuth("POST", "/api/investments", payload, token)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", resp.StatusCode)
	}

	var investment Investment
	if err := json.NewDecoder(resp.Body).Decode(&investment); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if investment.ID == "" {
		t.Error("Expected investment ID to be set")
	}

	if investment.Name != "Tesouro Selic 2029" {
		t.Errorf("Expected name 'Tesouro Selic 2029', got %s", investment.Name)
	}

	if investment.Amount != 10000.0 {
		t.Errorf("Expected amount 10000.0, got %f", investment.Amount)
	}

	if investment.Rate != 100.0 {
		t.Errorf("Expected rate 100.0, got %f", investment.Rate)
	}

	// Verify monthly return calculation
	expectedMonthlyReturn := (10000.0 * (100.0 / 100)) / 12
	if investment.MonthlyReturn != expectedMonthlyReturn {
		t.Errorf("Expected monthly return %f, got %f", expectedMonthlyReturn, investment.MonthlyReturn)
	}

	if investment.Type == nil || *investment.Type != "Tesouro Direto" {
		t.Errorf("Expected type 'Tesouro Direto', got %v", investment.Type)
	}
}

func TestGetInvestments(t *testing.T) {
	token, err := createAuthenticatedUser("getinv@test.com", "Get Inv User")
	if err != nil {
		t.Fatalf("Failed to create authenticated user: %v", err)
	}

	// Create test investments
	investments := []map[string]interface{}{
		{"name": "CDB Bank", "amount": 5000.0, "rate": 110.0, "date": "2024-10-09", "type": "CDB"},
		{"name": "LCI Santander", "amount": 8000.0, "rate": 95.0, "date": "2024-10-08", "type": "LCI"},
	}

	for _, inv := range investments {
		createResp, err := makeRequestWithAuth("POST", "/api/investments", inv, token)
		if err != nil {
			t.Fatalf("Failed to create investment: %v", err)
		}
		createResp.Body.Close()
	}

	// Get investments
	resp, err := makeRequestWithAuth("GET", "/api/investments", nil, token)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var response InvestmentPaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Pagination.Total == 0 {
		t.Error("Expected at least one investment")
	}

	if len(response.Data) == 0 {
		t.Error("Expected investments data to not be empty")
	}
}

func TestInvestmentSearch(t *testing.T) {
	token, err := createAuthenticatedUser("search@test.com", "Search User")
	if err != nil {
		t.Fatalf("Failed to create authenticated user: %v", err)
	}

	// Create test investment
	payload := map[string]interface{}{
		"name":   "Tesouro IPCA+ 2035",
		"amount": 15000.0,
		"rate":   105.0,
		"date":   "2024-10-09",
		"type":   "Tesouro Direto",
	}

	createResp, err := makeRequestWithAuth("POST", "/api/investments", payload, token)
	if err != nil {
		t.Fatalf("Failed to create investment: %v", err)
	}
	createResp.Body.Close()

	// Search for investment
	resp, err := makeRequestWithAuth("GET", "/api/investments?search=IPCA", nil, token)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var response InvestmentPaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	found := false
	for _, inv := range response.Data {
		if inv.Name == "Tesouro IPCA+ 2035" {
			found = true
			break
		}
	}

	if !found {
		t.Error("Expected to find investment with IPCA in search results")
	}
}

func TestInvestmentValidation(t *testing.T) {
	token, err := createAuthenticatedUser("invvalid@test.com", "Inv Valid User")
	if err != nil {
		t.Fatalf("Failed to create authenticated user: %v", err)
	}

	tests := []struct {
		name     string
		payload  map[string]interface{}
		expected int
	}{
		{
			name:     "missing name",
			payload:  map[string]interface{}{"amount": 1000.0, "rate": 100.0, "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing amount",
			payload:  map[string]interface{}{"name": "Test Investment", "rate": 100.0, "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "negative amount",
			payload:  map[string]interface{}{"name": "Test Investment", "amount": -1000.0, "rate": 100.0, "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing rate",
			payload:  map[string]interface{}{"name": "Test Investment", "amount": 1000.0, "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "negative rate",
			payload:  map[string]interface{}{"name": "Test Investment", "amount": 1000.0, "rate": -10.0, "date": "2024-10-09"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing date",
			payload:  map[string]interface{}{"name": "Test Investment", "amount": 1000.0, "rate": 100.0},
			expected: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Add delay to avoid rate limiting
			time.Sleep(200 * time.Millisecond)
			
			resp, err := makeRequestWithAuth("POST", "/api/investments", tt.payload, token)
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

func TestInvestmentPagination(t *testing.T) {
	token, err := createAuthenticatedUser("pagination@test.com", "Pagination User")
	if err != nil {
		t.Fatalf("Failed to create authenticated user: %v", err)
	}

	// Create multiple investments
	for i := 1; i <= 15; i++ {
		payload := map[string]interface{}{
			"name":   fmt.Sprintf("Investment %d", i),
			"amount": float64(1000 * i),
			"rate":   100.0,
			"date":   "2024-10-09",
		}

		resp, err := makeRequestWithAuth("POST", "/api/investments", payload, token)
		if err != nil {
			t.Fatalf("Failed to create investment %d: %v", i, err)
		}
		resp.Body.Close()
	}

	// Test first page
	resp, err := makeRequestWithAuth("GET", "/api/investments?page=1&limit=10", nil, token)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	var response InvestmentPaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if response.Pagination.Page != 1 {
		t.Errorf("Expected page 1, got %d", response.Pagination.Page)
	}

	if response.Pagination.Limit != 10 {
		t.Errorf("Expected limit 10, got %d", response.Pagination.Limit)
	}

	if response.Pagination.Total < 15 {
		t.Errorf("Expected total >= 15, got %d", response.Pagination.Total)
	}

	if len(response.Data) > 10 {
		t.Errorf("Expected max 10 items, got %d", len(response.Data))
	}
}