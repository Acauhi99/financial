package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

type Category struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
	Type  string `json:"type"`
}

func TestGetCategories(t *testing.T) {
	resp, err := makeRequest("GET", "/api/categories", nil)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var categories []Category
	if err := json.NewDecoder(resp.Body).Decode(&categories); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if len(categories) == 0 {
		t.Error("Expected categories to be seeded, got empty array")
	}

	// Verify default categories exist
	expectedCategories := map[string]string{
		"Salário":     "income",
		"Freelance":   "income",
		"Moradia":     "expense",
		"Alimentação": "expense",
	}

	found := make(map[string]bool)
	for _, cat := range categories {
		if expectedType, exists := expectedCategories[cat.Name]; exists {
			if cat.Type != expectedType {
				t.Errorf("Category %s expected type %s, got %s", cat.Name, expectedType, cat.Type)
			}
			found[cat.Name] = true
		}
	}

	for name := range expectedCategories {
		if !found[name] {
			t.Errorf("Expected category %s not found", name)
		}
	}
}
