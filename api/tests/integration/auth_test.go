package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

const (
	testEmail = "test@example.com"
	loginEmail = "login@example.com"
	registerEndpoint = "/api/auth/register"
	loginEndpoint = "/api/auth/login"
	meEndpoint = "/api/auth/me"
	failedRequestMsg = "Failed to make request: %v"
	failedDecodeMsg = "Failed to decode response: %v"
	failedRegisterMsg = "Failed to register user: %v"
	testPassword = "password123"
	testName = "Test User"
	loginUserName = "Login User"
	protectedEmail = "protected@example.com"
	protectedUserName = "Protected User"
	duplicateEmail = "duplicate@example.com"
	duplicateUserName = "Duplicate User"
	wrongPassEmail = "wrongpass@example.com"
	wrongPassUserName = "Wrong Pass User"
	correctPassword = "correctpass123"
	wrongPassword = "wrongpass123"
	nonExistentEmail = "nonexistent@example.com"
	meTestEmail = "metest@example.com"
	meTestUserName = "Me Test User"
	shortPassword = "123"
	invalidEmail = "invalid"
	malformedToken = "invalid.token.here"
	randomToken = "randomstring123"
	emptyString = ""
	testString = "Test"
)

func TestUserRegistration(t *testing.T) {
	payload := map[string]any{
		"email":    testEmail,
		"password": testPassword,
		"name":     testName,
	}

	resp, err := makeRequest("POST", registerEndpoint, payload)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", resp.StatusCode)
	}

	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if authResp.Token == emptyString {
		t.Error("Expected token to be present")
	}

	if authResp.User.Email != testEmail {
		t.Errorf("Expected email '%s', got %s", testEmail, authResp.User.Email)
	}

	if authResp.User.Name != testName {
		t.Errorf("Expected name '%s', got %s", testName, authResp.User.Name)
	}
}

func TestUserLogin(t *testing.T) {
	registerPayload := map[string]any{
		"email":    loginEmail,
		"password": testPassword,
		"name":     loginUserName,
	}

	registerResp, err := makeRequest("POST", registerEndpoint, registerPayload)
	if err != nil {
		t.Fatalf(failedRegisterMsg, err)
	}
	registerResp.Body.Close()

	loginPayload := map[string]interface{}{
		"email":    loginEmail,
		"password": testPassword,
	}

	resp, err := makeRequest("POST", loginEndpoint, loginPayload)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if authResp.Token == emptyString {
		t.Error("Expected token to be present")
	}

	if authResp.User.Email != loginEmail {
		t.Errorf("Expected email '%s', got %s", loginEmail, authResp.User.Email)
	}
}

