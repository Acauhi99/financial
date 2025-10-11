package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

const (
	// Endpoints
	categoriesEndpoint = "/api/categories"

	// Test data
	categoriesUserEmail = "categories@test.com"
	categoriesUserName = "Categories User"

	// Default category names
	salarioCategory = "Salário"
	freelanceCategory = "Freelance"
	moradiaCategory = "Moradia"
	alimentacaoCategory = "Alimentação"
	transporteCategory = "Transporte"
	saudeCategory = "Saúde"
	lazerCategory = "Lazer"
	educacaoCategory = "Educação"

	// Category types
	incomeCategoryType = "income"
	expenseCategoryType = "expense"

	// Error messages
	expectedCategoriesToBeSeededMsg = "Expected categories to be seeded, got empty array"
	expectedCategoryNotFoundMsg = "Expected category %s not found"
	categoryExpectedTypeMsg = "Category %s expected type %s, got %s"
	categoryNameShouldNotBeEmptyMsg = "Category name should not be empty"
	categoryColorShouldNotBeEmptyMsg = "Category color should not be empty"
	categoryTypeShouldNotBeEmptyMsg = "Category type should not be empty"
	categoryIDShouldNotBeEmptyMsg = "Category ID should not be empty"
)

func TestGetCategories(t *testing.T) {
	token, err := createAuthenticatedUser(categoriesUserEmail, categoriesUserName)
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	resp, err := makeRequestWithAuth("GET", categoriesEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var categories []Category
	if err := json.NewDecoder(resp.Body).Decode(&categories); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	if len(categories) == 0 {
		t.Error(expectedCategoriesToBeSeededMsg)
	}

	// Verify default categories exist
	expectedCategories := map[string]string{
		salarioCategory:     incomeCategoryType,
		freelanceCategory:   incomeCategoryType,
		moradiaCategory:     expenseCategoryType,
		alimentacaoCategory: expenseCategoryType,
		transporteCategory:  expenseCategoryType,
		saudeCategory:      expenseCategoryType,
		lazerCategory:      expenseCategoryType,
		educacaoCategory:   expenseCategoryType,
	}

	found := make(map[string]bool)
	for _, cat := range categories {
		if expectedType, exists := expectedCategories[cat.Name]; exists {
			if cat.Type != expectedType {
				t.Errorf(categoryExpectedTypeMsg, cat.Name, expectedType, cat.Type)
			}
			found[cat.Name] = true
		}
	}

	for name := range expectedCategories {
		if !found[name] {
			t.Errorf(expectedCategoryNotFoundMsg, name)
		}
	}
}

func TestCategoriesUnauthorized(t *testing.T) {
	resp, err := makeRequest("GET", categoriesEndpoint, nil)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected status 401, got %d", resp.StatusCode)
	}
}

func TestCategoriesStructure(t *testing.T) {
	token, err := createAuthenticatedUser("catstructure@test.com", "Category Structure User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	resp, err := makeRequestWithAuth("GET", categoriesEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var categories []Category
	if err := json.NewDecoder(resp.Body).Decode(&categories); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	// Verify each category has required fields
	for _, cat := range categories {
		if cat.ID == emptyString {
			t.Error(categoryIDShouldNotBeEmptyMsg)
		}
		if cat.Name == emptyString {
			t.Error(categoryNameShouldNotBeEmptyMsg)
		}
		if cat.Color == emptyString {
			t.Error(categoryColorShouldNotBeEmptyMsg)
		}
		if cat.Type == emptyString {
			t.Error(categoryTypeShouldNotBeEmptyMsg)
		}

		// Verify type is valid
		if cat.Type != incomeCategoryType && cat.Type != expenseCategoryType {
			t.Errorf("Invalid category type: %s", cat.Type)
		}
	}
}

func TestCategoriesIncomeAndExpense(t *testing.T) {
	token, err := createAuthenticatedUser("cattype@test.com", "Category Type User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	resp, err := makeRequestWithAuth("GET", categoriesEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var categories []Category
	if err := json.NewDecoder(resp.Body).Decode(&categories); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	incomeCount := 0
	expenseCount := 0

	for _, cat := range categories {
		switch cat.Type {
		case incomeCategoryType:
			incomeCount++
		case expenseCategoryType:
			expenseCount++
		}
	}

	if incomeCount == 0 {
		t.Error("Expected at least one income category")
	}

	if expenseCount == 0 {
		t.Error("Expected at least one expense category")
	}

	// Should have more expense categories than income categories
	if expenseCount <= incomeCount {
		t.Errorf("Expected more expense categories than income categories, got income: %d, expense: %d", incomeCount, expenseCount)
	}
}

func TestCategoriesColors(t *testing.T) {
	token, err := createAuthenticatedUser("catcolors@test.com", "Category Colors User")
	if err != nil {
		t.Fatalf(failedCreateUserMsg, err)
	}

	resp, err := makeRequestWithAuth("GET", categoriesEndpoint, nil, token)
	if err != nil {
		t.Fatalf(failedRequestMsg, err)
	}
	defer resp.Body.Close()

	var categories []Category
	if err := json.NewDecoder(resp.Body).Decode(&categories); err != nil {
		t.Fatalf(failedDecodeMsg, err)
	}

	colorMap := make(map[string]int)

	for _, cat := range categories {
		// Verify color format (should be hex color)
		if len(cat.Color) < 4 || cat.Color[0] != '#' {
			t.Errorf("Invalid color format for category %s: %s", cat.Name, cat.Color)
		}

		colorMap[cat.Color]++
	}

	// Verify colors are diverse (no color used more than twice)
	for color, count := range colorMap {
		if count > 2 {
			t.Errorf("Color %s used too many times: %d", color, count)
		}
	}
}
