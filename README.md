# EduLens - School Transparency Platform

A comprehensive platform for transparent school information, reviews, and educational insights.

## 🏗️ Project Structure

```
edulens/
├── backend/           # Node.js/Express API server
├── web-public/        # Next.js public website
├── web-admin/         # Next.js admin panel
├── mobile/           # Flutter mobile app
├── infrastructure/   # Terraform & deployment configs
├── docs/            # Documentation
└── scripts/         # Utility scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Flutter 3.16+ (for mobile development)
- Docker & Docker Compose

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd edulens

# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Start development servers
npm run dev
```

## 📱 Applications

### Backend API
- **Technology:** Node.js, Express, Prisma, PostgreSQL
- **Port:** 3001
- **Features:** REST API, Authentication, ETI calculations

### Public Web App
- **Technology:** Next.js 14, React Query, Tailwind CSS
- **Port:** 3000
- **Features:** SEO-optimized, School search, Reviews

### Admin Panel
- **Technology:** Next.js 14, shadcn/ui, React Hook Form
- **Port:** 3002
- **Features:** School management, Verification, Analytics

### Mobile App
- **Technology:** Flutter, Riverpod, Hive
- **Features:** Offline support, Push notifications, Reviews

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run test         # Run tests
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

### Web Development
```bash
cd web-public
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
```

### Mobile Development
```bash
cd mobile
flutter pub get      # Install dependencies
flutter run          # Run on connected device/emulator
flutter test         # Run tests
flutter build apk    # Build Android APK
```

## 🗄️ Database

The system uses PostgreSQL with Prisma ORM. Key entities:
- **Schools:** Core school information and ETI scores
- **Users:** Parent/guardian accounts
- **Reviews:** School reviews and ratings
- **Complaints:** Issues and feedback
- **Staff Users:** Admin panel users with RBAC

## 🔐 Authentication

- **Parents/Guardians:** OTP-based phone authentication
- **Staff Users:** Email/password with 2FA support
- **JWT Tokens:** Access tokens (15min) + Refresh tokens (7 days)
- **RBAC:** Role-based permissions for staff users

## 📊 ETI Score System

Educational Transparency Index (ETI) calculation:
- **Infrastructure (25%):** Facilities, area, equipment
- **Academics (30%):** Results, curriculum, teaching quality
- **Safety (20%):** Security measures, compliance
- **Teachers (15%):** Qualifications, student-teacher ratio
- **Facilities (10%):** Additional amenities

## 🔍 Search & Discovery

- **Search Engine:** Meilisearch for fast, relevant results
- **Filters:** Board, type, location, fees, ETI score
- **Geo-search:** Location-based school discovery
- **Analytics:** Search patterns and popular queries

## 🚀 Deployment

### Development
```bash
docker-compose up -d  # Start all services locally
```

### Production
- **Backend:** AWS ECS with Application Load Balancer
- **Web Apps:** Vercel with CDN
- **Mobile:** Play Store & App Store
- **Database:** AWS RDS PostgreSQL
- **Cache:** AWS ElastiCache Redis
- **Storage:** AWS S3 for file uploads

## 📈 Monitoring

- **Application:** Prometheus + Grafana
- **Logs:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Errors:** Sentry for error tracking
- **Uptime:** AWS CloudWatch alarms

## 🧪 Testing

- **Backend:** Jest + Supertest
- **Web:** Jest + React Testing Library
- **Mobile:** Flutter test framework
- **E2E:** Playwright for web, Patrol for mobile

## 📚 API Documentation

API documentation is available at:
- Development: http://localhost:3001/api/docs
- Production: https://api.edulens.com/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@edulens.com
- Documentation: https://docs.edulens.com
- Issues: GitHub Issues
