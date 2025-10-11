#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Financial API - Safe Cleanup Tool${NC}"
echo "===================================="

# Function to list what will be cleaned
list_cleanup_targets() {
    echo -e "\n${YELLOW}📋 The following resources will be cleaned:${NC}"
    
    # List containers
    echo -e "\n${BLUE}Containers:${NC}"
    CONTAINERS=$(docker ps -a --filter "name=financial" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}" 2>/dev/null || true)
    if [ -n "$CONTAINERS" ] && [ "$CONTAINERS" != "NAMES	STATUS	IMAGE" ]; then
        echo "$CONTAINERS"
    else
        echo "  No Financial API containers found"
    fi
    
    # List networks
    echo -e "\n${BLUE}Networks:${NC}"
    NETWORKS=$(docker network ls --filter "name=financial" --format "table {{.Name}}\t{{.Driver}}" 2>/dev/null || true)
    if [ -n "$NETWORKS" ] && [ "$NETWORKS" != "NAME	DRIVER" ]; then
        echo "$NETWORKS"
    else
        echo "  No Financial API networks found"
    fi
    
    # List volumes
    echo -e "\n${BLUE}Volumes:${NC}"
    VOLUMES=$(docker volume ls --filter "name=financial" --format "table {{.Name}}\t{{.Driver}}" 2>/dev/null || true)
    if [ -n "$VOLUMES" ] && [ "$VOLUMES" != "NAME	DRIVER" ]; then
        echo "$VOLUMES"
    else
        echo "  No Financial API volumes found"
    fi
    
    # List images
    echo -e "\n${BLUE}Images:${NC}"
    IMAGES=$(docker images --filter "reference=financial*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" 2>/dev/null || true)
    if [ -n "$IMAGES" ] && [ "$IMAGES" != "REPOSITORY	TAG	SIZE" ]; then
        echo "$IMAGES"
    else
        echo "  No Financial API images found"
    fi
}

# Function to perform cleanup
perform_cleanup() {
    echo -e "\n${YELLOW}🧹 Starting cleanup...${NC}"
    
    # Stop and remove containers
    echo -e "\n${BLUE}Stopping containers...${NC}"
    docker-compose -f docker-compose.yml down -v 2>/dev/null || true
    docker-compose -f docker-compose.test.yml down -v 2>/dev/null || true
    
    # Remove specific containers
    echo -e "${BLUE}Removing containers...${NC}"
    docker rm -f financial-api financial-mongodb financial-api-test financial-mongodb-test 2>/dev/null || true
    
    # Remove networks
    echo -e "${BLUE}Removing networks...${NC}"
    docker network rm financial-network financial-test-network 2>/dev/null || true
    
    # Remove volumes
    echo -e "${BLUE}Removing volumes...${NC}"
    docker volume ls -q | grep -E "financial" | xargs -r docker volume rm 2>/dev/null || true
    
    echo -e "\n${GREEN}✅ Cleanup completed successfully!${NC}"
}

# Function to show what's currently running
show_status() {
    echo -e "\n${BLUE}📊 Current Financial API Status:${NC}"
    
    # Check if containers are running
    RUNNING=$(docker ps --filter "name=financial" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true)
    if [ -n "$RUNNING" ] && [ "$RUNNING" != "NAMES	STATUS	PORTS" ]; then
        echo -e "\n${GREEN}Running containers:${NC}"
        echo "$RUNNING"
    else
        echo -e "\n${YELLOW}No Financial API containers are currently running${NC}"
    fi
}

# Main menu
show_menu() {
    echo -e "\n${BLUE}Choose an option:${NC}"
    echo "1) Show current status"
    echo "2) List what will be cleaned"
    echo "3) Perform cleanup"
    echo "4) Exit"
    echo ""
    read -p "Enter your choice [1-4]: " choice
    
    case $choice in
        1)
            show_status
            show_menu
            ;;
        2)
            list_cleanup_targets
            show_menu
            ;;
        3)
            list_cleanup_targets
            echo -e "\n${RED}⚠️  WARNING: This will remove all Financial API Docker resources!${NC}"
            read -p "Are you sure you want to proceed? [y/N]: " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                perform_cleanup
            else
                echo -e "${YELLOW}Cleanup cancelled${NC}"
            fi
            ;;
        4)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            show_menu
            ;;
    esac
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start the interactive menu
show_menu