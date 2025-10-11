#!/bin/bash

# Environment Setup Script for Financial API

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Function to show help
show_help() {
    echo "Financial API Environment Setup"
    echo ""
    echo "Usage: $0 [ENVIRONMENT]"
    echo ""
    echo "Environments:"
    echo "  dev, development    Setup development environment"
    echo "  test               Setup test environment"  
    echo "  prod, production   Setup production environment"
    echo ""
    echo "Examples:"
    echo "  $0 dev             # Setup for development"
    echo "  $0 test            # Setup for testing"
    echo "  $0 prod            # Setup for production"
}

# Function to setup environment
setup_env() {
    local env=$1
    local env_file=""
    
    case $env in
        "dev"|"development")
            env_file=".env.development"
            echo -e "${BLUE}🔧 Setting up Development Environment${NC}"
            ;;
        "test")
            env_file=".env.test"
            echo -e "${BLUE}🧪 Setting up Test Environment${NC}"
            ;;
        "prod"|"production")
            env_file=".env.production"
            echo -e "${BLUE}🚀 Setting up Production Environment${NC}"
            ;;
        *)
            echo -e "${RED}❌ Unknown environment: $env${NC}"
            show_help
            exit 1
            ;;
    esac
    
    if [ ! -f "$env_file" ]; then
        echo -e "${RED}❌ Environment file $env_file not found${NC}"
        exit 1
    fi
    
    # Copy environment file to .env
    cp "$env_file" .env
    echo -e "${GREEN}✅ Copied $env_file to .env${NC}"
    
    # Show current configuration
    echo -e "\n${YELLOW}📋 Current Configuration:${NC}"
    echo "Environment: $(grep GIN_MODE .env | cut -d'=' -f2)"
    echo "Port: $(grep PORT .env | cut -d'=' -f2)"
    echo "Log Level: $(grep LOG_LEVEL .env | cut -d'=' -f2)"
    echo "Rate Limiting: $(grep RATE_LIMIT_ENABLED .env | cut -d'=' -f2)"
    
    # Environment-specific instructions
    case $env in
        "prod"|"production")
            echo -e "\n${RED}⚠️  PRODUCTION SETUP REQUIRED:${NC}"
            echo "1. Set JWT_SECRET environment variable"
            echo "2. Set MONGO_URI environment variable"
            echo "3. Set ALLOWED_ORIGINS environment variable"
            echo "4. Review all security settings"
            echo ""
            echo "Example:"
            echo "export JWT_SECRET='your-super-secure-secret-here'"
            echo "export MONGO_URI='mongodb://user:pass@host:port/db'"
            echo "export ALLOWED_ORIGINS='https://yourdomain.com'"
            ;;
        "dev"|"development")
            echo -e "\n${GREEN}💡 Development Tips:${NC}"
            echo "• Use 'make dev' to start with hot reload"
            echo "• MongoDB will start on port 27017"
            echo "• API will be available on http://localhost:8080"
            echo "• Swagger docs enabled (if implemented)"
            ;;
        "test")
            echo -e "\n${GREEN}🧪 Test Environment Ready:${NC}"
            echo "• Rate limiting is disabled"
            echo "• Uses separate test database"
            echo "• Minimal logging for faster tests"
            echo "• Run tests with 'make test'"
            ;;
    esac
}

# Main execution
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}No environment specified. Showing current configuration:${NC}"
    if [ -f .env ]; then
        echo ""
        cat .env
    else
        echo "No .env file found. Use '$0 dev' to setup development environment."
    fi
    echo ""
    show_help
    exit 0
fi

setup_env "$1"