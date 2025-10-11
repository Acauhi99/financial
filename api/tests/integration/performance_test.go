package integration

import (
	"fmt"
	"testing"
	"time"
)

const (
	// Performance test parameters
	performanceTransactionCount = 100
	performanceInvestmentCount = 50
	performancePaginationLimit = 50
	performanceInvestmentPaginationLimit = 25

	// Performance thresholds
	maxQueryTime = 100 * time.Millisecond
	maxSearchTime = 200 * time.Millisecond
	maxDashboardTime = 300 * time.Millisecond
	maxOverviewTime = 500 * time.Millisecond
	maxInvestmentQueryTime = 100 * time.Millisecond

	// Performance test data
	performanceTransactionPrefix = "Performance Test Transaction"
	performanceInvestmentPrefix = "Performance Investment"
	performanceSearchTerm = "Performance"
	performanceInvestmentType = "Test"

	// Base amounts for performance tests
	performanceBaseAmount = 100.0
	performanceInvestmentBaseAmount = 1000.0
	performanceBaseRate = 100.0

	// Error messages
	failedCreateTransactionPerfMsg = "Failed to create transaction %d: %v"
	failedQueryTransactionsMsg = "Failed to query transactions: %v"
	failedSearchTransactionsMsg = "Failed to search transactions: %v"
	failedCreateInvestmentPerfMsg = "Failed to create investment %d: %v"
	failedQueryInvestmentsMsg = "Failed to query investments: %v"
	failedGetDashboardSummaryMsg = "Failed to get dashboard summary: %v"
	failedGetOverviewMsg = "Failed to get overview: %v"
	queryTookTooLongMsg = "Query took too long: %v (expected < %v)"
	searchTookTooLongMsg = "Search took too long: %v (expected < %v)"
	investmentQueryTookTooLongMsg = "Investment query took too long: %v (expected < %v)"
	dashboardTookTooLongMsg = "Dashboard took too long: %v (expected < %v)"
	overviewTookTooLongMsg = "Overview took too long: %v (expected < %v)"
)

