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
	investmentsEndpoint = "/api/investments"

	// Test data
	investmentUserEmail = "investment@test.com"
	investmentUserName = "Investment User"
	getInvUserEmail = "getinv@test.com"
	getInvUserName = "Get Inv User"
	searchUserEmail = "invsearch@test.com"
	searchUserName = "Search User"
	invValidUserEmail = "invvalid@test.com"
	invValidUserName = "Inv Valid User"
	paginationUserEmail = "invpagination@test.com"
	paginationUserName = "Pagination User"

	// Investment names
	tesouroSelicName = "Tesouro Selic 2029"
	tesouroIPCAName = "Tesouro IPCA+ 2035"
	cdbBankName = "CDB Bank"
	lciSantanderName = "LCI Santander"
	testInvestmentName = "Test Investment"

	// Investment types
	tesouroDiretoType = "Tesouro Direto"
	cdbType = "CDB"
	lciType = "LCI"

	// Amounts
	investmentAmount1 = 10000.0
	investmentAmount2 = 5000.0
	investmentAmount3 = 8000.0
	investmentAmount4 = 15000.0
	testAmount = 1000.0
	negativeInvestmentAmount = -1000.0

	// Rates
	rate100 = 100.0
	rate110 = 110.0
	rate95 = 95.0
	rate105 = 105.0
	negativeRate = -10.0

	// Search terms
	ipcaSearchTerm = "IPCA"

	// Error messages
	expectedInvestmentIDMsg = "Expected investment ID to be set"
	expectedAtLeastOneInvestmentMsg = "Expected at least one investment"
	expectedInvestmentsDataNotEmptyMsg = "Expected investments data to not be empty"
	expectedToFindInvestmentMsg = "Expected to find investment with IPCA in search results"

	// Pagination
	maxInvestments = 15
	paginationLimit = 10
	paginationPage1 = 1
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
	token, err := createAuthenticatedUser(investmentUserEmail, investmentUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	payload := map[string]interface{}{
		"name":   tesouroSelicName,
		"amount": investmentAmount1,
		"rate":   rate100,
		"date":   testDate,
		"type":   tesouroDiretoType,
	}

	resp, err := makeRequestWithAuth("POST", investmentsEndpoint, payload, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", resp.StatusCode)
	}

	var investment Investment
	if err := json.NewDecoder(resp.Body).Decode(&investment); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if investment.ID == emptyString {
		t.Error(expectedInvestmentIDMsg)
	}

	if investment.Name != tesouroSelicName {
		t.Errorf("Expected name '%s', got %s", tesouroSelicName, investment.Name)
	}

	if investment.Amount != investmentAmount1 {
		t.Errorf("Expected amount %f, got %f", investmentAmount1, investment.Amount)
	}

	if investment.Rate != rate100 {
		t.Errorf("Expected rate %f, got %f", rate100, investment.Rate)
	}

	expectedMonthlyReturn := (investmentAmount1 * (rate100 / 100)) / 12
	if investment.MonthlyReturn != expectedMonthlyReturn {
		t.Errorf("Expected monthly return %f, got %f", expectedMonthlyReturn, investment.MonthlyReturn)
	}

	if investment.Type == nil || *investment.Type != tesouroDiretoType {
		t.Errorf("Expected type '%s', got %v", tesouroDiretoType, investment.Type)
	}
}

