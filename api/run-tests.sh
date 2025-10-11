#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TEST_TIMEOUT=300s
API_URL="http://localhost:8081"
COMPOSE_FILE="docker-compose.test.yml"

echo -e "${BLUE}🚀 Starting Financial API Test Suite${NC}"
echo "=================================="

# Function to cleanup
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up test environment...${NC}"
    
    # Only clean up our specific test containers
    docker compose -f $COMPOSE_FILE down -v 2>/dev/null || true
    
    # Remove only our specific containers if they exist
    docker rm -f financial-api-test financial-mongodb-test 2>/dev/null || true
    
    # Remove only our specific network
    docker network rm financial-test-network 2>/dev/null || true
    
    # Remove only our specific volumes (if any)
    docker volume ls -q | grep -E "financial.*test" | xargs -r docker volume rm 2>/dev/null || true
}

# Function to wait for service
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=60
    local attempt=1

    echo -e "${YELLOW}⏳ Waiting for $service_name to be ready...${NC}"

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi

        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    echo -e "\n${RED}❌ $service_name failed to start within timeout${NC}"
    return 1
}

# Function to run tests
run_tests() {
    echo -e "\n${BLUE}🧪 Running Integration Tests${NC}"
    echo "----------------------------"

    # Set test environment variables
    export FINANCIAL_API_URL=$API_URL

    # Run tests with timeout and verbose output
    if timeout $TEST_TIMEOUT go test -v -race -count=1 ./tests/integration/... -timeout=$TEST_TIMEOUT; then
        echo -e "\n${GREEN}✅ All tests passed!${NC}"
        return 0
    else
        echo -e "\n${RED}❌ Some tests failed!${NC}"
        return 1
    fi
}

# Function to show test coverage
show_coverage() {
    echo -e "\n${BLUE}📊 Generating Test Coverage Report${NC}"
    echo "-----------------------------------"

    # Run tests with coverage
    go test -v -race -coverprofile=coverage.out ./tests/integration/... -timeout=$TEST_TIMEOUT

    if [ -f coverage.out ]; then
        echo -e "\n${YELLOW}Coverage Summary:${NC}"
        go tool cover -func=coverage.out | tail -1

        # Generate HTML coverage report
        go tool cover -html=coverage.out -o coverage.html
        echo -e "${GREEN}📄 HTML coverage report generated: coverage.html${NC}"

        # Cleanup coverage files
        rm -f coverage.out
    fi
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi

    # Check if docker compose is available
    if ! docker compose version > /dev/null 2>&1; then
        echo -e "${RED}❌ docker compose is not available.${NC}"
        exit 1
    fi

    # Check if Go is available
    if ! command -v go > /dev/null 2>&1; then
        echo -e "${RED}❌ Go is not installed.${NC}"
        exit 1
    fi

    # Check if curl is available
    if ! command -v curl > /dev/null 2>&1; then
        echo -e "${RED}❌ curl is not installed.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ All prerequisites met${NC}"
}

# Function to show help
show_help() {
    echo "Financial API Test Runner"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -c, --coverage Run tests with coverage report"
    echo "  -q, --quick    Skip cleanup for faster subsequent runs"
    echo "  -v, --verbose  Enable verbose output"
    echo ""
    echo "Examples:"
    echo "  $0                 # Run all tests"
    echo "  $0 --coverage      # Run tests with coverage"
    echo "  $0 --quick         # Skip cleanup"
}

# Parse command line arguments
COVERAGE=false
QUICK=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -c|--coverage)
            COVERAGE=true
            shift
            ;;
        -q|--quick)
            QUICK=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Set verbose mode
if [ "$VERBOSE" = true ]; then
    set -x
fi

# Trap cleanup on exit
trap cleanup EXIT

# Main execution
main() {
    local start_time=$(date +%s)

    # Check prerequisites
    check_prerequisites

    # Cleanup previous runs (unless quick mode)
    if [ "$QUICK" = false ]; then
        echo -e "\n${YELLOW}🧹 Cleaning up previous test runs...${NC}"
        cleanup
    fi

    echo -e "\n${BLUE}🐳 Starting test environment...${NC}"

    # Start test services
    if ! docker compose -f $COMPOSE_FILE up -d --build; then
        echo -e "${RED}❌ Failed to start test environment${NC}"
        exit 1
    fi

    # Wait for services to be ready
    if ! wait_for_service "$API_URL" "Financial API"; then
        echo -e "${RED}❌ Test environment setup failed${NC}"
        docker compose -f $COMPOSE_FILE logs
        exit 1
    fi

    # Run tests
    if [ "$COVERAGE" = true ]; then
        show_coverage
    else
        run_tests
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo -e "\n${GREEN}🎉 Test suite completed in ${duration}s${NC}"
}

# Run main function
main "$@"