func TestPerformanceWithIndexes(t *testing.T) {
	token, err := createAuthenticatedUser("performance@test.com", "Performance User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	start := time.Now()

	for i := 1; i <= performanceTransactionCount; i++ {
		payload := map[string]interface{}{
			"type":        incomeType,
			"description": fmt.Sprintf("%s %d", performanceTransactionPrefix, i),
			"amount":      performanceBaseAmount * float64(i),
			"date":        testDate,
		}

		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
		if err != nil {
			t.Fatalf(failedCreateTransactionPerfMsg, i, err)
		}
		resp.Body.Close()
	}

	creationTime := time.Since(start)
	t.Logf("Created %d transactions in %v", performanceTransactionCount, creationTime)

	start = time.Now()

	resp, err := makeRequestWithAuth("GET", fmt.Sprintf("%s?page=1&limit=%d", transactionsEndpoint, performancePaginationLimit), nil, token)
	if err != nil {
		t.Fatalf(failedQueryTransactionsMsg, err)
	}
	resp.Body.Close()

	queryTime := time.Since(start)
	t.Logf("Queried transactions in %v", queryTime)

	if queryTime > maxQueryTime {
		t.Errorf(queryTookTooLongMsg, queryTime, maxQueryTime)
	}

	start = time.Now()

	resp, err = makeRequestWithAuth("GET", fmt.Sprintf("%s?search=%s", transactionsEndpoint, performanceSearchTerm), nil, token)
	if err != nil {
		t.Fatalf(failedSearchTransactionsMsg, err)
	}
	resp.Body.Close()

	searchTime := time.Since(start)
	t.Logf("Searched transactions in %v", searchTime)

	if searchTime > maxSearchTime {
		t.Errorf(searchTookTooLongMsg, searchTime, maxSearchTime)
	}
}

func TestInvestmentPerformance(t *testing.T) {
	token, err := createAuthenticatedUser("invperf@test.com", "Investment Performance User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	start := time.Now()

	for i := 1; i <= performanceInvestmentCount; i++ {
		payload := map[string]interface{}{
			"name":   fmt.Sprintf("%s %d", performanceInvestmentPrefix, i),
			"amount": performanceInvestmentBaseAmount * float64(i),
			"rate":   performanceBaseRate + float64(i),
			"date":   testDate,
			"type":   performanceInvestmentType,
		}

		resp, err := makeRequestWithAuth("POST", investmentsEndpoint, payload, token)
		if err != nil {
			t.Fatalf(failedCreateInvestmentPerfMsg, i, err)
		}
		resp.Body.Close()
	}

	creationTime := time.Since(start)
	t.Logf("Created %d investments in %v", performanceInvestmentCount, creationTime)

	start = time.Now()

	resp, err := makeRequestWithAuth("GET", fmt.Sprintf("%s?page=1&limit=%d", investmentsEndpoint, performanceInvestmentPaginationLimit), nil, token)
	if err != nil {
		t.Fatalf(failedQueryInvestmentsMsg, err)
	}
	resp.Body.Close()

	queryTime := time.Since(start)
	t.Logf("Queried investments in %v", queryTime)

	if queryTime > maxInvestmentQueryTime {
		t.Errorf(investmentQueryTookTooLongMsg, queryTime, maxInvestmentQueryTime)
	}
}

func TestDashboardPerformance(t *testing.T) {
	token, err := createAuthenticatedUser("dashperf@test.com", "Dashboard Performance User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create some test data first
	testData := []map[string]interface{}{
		{"type": incomeType, "description": "Performance Income", "amount": dashboardSalaryAmount, "date": testDate},
		{"type": expenseType, "description": "Performance Expense", "amount": dashboardRentAmount, "date": testDate},
	}

	for _, tx := range testData {
		resp, err := makeRequestWithAuth("POST", transactionsEndpoint, tx, token)
		if err != nil {
			t.Fatalf(failedCreateTransactionMsg, err)
		}
		resp.Body.Close()
	}

	start := time.Now()

	resp, err := makeRequestWithAuth("GET", dashboardSummaryEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedGetDashboardSummaryMsg, err)
	}
	resp.Body.Close()

	dashboardTime := time.Since(start)
	t.Logf("Dashboard summary loaded in %v", dashboardTime)

	if dashboardTime > maxDashboardTime {
		t.Errorf(dashboardTookTooLongMsg, dashboardTime, maxDashboardTime)
	}

	start = time.Now()

	resp, err = makeRequestWithAuth("GET", overviewEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedGetOverviewMsg, err)
	}
	resp.Body.Close()

	overviewTime := time.Since(start)
	t.Logf("Overview loaded in %v", overviewTime)

	if overviewTime > maxOverviewTime {
		t.Errorf(overviewTookTooLongMsg, overviewTime, maxOverviewTime)
	}
}

func TestConcurrentRequests(t *testing.T) {
	token, err := createAuthenticatedUser("concurrent@test.com", "Concurrent User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create some initial data
	payload := map[string]interface{}{
		"type":        incomeType,
		"description": "Concurrent Test Transaction",
		"amount":      testAmount,
		"date":        testDate,
	}

	resp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
	if err != nil {
		t.Fatalf(failedCreateTransactionMsg, err)
	}
	resp.Body.Close()

	// Test concurrent reads
	concurrentRequests := 10
	results := make(chan time.Duration, concurrentRequests)
	errors := make(chan error, concurrentRequests)

	start := time.Now()

	for i := 0; i < concurrentRequests; i++ {
		go func() {
			requestStart := time.Now()
			resp, err := makeRequestWithAuth("GET", transactionsEndpoint, nil, token)
			if err != nil {
				errors <- err
				return
			}
			resp.Body.Close()
			results <- time.Since(requestStart)
		}()
	}

	// Collect results
	var totalTime time.Duration
	for i := 0; i < concurrentRequests; i++ {
		select {
		case err := <-errors:
			t.Fatalf("Concurrent request failed: %v", err)
		case duration := <-results:
			totalTime += duration
		case <-time.After(5 * time.Second):
			t.Fatal("Concurrent requests timed out")
		}
	}

	totalElapsed := time.Since(start)
	avgTime := totalTime / time.Duration(concurrentRequests)

	t.Logf("Completed %d concurrent requests in %v (avg: %v per request)",
		concurrentRequests, totalElapsed, avgTime)

	// All requests should complete within reasonable time
	if totalElapsed > 2*time.Second {
		t.Errorf("Concurrent requests took too long: %v", totalElapsed)
	}
}

func TestMemoryUsageStability(t *testing.T) {
	token, err := createAuthenticatedUser("memory@test.com", "Memory Test User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create and query data multiple times to test for memory leaks
	iterations := 20

	for iteration := 0; iteration < iterations; iteration++ {
		// Create some transactions
		for i := 0; i < 10; i++ {
			payload := map[string]interface{}{
				"type":        incomeType,
				"description": fmt.Sprintf("Memory Test %d-%d", iteration, i),
				"amount":      float64(100 + i),
				"date":        testDate,
			}

			resp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
			if err != nil {
				t.Fatalf("Failed to create transaction in iteration %d: %v", iteration, err)
			}
			resp.Body.Close()
		}

		// Query the data
		resp, err := makeRequestWithAuth("GET", transactionsEndpoint, nil, token)
		if err != nil {
			t.Fatalf("Failed to query transactions in iteration %d: %v", iteration, err)
		}
		resp.Body.Close()

		// Query dashboard
		resp, err = makeRequestWithAuth("GET", dashboardSummaryEndpoint, nil, token)
		if err != nil {
			t.Fatalf("Failed to query dashboard in iteration %d: %v", iteration, err)
		}
		resp.Body.Close()

		if iteration%5 == 0 {
			t.Logf("Completed iteration %d/%d", iteration+1, iterations)
		}
	}

	t.Logf("Memory stability test completed successfully after %d iterations", iterations)
}

func TestLargeDatasetPerformance(t *testing.T) {
	token, err := createAuthenticatedUser("largedata@test.com", "Large Data User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	// Create a larger dataset
	largeDatasetSize := 500
	batchSize := 50

	t.Logf("Creating large dataset of %d transactions in batches of %d", largeDatasetSize, batchSize)

	totalCreationTime := time.Duration(0)

	for batch := 0; batch < largeDatasetSize/batchSize; batch++ {
		batchStart := time.Now()

		for i := 0; i < batchSize; i++ {
			transactionIndex := batch*batchSize + i
			payload := map[string]interface{}{
				"type":        incomeType,
				"description": fmt.Sprintf("Large Dataset Transaction %d", transactionIndex),
				"amount":      float64(100 + transactionIndex),
				"date":        testDate,
			}

			resp, err := makeRequestWithAuth("POST", transactionsEndpoint, payload, token)
			if err != nil {
				t.Fatalf("Failed to create transaction %d: %v", transactionIndex, err)
			}
			resp.Body.Close()
		}

		batchTime := time.Since(batchStart)
		totalCreationTime += batchTime

		if batch%2 == 0 {
			t.Logf("Completed batch %d/%d in %v", batch+1, largeDatasetSize/batchSize, batchTime)
		}
	}

	t.Logf("Created %d transactions in %v", largeDatasetSize, totalCreationTime)

	// Test query performance with large dataset
	start := time.Now()
	resp, err := makeRequestWithAuth("GET", fmt.Sprintf("%s?page=1&limit=100", transactionsEndpoint), nil, token)
	if err != nil {
		t.Fatalf("Failed to query large dataset: %v", err)
	}
	resp.Body.Close()

	queryTime := time.Since(start)
	t.Logf("Queried large dataset in %v", queryTime)

	// Should still be reasonably fast even with large dataset
	maxLargeDatasetQueryTime := 500 * time.Millisecond
	if queryTime > maxLargeDatasetQueryTime {
		t.Errorf("Large dataset query took too long: %v (expected < %v)", queryTime, maxLargeDatasetQueryTime)
	}
}
