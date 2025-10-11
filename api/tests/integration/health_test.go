package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

const (
	// Endpoints
	healthEndpoint = "/"

	// Expected response values
	expectedAPIMessage = "Financial API v1.0"
	expectedAPIStatus = "running"

	// Response fields
	messageField = "message"
	statusField = "status"

	// Error messages
	expectedMessageMsg = "Expected message '%s', got %v"
	expectedStatusMsg = "Expected status '%s', got %v"
	expectedResponseFieldsMsg = "Expected response to have message and status fields"
)

func TestHealthCheck(t *testing.T) {
	resp, err := makeRequest("GET", healthEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var response map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if response[messageField] != expectedAPIMessage {
		t.Errorf(expectedMessageMsg, expectedAPIMessage, response[messageField])
	}

	if response[statusField] != expectedAPIStatus {
		t.Errorf(expectedStatusMsg, expectedAPIStatus, response[statusField])
	}
}

func TestHealthCheckResponseStructure(t *testing.T) {
	resp, err := makeRequest("GET", healthEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var response map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	// Verify required fields exist
	if _, exists := response[messageField]; !exists {
		t.Error("Response missing 'message' field")
	}

	if _, exists := response[statusField]; !exists {
		t.Error("Response missing 'status' field")
	}

	// Verify response has exactly 2 fields
	if len(response) != 2 {
		t.Errorf("Expected response to have exactly 2 fields, got %d", len(response))
	}
}

func TestHealthCheckContentType(t *testing.T) {
	resp, err := makeRequest("GET", healthEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	contentType := resp.Header.Get("Content-Type")
	expectedContentType := "application/json; charset=utf-8"

	if contentType != expectedContentType {
		t.Errorf("Expected Content-Type '%s', got '%s'", expectedContentType, contentType)
	}
}

func TestHealthCheckMultipleRequests(t *testing.T) {
	// Test that health check is consistent across multiple requests
	for i := 0; i < 5; i++ {
		resp, err := makeRequest("GET", healthEndpoint, nil)
		if err != nil {
			t.Fatalf("Request %d failed: %v", i+1, err)
		}

		if resp.StatusCode != http.StatusOK {
			t.Errorf("Request %d: Expected status 200, got %d", i+1, resp.StatusCode)
		}

		var response map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
			t.Fatalf("Request %d: Failed to decode response: %v", i+1, err)
		}
		resp.Body.Close()

		if response[messageField] != expectedAPIMessage {
			t.Errorf("Request %d: "+expectedMessageMsg, i+1, expectedAPIMessage, response[messageField])
		}

		if response[statusField] != expectedAPIStatus {
			t.Errorf("Request %d: "+expectedStatusMsg, i+1, expectedAPIStatus, response[statusField])
		}
	}
}

func TestHealthCheckMethodNotAllowed(t *testing.T) {
	// Test that other HTTP methods are handled appropriately
	methods := []string{"POST", "PUT", "DELETE", "PATCH"}

	for _, method := range methods {
		resp, err := makeRequest(method, healthEndpoint, nil)
		if err != nil {
			t.Fatalf("Failed to make %s request: %v", method, err)
		}
		resp.Body.Close()

		// Should either return 405 Method Not Allowed or 404 Not Found
		if resp.StatusCode != http.StatusMethodNotAllowed && resp.StatusCode != http.StatusNotFound {
			t.Errorf("Method %s: Expected status 405 or 404, got %d", method, resp.StatusCode)
		}
	}
}
