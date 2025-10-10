#!/bin/bash

set -e

echo "⚡ Quick Test (assumes services are running)..."

# Check if API is running
if ! curl -s http://localhost:8080/ > /dev/null; then
    echo "❌ API not running. Use './test.sh' for full test or start services first."
    exit 1
fi

# Run tests
echo "🚀 Running tests against running services..."
cd tests/integration
go test -v ./...

echo "✅ Quick tests completed!"