func TestGetInvestments(t *testing.T) {
	token, err := createAuthenticatedUser(getInvUserEmail, getInvUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	investments := []map[string]interface{}{
		{"name": cdbBankName, "amount": investmentAmount2, "rate": rate110, "date": testDate, "type": cdbType},
		{"name": lciSantanderName, "amount": investmentAmount3, "rate": rate95, "date": "2024-10-08", "type": lciType},
	}

	for _, inv := range investments {
		createResp, err := makeRequestWithAuth("POST", investmentsEndpoint, inv, token)
		if err != nil {
			t.Fatalf("Failed to create investment: %v", err)
		}
		createResp.Body.Close()
	}

	resp, err := makeRequestWithAuth("GET", investmentsEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var response InvestmentPaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if response.Pagination.Total == 0 {
		t.Error(expectedAtLeastOneInvestmentMsg)
	}

	if len(response.Data) == 0 {
		t.Error(expectedInvestmentsDataNotEmptyMsg)
	}
}

func TestInvestmentSearch(t *testing.T) {
	// Use unique email to avoid conflicts with other tests
	uniqueEmail := fmt.Sprintf("invsearch-%d@test.com", time.Now().UnixNano())
	token, err := createAuthenticatedUser(uniqueEmail, searchUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	payload := map[string]interface{}{
		"name":   tesouroIPCAName,
		"amount": investmentAmount4,
		"rate":   rate105,
		"date":   testDate,
		"type":   tesouroDiretoType,
	}

	createResp, err := makeRequestWithAuth("POST", investmentsEndpoint, payload, token)
	if err != nil {
		t.Fatalf("Failed to create investment: %v", err)
	}
	createResp.Body.Close()

	// Wait for investment to be persisted
	time.Sleep(100 * time.Millisecond)

	resp, err := makeRequestWithAuth("GET", investmentsEndpoint+"?search="+ipcaSearchTerm, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var response InvestmentPaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	found := false
	for _, inv := range response.Data {
		if inv.Name == tesouroIPCAName {
			found = true
			break
		}
	}

	if !found {
		t.Error(expectedToFindInvestmentMsg)
	}
}

func TestInvestmentValidation(t *testing.T) {
	token, err := createAuthenticatedUser(invValidUserEmail, invValidUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	tests := []struct {
		name     string
		payload  map[string]interface{}
		expected int
	}{
		{
			name:     "missing name",
			payload:  map[string]interface{}{"amount": testAmount, "rate": rate100, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty name",
			payload:  map[string]interface{}{"name": emptyString, "amount": testAmount, "rate": rate100, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing amount",
			payload:  map[string]interface{}{"name": testInvestmentName, "rate": rate100, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "negative amount",
			payload:  map[string]interface{}{"name": testInvestmentName, "amount": negativeInvestmentAmount, "rate": rate100, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "zero amount",
			payload:  map[string]interface{}{"name": testInvestmentName, "amount": 0.0, "rate": rate100, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing rate",
			payload:  map[string]interface{}{"name": testInvestmentName, "amount": testAmount, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "negative rate",
			payload:  map[string]interface{}{"name": testInvestmentName, "amount": testAmount, "rate": negativeRate, "date": testDate},
			expected: http.StatusBadRequest,
		},
		{
			name:     "missing date",
			payload:  map[string]interface{}{"name": testInvestmentName, "amount": testAmount, "rate": rate100},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty date",
			payload:  map[string]interface{}{"name": testInvestmentName, "amount": testAmount, "rate": rate100, "date": emptyString},
			expected: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			time.Sleep(rateLimitDelay)

			resp, err := makeRequestWithAuth("POST", investmentsEndpoint, tt.payload, token)
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

func TestInvestmentPagination(t *testing.T) {
	// Use unique email to avoid conflicts with other tests
	uniqueEmail := fmt.Sprintf("invpagination-%d@test.com", time.Now().UnixNano())
	token, err := createAuthenticatedUser(uniqueEmail, paginationUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	for i := 1; i <= maxInvestments; i++ {
		payload := map[string]interface{}{
			"name":   fmt.Sprintf("Investment %d", i),
			"amount": float64(1000 * i),
			"rate":   rate100,
			"date":   testDate,
		}

		resp, err := makeRequestWithAuth("POST", investmentsEndpoint, payload, token)
		if err != nil {
			t.Fatalf("Failed to create investment %d: %v", i, err)
		}
		resp.Body.Close()
	}

	// Wait for investments to be persisted
	time.Sleep(100 * time.Millisecond)

	resp, err := makeRequestWithAuth("GET", fmt.Sprintf("%s?page=%d&limit=%d", investmentsEndpoint, paginationPage1, paginationLimit), nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var response InvestmentPaginatedResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if response.Pagination.Page != paginationPage1 {
		t.Errorf("Expected page %d, got %d", paginationPage1, response.Pagination.Page)
	}

	if response.Pagination.Limit != paginationLimit {
		t.Errorf("Expected limit %d, got %d", paginationLimit, response.Pagination.Limit)
	}

	if response.Pagination.Total < maxInvestments {
		t.Errorf("Expected total >= %d, got %d", maxInvestments, response.Pagination.Total)
	}

	if len(response.Data) > paginationLimit {
		t.Errorf("Expected max %d items, got %d", paginationLimit, len(response.Data))
	}
}

func TestInvestmentUnauthorizedAccess(t *testing.T) {
	payload := map[string]interface{}{
		"name":   testInvestmentName,
		"amount": testAmount,
		"rate":   rate100,
		"date":   testDate,
	}

	resp, err := makeRequest("POST", investmentsEndpoint, payload)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}

	resp, err = makeRequest("GET", investmentsEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestInvestmentMonthlyReturnCalculation(t *testing.T) {
	token, err := createAuthenticatedUser("calculation@test.com", "Calculation User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	testCases := []struct {
		name           string
		amount         float64
		rate           float64
		expectedReturn float64
	}{
		{"Standard calculation", 10000.0, 100.0, (10000.0 * 1.0) / 12},
		{"High rate", 5000.0, 150.0, (5000.0 * 1.5) / 12},
		{"Low rate", 20000.0, 80.0, (20000.0 * 0.8) / 12},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			payload := map[string]interface{}{
				"name":   "Test " + tc.name,
				"amount": tc.amount,
				"rate":   tc.rate,
				"date":   testDate,
			}

			resp, err := makeRequestWithAuth("POST", investmentsEndpoint, payload, token)
			if err != nil {
				t.Fatalf(failedRequestMsg, err)
			}
			defer resp.Body.Close()

			var investment Investment
			if err := json.NewDecoder(resp.Body).Decode(&investment); err != nil {
				t.Fatalf(failedDecodeMsg, err)
			}

			if investment.MonthlyReturn != tc.expectedReturn {
				t.Errorf("Expected monthly return %f, got %f", tc.expectedReturn, investment.MonthlyReturn)
			}
		})
	}
}
