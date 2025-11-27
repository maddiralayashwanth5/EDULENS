# Starting EduLens Without Docker

Since Docker is not installed, here's how to start the development environment using local services.

## Prerequisites

You'll need to install PostgreSQL and Redis locally on your Mac.

### Install PostgreSQL

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb edulens
```

### Install Redis

```bash
# Using Homebrew
brew install redis

# Start Redis
brew services start redis
```

## Setup Steps

### 1. Update Environment Variables

The `.env` file in the backend folder is already configured for local development:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### 2. Run Database Migrations

```bash
cd /Users/yashwanthmaddirala/Desktop/EDULENS/backend
npx prisma migrate dev --name init
```

### 3. Start the Backend Server

```bash
cd /Users/yashwanthmaddirala/Desktop/EDULENS/backend
npm run dev
```

The server will start on http://localhost:3001

## Quick Test

Test if the server is running:

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "timestamp": "2024-11-27T...",
  "uptime": 1.234,
  "status": "ok",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

## Alternative: Use SQLite (No PostgreSQL Required)

If you don't want to install PostgreSQL, you can use SQLite:

1. Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Update `backend/.env`:
```
DATABASE_URL="file:./dev.db"
```

3. Run migrations:
```bash
cd backend
npx prisma migrate dev --name init
```

## Troubleshooting

### PostgreSQL Not Starting
```bash
# Check status
brew services list

# Restart PostgreSQL
brew services restart postgresql@15
```

### Redis Not Starting
```bash
# Check status
brew services list

# Restart Redis
brew services restart redis
```

### Port 3001 Already in Use
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

## Next Steps

Once the server is running:
1. Test authentication endpoints
2. Create sample data
3. Explore the API documentation
4. Start building the frontend applications
