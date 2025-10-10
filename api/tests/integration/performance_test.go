package integration

import (
	"fmt"
	"testing"
	"time"
)

func TestPerformanceWithIndexes(t *testing.T) {
	// Create many transactions for performance testing
	start := time.Now()
	
	for i := 1; i <= 100; i++ {
		payload := map[string]interface{}{
			"type":        "income",
			"description": fmt.Sprintf("Performance Test Transaction %d", i),
			"amount":      float64(100 * i),
			"date":        "2024-10-09",
		}

		resp, err := makeRequest("POST", "/api/transactions", payload)
		if err != nil {
			t.Fatalf("Failed to create transaction %d: %v", i, err)
		}
		resp.Body.Close()
	}

	creationTime := time.Since(start)
	t.Logf("Created 100 transactions in %v", creationTime)

	// Test query performance
	start = time.Now()
	
	resp, err := makeRequest("GET", "/api/transactions?page=1&limit=50", nil)
	if err != nil {
		t.Fatalf("Failed to query transactions: %v", err)
	}
	resp.Body.Close()

	queryTime := time.Since(start)
	t.Logf("Queried transactions in %v", queryTime)

	// Query should be fast (under 100ms for this dataset)
	if queryTime > 100*time.Millisecond {
		t.Errorf("Query took too long: %v (expected < 100ms)", queryTime)
	}

	// Test search performance
	start = time.Now()
	
	resp, err = makeRequest("GET", "/api/transactions?search=Performance", nil)
	if err != nil {
		t.Fatalf("Failed to search transactions: %v", err)
	}
	resp.Body.Close()

	searchTime := time.Since(start)
	t.Logf("Searched transactions in %v", searchTime)

	// Search should also be reasonably fast
	if searchTime > 200*time.Millisecond {
		t.Errorf("Search took too long: %v (expected < 200ms)", searchTime)
	}
}

func TestInvestmentPerformance(t *testing.T) {
	// Create many investments
	start := time.Now()
	
	for i := 1; i <= 50; i++ {
		payload := map[string]interface{}{
			"name":   fmt.Sprintf("Performance Investment %d", i),
			"amount": float64(1000 * i),
			"rate":   100.0 + float64(i),
			"date":   "2024-10-09",
			"type":   "Test",
		}

		resp, err := makeRequest("POST", "/api/investments", payload)
		if err != nil {
			t.Fatalf("Failed to create investment %d: %v", i, err)
		}
		resp.Body.Close()
	}

	creationTime := time.Since(start)
	t.Logf("Created 50 investments in %v", creationTime)

	// Test query performance
	start = time.Now()
	
	resp, err := makeRequest("GET", "/api/investments?page=1&limit=25", nil)
	if err != nil {
		t.Fatalf("Failed to query investments: %v", err)
	}
	resp.Body.Close()

	queryTime := time.Since(start)
	t.Logf("Queried investments in %v", queryTime)

	if queryTime > 100*time.Millisecond {
		t.Errorf("Investment query took too long: %v (expected < 100ms)", queryTime)
	}
}

func TestDashboardPerformance(t *testing.T) {
	// Test dashboard performance with existing data
	start := time.Now()
	
	resp, err := makeRequest("GET", "/api/dashboard/summary", nil)
	if err != nil {
		t.Fatalf("Failed to get dashboard summary: %v", err)
	}
	resp.Body.Close()

	dashboardTime := time.Since(start)
	t.Logf("Dashboard summary loaded in %v", dashboardTime)

	// Dashboard aggregations should be fast
	if dashboardTime > 300*time.Millisecond {
		t.Errorf("Dashboard took too long: %v (expected < 300ms)", dashboardTime)
	}

	// Test overview performance
	start = time.Now()
	
	resp, err = makeRequest("GET", "/api/overview", nil)
	if err != nil {
		t.Fatalf("Failed to get overview: %v", err)
	}
	resp.Body.Close()

	overviewTime := time.Since(start)
	t.Logf("Overview loaded in %v", overviewTime)

	// Overview with aggregations should be reasonably fast
	if overviewTime > 500*time.Millisecond {
		t.Errorf("Overview took too long: %v (expected < 500ms)", overviewTime)
	}
}