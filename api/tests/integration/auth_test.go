package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)



func TestUserRegistration(t *testing.T) {
	payload := map[string]interface{}{
		"email":    "test@example.com",
		"password": "password123",
		"name":     "Test User",
	}

	resp, err := makeRequest("POST", "/api/auth/register", payload)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", resp.StatusCode)
	}

	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if authResp.Token == "" {
		t.Error("Expected token to be present")
	}

	if authResp.User.Email != "test@example.com" {
		t.Errorf("Expected email 'test@example.com', got %s", authResp.User.Email)
	}

	if authResp.User.Name != "Test User" {
		t.Errorf("Expected name 'Test User', got %s", authResp.User.Name)
	}
}

func TestUserLogin(t *testing.T) {
	// First register a user
	registerPayload := map[string]interface{}{
		"email":    "login@example.com",
		"password": "password123",
		"name":     "Login User",
	}

	registerResp, err := makeRequest("POST", "/api/auth/register", registerPayload)
	if err != nil {
		t.Fatalf("Failed to register user: %v", err)
	}
	registerResp.Body.Close()

	// Now login
	loginPayload := map[string]interface{}{
		"email":    "login@example.com",
		"password": "password123",
	}

	resp, err := makeRequest("POST", "/api/auth/login", loginPayload)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if authResp.Token == "" {
		t.Error("Expected token to be present")
	}

	if authResp.User.Email != "login@example.com" {
		t.Errorf("Expected email 'login@example.com', got %s", authResp.User.Email)
	}
}

func TestAuthValidation(t *testing.T) {
	tests := []struct {
		name     string
		endpoint string
		payload  map[string]interface{}
		expected int
	}{
		{
			name:     "register missing email",
			endpoint: "/api/auth/register",
			payload:  map[string]interface{}{"password": "password123", "name": "Test"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "register invalid email",
			endpoint: "/api/auth/register",
			payload:  map[string]interface{}{"email": "invalid", "password": "password123", "name": "Test"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "register short password",
			endpoint: "/api/auth/register",
			payload:  map[string]interface{}{"email": "test@example.com", "password": "123", "name": "Test"},
			expected: http.StatusBadRequest,
		},
		{
			name:     "login missing password",
			endpoint: "/api/auth/login",
			payload:  map[string]interface{}{"email": "test@example.com"},
			expected: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := makeRequest("POST", tt.endpoint, tt.payload)
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

func TestProtectedEndpoint(t *testing.T) {
	// Register and login to get token
	registerPayload := map[string]interface{}{
		"email":    "protected@example.com",
		"password": "password123",
		"name":     "Protected User",
	}

	registerResp, err := makeRequest("POST", "/api/auth/register", registerPayload)
	if err != nil {
		t.Fatalf("Failed to register user: %v", err)
	}
	defer registerResp.Body.Close()

	var authResp AuthResponse
	if err := json.NewDecoder(registerResp.Body).Decode(&authResp); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	// Test accessing protected endpoint with token
	resp, err := makeRequestWithAuth("GET", "/api/auth/me", nil, authResp.Token)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	// Test accessing protected endpoint without token
	resp, err = makeRequest("GET", "/api/auth/me", nil)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestDuplicateRegistration(t *testing.T) {
	payload := map[string]interface{}{
		"email":    "duplicate@example.com",
		"password": "password123",
		"name":     "Duplicate User",
	}

	// First registration should succeed
	resp1, err := makeRequest("POST", "/api/auth/register", payload)
	if err != nil {
		t.Fatalf("Failed to make first request: %v", err)
	}
	resp1.Body.Close()

	if resp1.StatusCode != http.StatusCreated {
		t.Errorf("Expected first registration to succeed with status 201, got %d", resp1.StatusCode)
	}

	// Second registration should fail
	resp2, err := makeRequest("POST", "/api/auth/register", payload)
	if err != nil {
		t.Fatalf("Failed to make second request: %v", err)
	}
	defer resp2.Body.Close()

	if resp2.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected second registration to fail with status 400, got %d", resp2.StatusCode)
	}
}