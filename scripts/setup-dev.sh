#!/bin/bash

# EduLens Development Setup Script
set -e

echo "🚀 Setting up EduLens development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL, Redis)..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install backend dependencies
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

# Seed database (optional)
echo "🌱 Seeding database..."
# npx prisma db seed (will be implemented later)

cd ..

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the backend server: cd backend && npm run dev"
echo "2. Access the database admin panel: http://localhost:8080"
echo "3. Check API health: http://localhost:3001/api/health"
echo ""
echo "📚 Useful commands:"
echo "- View logs: docker-compose -f docker-compose.dev.yml logs"
echo "- Stop services: docker-compose -f docker-compose.dev.yml down"
echo "- Reset database: docker-compose -f docker-compose.dev.yml down -v"
