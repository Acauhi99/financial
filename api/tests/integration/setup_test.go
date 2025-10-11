package integration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"testing"
	"time"
)

var (
	BaseURL = getBaseURL()
	Timeout = 30 * time.Second
)

func getBaseURL() string {
	if url := os.Getenv("FINANCIAL_API_URL"); url != "" {
		return url
	}
	return "http://localhost:8080"
}

func TestMain(m *testing.M) {
	// Wait for API to be ready
	if !waitForAPI() {
		fmt.Println("API not ready, skipping tests")
		os.Exit(1)
	}

	// Run tests
	code := m.Run()
	os.Exit(code)
}

func waitForAPI() bool {
	client := &http.Client{Timeout: 5 * time.Second}

	for i := 0; i < 30; i++ {
		resp, err := client.Get(BaseURL + "/")
		if err == nil && resp.StatusCode == 200 {
			resp.Body.Close()
			return true
		}
		if resp != nil {
			resp.Body.Close()
		}
		time.Sleep(1 * time.Second)
	}
	return false
}

func makeRequest(method, path string, body interface{}) (*http.Response, error) {
	client := &http.Client{Timeout: Timeout}

	var reqBody *bytes.Buffer
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewBuffer(jsonData)
	} else {
		reqBody = bytes.NewBuffer(nil)
	}

	req, err := http.NewRequest(method, BaseURL+path, reqBody)
	if err != nil {
		return nil, err
	}

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	return client.Do(req)
}

func makeRequestWithAuth(method, path string, body interface{}, token string) (*http.Response, error) {
	client := &http.Client{Timeout: Timeout}

	var reqBody *bytes.Buffer
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewBuffer(jsonData)
	} else {
		reqBody = bytes.NewBuffer(nil)
	}

	req, err := http.NewRequest(method, BaseURL+path, reqBody)
	if err != nil {
		return nil, err
	}

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	req.Header.Set("Authorization", "Bearer "+token)

	return client.Do(req)
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

func createAuthenticatedUser(email, name string) (string, error) {
	payload := map[string]interface{}{
		"email":    email,
		"password": "password123",
		"name":     name,
	}

	resp, err := makeRequest("POST", "/api/auth/register", payload)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		return "", err
	}

	return authResp.Token, nil
}
