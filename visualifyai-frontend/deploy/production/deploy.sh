#!/bin/bash

# Production deployment script for VisualifyAI
# Usage: ./deploy/production/deploy.sh

set -e

echo "🚀 Starting VisualifyAI production deployment..."

# Debug: check environment
echo "🔍 Checking environment:"
echo "Shell: $0"
echo "PATH: $PATH"
echo "User: $(whoami)"

# Check if Docker is installed
echo "🔍 Checking Docker..."
if ! which docker >/dev/null 2>&1 && ! command -v docker >/dev/null 2>&1; then
    echo "❌ Docker is not installed or not in PATH."
    echo "💡 Try:"
    echo "   - sudo apt update && sudo apt install docker.io"
    echo "   - or install Docker following official guide"
    echo "   - Ensure current user is in docker group: sudo usermod -aG docker \$USER"
    exit 1
fi

# Check if Docker daemon is running
echo "🔍 Checking Docker daemon..."
if ! docker ps >/dev/null 2>&1; then
    echo "❌ Docker daemon is not running or permission denied."
    echo "💡 Try:"
    echo "   - sudo systemctl start docker"
    echo "   - sudo systemctl enable docker"
    echo "   - Add user to docker group: sudo usermod -aG docker \$USER"
    echo "   - Logout and login again"
    exit 1
fi

echo "✅ Docker is installed and running: $(docker --version)"

# Check Docker Compose
echo "🔍 Checking Docker Compose..."
if docker compose version >/dev/null 2>&1; then
    echo "✅ Docker Compose (plugin) is ready: $(docker compose version)"
    COMPOSE_CMD="docker compose"
elif which docker-compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1; then
    echo "✅ Docker Compose (standalone) is ready: $(docker-compose --version)"
    COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose is not installed."
    echo "💡 Try:"
    echo "   - sudo apt install docker-compose-plugin"
    echo "   - or: sudo apt install docker-compose"
    exit 1
fi

# Change to production directory
cd "$(dirname "$0")"

echo "📦 Stopping old containers (if any)..."
$COMPOSE_CMD -f docker-compose.production.yml down || true

echo "🏗️ Building application..."
$COMPOSE_CMD -f docker-compose.production.yml build --no-cache

echo "🚀 Starting services..."
$COMPOSE_CMD -f docker-compose.production.yml up -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check containers status
echo "📊 Checking containers status:"
$COMPOSE_CMD -f docker-compose.production.yml ps

# Check logs
echo "📋 nginx-proxy logs:"
$COMPOSE_CMD -f docker-compose.production.yml logs --tail=20 nginx-proxy

echo "📋 letsencrypt logs:"
$COMPOSE_CMD -f docker-compose.production.yml logs --tail=20 letsencrypt

echo "📋 app logs:"
$COMPOSE_CMD -f docker-compose.production.yml logs --tail=20 app

echo "✅ Deployment completed!"
echo "🌐 Website will be available at: https://visualifyai.com"
echo "📝 To view logs: $COMPOSE_CMD -f docker-compose.production.yml logs -f"
echo "🛑 To stop: $COMPOSE_CMD -f docker-compose.production.yml down" 