func TestAuthValidation(t *testing.T) {
	tests := []struct {
		name     string
		endpoint string
		payload  map[string]any
		expected int
	}{
		{
			name:     "register missing email",
			endpoint: registerEndpoint,
			payload:  map[string]any{"password": testPassword, "name": testString},
			expected: http.StatusBadRequest,
		},
		{
			name:     "register invalid email",
			endpoint: registerEndpoint,
			payload:  map[string]any{"email": invalidEmail, "password": testPassword, "name": testString},
			expected: http.StatusBadRequest,
		},
		{
			name:     "register short password",
			endpoint: registerEndpoint,
			payload:  map[string]any{"email": testEmail, "password": shortPassword, "name": testString},
			expected: http.StatusBadRequest,
		},
		{
			name:     "login missing password",
			endpoint: loginEndpoint,
			payload:  map[string]any{"email": testEmail},
			expected: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := makeRequest("POST", tt.endpoint, tt.payload)
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

func TestProtectedEndpoint(t *testing.T) {
	registerPayload := map[string]any{
		"email":    protectedEmail,
		"password": testPassword,
		"name":     protectedUserName,
	}

	registerResp, err := makeRequest("POST", registerEndpoint, registerPayload)
	if err != nil {
		t.Fatalf(failedRegisterMsg, err)
	}
	defer registerResp.Body.Close()

	var authResp AuthResponse
	if err := json.NewDecoder(registerResp.Body).Decode(&authResp); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	resp, err := makeRequestWithAuth("GET", meEndpoint, nil, authResp.Token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	resp, err = makeRequest("GET", meEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestDuplicateRegistration(t *testing.T) {
	payload := map[string]any{
		"email":    duplicateEmail,
		"password": testPassword,
		"name":     duplicateUserName,
	}

	resp1, err := makeRequest("POST", registerEndpoint, payload)
	if err != nil {
		t.Fatalf("Failed to make first request: %v", err)
	}
	resp1.Body.Close()

	if resp1.StatusCode != http.StatusCreated {
		t.Errorf("Expected first registration to succeed with status 201, got %d", resp1.StatusCode)
	}

	resp2, err := makeRequest("POST", registerEndpoint, payload)
	if err != nil {
		t.Fatalf("Failed to make second request: %v", err)
	}
	defer resp2.Body.Close()

	if resp2.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected second registration to fail with status 400, got %d", resp2.StatusCode)
	}
}

func TestLoginWithWrongPassword(t *testing.T) {
	registerPayload := map[string]any{
		"email":    wrongPassEmail,
		"password": correctPassword,
		"name":     wrongPassUserName,
	}

	registerResp, err := makeRequest("POST", registerEndpoint, registerPayload)
	if err != nil {
		t.Fatalf(failedRegisterMsg, err)
	}
	registerResp.Body.Close()

	loginPayload := map[string]any{
		"email":    wrongPassEmail,
		"password": wrongPassword,
	}

	resp, err := makeRequest("POST", loginEndpoint, loginPayload)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestLoginWithNonExistentUser(t *testing.T) {
	loginPayload := map[string]any{
		"email":    nonExistentEmail,
		"password": testPassword,
	}

	resp, err := makeRequest("POST", loginEndpoint, loginPayload)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestInvalidTokenAccess(t *testing.T) {
	tests := []struct {
		name  string
		token string
	}{
		{"malformed token", malformedToken},
		{"empty token", emptyString},
		{"random string", randomToken},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := makeRequestWithAuth("GET", meEndpoint, nil, tt.token)
			if err != nil {
				t.Fatalf(failedRequestMsg, err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusUnauthorized {
				t.Errorf("Expected status 401, got %d", resp.StatusCode)
			}
		})
	}
}

func TestMeEndpointWithValidToken(t *testing.T) {
	registerPayload := map[string]any{
		"email":    meTestEmail,
		"password": testPassword,
		"name":     meTestUserName,
	}

	registerResp, err := makeRequest("POST", registerEndpoint, registerPayload)
	if err != nil {
		t.Fatalf(failedRegisterMsg, err)
	}
	defer registerResp.Body.Close()

	var authResp AuthResponse
	if err := json.NewDecoder(registerResp.Body).Decode(&authResp); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	resp, err := makeRequestWithAuth("GET", meEndpoint, nil, authResp.Token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var meResp User
	if err := json.NewDecoder(resp.Body).Decode(&meResp); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if meResp.Email != meTestEmail {
		t.Errorf("Expected email '%s', got %s", meTestEmail, meResp.Email)
	}

	if meResp.Name != meTestUserName {
		t.Errorf("Expected name '%s', got %s", meTestUserName, meResp.Name)
	}
}

func TestRegistrationFieldValidation(t *testing.T) {
	tests := []struct {
		name     string
		payload  map[string]any
		expected int
	}{
		{
			name:     "missing name",
			payload:  map[string]any{"email": testEmail, "password": testPassword},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty name",
			payload:  map[string]any{"email": testEmail, "password": testPassword, "name": emptyString},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty email",
			payload:  map[string]any{"email": emptyString, "password": testPassword, "name": testString},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty password",
			payload:  map[string]any{"email": testEmail, "password": emptyString, "name": testString},
			expected: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := makeRequest("POST", registerEndpoint, tt.payload)
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

func TestLoginFieldValidation(t *testing.T) {
	tests := []struct {
		name     string
		payload  map[string]any
		expected int
	}{
		{
			name:     "missing email",
			payload:  map[string]any{"password": testPassword},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty email",
			payload:  map[string]any{"email": emptyString, "password": testPassword},
			expected: http.StatusBadRequest,
		},
		{
			name:     "empty password",
			payload:  map[string]any{"email": testEmail, "password": emptyString},
			expected: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := makeRequest("POST", loginEndpoint, tt.payload)
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
