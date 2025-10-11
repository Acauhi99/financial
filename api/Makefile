.PHONY: help test test-coverage test-quick clean build run dev logs

# Default target
help: ## Show this help message
	@echo "Financial API - Available Commands"
	@echo "=================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Test commands
test: ## Run all integration tests (safe, no auto-cleanup)
	@./run-tests.sh --quick

test-full: ## Run tests with full cleanup and setup
	@./run-tests.sh

test-coverage: ## Run tests with coverage report
	@./run-tests.sh --coverage

test-quick: ## Run tests without cleanup (faster for development)
	@./run-tests.sh --quick

test-verbose: ## Run tests with verbose output
	@./run-tests.sh --verbose

# Development commands
build: ## Build the application
	@echo "🔨 Building Financial API..."
	@go build -o financial-api ./cmd/server

run: ## Run the application locally
	@echo "🚀 Starting Financial API locally..."
	@go run ./cmd/server/main.go

dev: ## Start development environment with hot reload
	@echo "🔥 Starting development environment..."
	@docker compose up -d mongodb
	@echo "⏳ Waiting for MongoDB..."
	@sleep 5
	@go run ./cmd/server/main.go

# Docker commands
docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	@docker build -t financial-api .

docker-up: ## Start production environment
	@echo "🐳 Starting production environment..."
	@docker compose up -d

docker-down: ## Stop production environment
	@echo "🛑 Stopping production environment..."
	@docker compose down

docker-logs: ## Show Docker logs
	@docker compose logs -f

# Database commands
db-up: ## Start only MongoDB
	@echo "🍃 Starting MongoDB..."
	@docker compose up -d mongodb

db-down: ## Stop MongoDB
	@echo "🛑 Stopping MongoDB..."
	@docker compose stop mongodb

db-reset: ## Reset database (WARNING: This will delete all data)
	@echo "⚠️  Resetting database..."
	@docker compose down -v
	@docker compose up -d mongodb

# Cleanup commands
clean: ## Clean up Financial API containers only
	@echo "🧹 Cleaning up Financial API containers..."
	@docker compose -f docker-compose.yml down -v 2>/dev/null || true
	@docker compose -f docker-compose.test.yml down -v 2>/dev/null || true
	@docker rm -f financial-api financial-mongodb financial-api-test financial-mongodb-test 2>/dev/null || true
	@docker network rm financial-network financial-test-network 2>/dev/null || true

clean-volumes: ## Clean up Financial API volumes only
	@echo "🧹 Cleaning up Financial API volumes..."
	@docker volume ls -q | grep -E "financial" | xargs -r docker volume rm 2>/dev/null || true

clean-all: clean clean-volumes ## Clean up all Financial API resources
	@echo "✅ Financial API cleanup completed"

# Code quality commands
lint: ## Run linter
	@echo "🔍 Running linter..."
	@golangci-lint run ./...

fmt: ## Format code
	@echo "✨ Formatting code..."
	@go fmt ./...

vet: ## Run go vet
	@echo "🔍 Running go vet..."
	@go vet ./...

mod-tidy: ## Tidy go modules
	@echo "📦 Tidying modules..."
	@go mod tidy

# Combined commands
check: fmt vet lint ## Run all code quality checks

setup: ## Setup development environment
	@echo "🛠️  Setting up development environment..."
	@./env-setup.sh dev
	@go mod download
	@docker compose up -d mongodb
	@echo "✅ Development environment ready!"

# Environment management
env-dev: ## Setup development environment
	@./env-setup.sh dev

env-test: ## Setup test environment
	@./env-setup.sh test

env-prod: ## Setup production environment
	@./env-setup.sh prod

env-status: ## Show current environment configuration
	@./env-setup.sh

# Quick development workflow
quick-test: test-quick ## Run quick tests (no cleanup)

full-test: clean test-coverage ## Clean and run full test suite with coverage

safe-clean: ## Interactive safe cleanup tool
	@./safe-cleanup.sh

status: ## Show current Financial API status
	@echo "📊 Financial API Status:"
	@echo "========================"
	@docker ps --filter "name=financial" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No containers running"
	@echo ""
	@docker compose -f docker-compose.yml ps 2>/dev/null || true