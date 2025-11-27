#!/bin/bash

# EduLens Startup Script
echo "🚀 EduLens Startup Script"
echo "=========================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node -v) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm $(npm -v) found"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo ""
    echo "⚠️  PostgreSQL is not installed"
    echo ""
    echo "📖 To install PostgreSQL:"
    echo "   1. Run: brew install postgresql@15"
    echo "   2. Run: brew services start postgresql@15"
    echo "   3. Run: createdb edulens"
    echo ""
    echo "   Or see: INSTALL_POSTGRESQL.md for detailed instructions"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ PostgreSQL found"
    
    # Check if edulens database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw edulens; then
        echo "✅ Database 'edulens' exists"
    else
        echo "⚠️  Database 'edulens' not found"
        echo "   Creating database..."
        createdb edulens 2>/dev/null && echo "✅ Database created" || echo "❌ Failed to create database"
    fi
fi

echo ""
echo "📦 Checking backend dependencies..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🗄️  Checking database migrations..."
if [ ! -d "prisma/migrations" ]; then
    echo "   Running initial migration..."
    npx prisma migrate dev --name init
else
    echo "✅ Migrations exist"
fi

echo ""
echo "🎯 Starting backend server..."
echo "   Server will be available at: http://localhost:3001"
echo "   Health check: http://localhost:3001/api/health"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
