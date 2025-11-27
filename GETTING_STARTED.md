# Getting Started with EduLens

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed

### Step 1: Start Infrastructure Services

Start PostgreSQL and Redis using Docker Compose:

```bash
cd /Users/yashwanthmaddirala/Desktop/EDULENS
docker-compose -f docker-compose.dev.yml up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Adminer (Database UI) on port 8080

### Step 2: Set Up Database

Run database migrations:

```bash
cd backend
npx prisma migrate dev --name init
```

### Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

The backend API will be available at: http://localhost:3001

### Step 4: Test the API

Check if the server is running:

```bash
curl http://localhost:3001/api/health
```

## 📋 Current Implementation Status

### ✅ Completed
- Project structure setup
- Backend dependencies installed
- Prisma schema defined
- Authentication system (OTP-based)
- Health check endpoint
- Error handling middleware
- Rate limiting
- Logging system
- Docker development environment

### 🔄 In Progress
- School CRUD operations
- Review system
- Complaint system
- File upload system

### 📝 Next Steps
1. Implement school management endpoints
2. Add ETI calculation service
3. Create seed data for testing
4. Set up API documentation with Swagger
5. Add unit and integration tests

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Start development server
npm run dev

# Run tests
npm test

# Run database migrations
npm run db:migrate

# Open Prisma Studio (Database GUI)
npm run db:studio

# Generate Prisma client
npm run db:generate
```

### Docker Services
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Reset database (WARNING: deletes all data)
docker-compose -f docker-compose.dev.yml down -v
```

## 🔍 Useful URLs

- **API Health Check**: http://localhost:3001/api/health
- **Database Admin (Adminer)**: http://localhost:8080
  - System: PostgreSQL
  - Server: postgres
  - Username: postgres
  - Password: password
  - Database: edulens

## 📚 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/staff/login` - Staff login
- `POST /api/auth/staff/verify-2fa` - Verify 2FA for staff

### Health
- `GET /api/health` - System health check

## 🐛 Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Find and kill the process using the port
lsof -ti:3001 | xargs kill -9
```

### Database Connection Issues
```bash
# Restart Docker services
docker-compose -f docker-compose.dev.yml restart

# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps
```

### Prisma Client Not Generated
```bash
cd backend
npx prisma generate
```

## 📖 Documentation

- [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md)
- [System Blueprint](./EDULENS_SYSTEM_BLUEPRINT.md)
- [Admin Panel Documentation](./ADMIN_PANEL_SECTION.md)
- [Backend System](./BACKEND_SYSTEM_SECTION.md)
- [Infrastructure](./INFRASTRUCTURE_SECTION.md)
- [Auth & CI/CD](./AUTH_CICD_SECTION.md)
