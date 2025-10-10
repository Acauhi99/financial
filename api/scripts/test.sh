#!/bin/bash

set -e

echo "🧪 Starting Integration Tests..."

# Stop any running containers
echo "📦 Stopping existing containers..."
docker compose down --remove-orphans || true

# Build and start services
echo "🔨 Building and starting services..."
docker compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 1

# Run integration tests
echo "🚀 Running integration tests..."
cd tests/integration
go test -v ./...

# Cleanup
echo "🧹 Cleaning up..."
cd ../..
docker compose down

echo "✅ Tests completed!"
