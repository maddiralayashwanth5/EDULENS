## 🔵 7. AUTHENTICATION SYSTEM

### JWT Token Strategy
```typescript
// src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

export class AuthService {
  private prisma: PrismaClient;
  private redis: Redis;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async generateTokens(userId: string, role: string) {
    const payload = { userId, role };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // Store refresh token in Redis
    await this.redis.setex(`refresh_token:${userId}`, 604800, refreshToken); // 7 days

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      
      // Check if refresh token exists in Redis
      const storedToken = await this.redis.get(`refresh_token:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(decoded.userId, decoded.role);
      
      // Invalidate old refresh token
      await this.redis.del(`refresh_token:${decoded.userId}`);
      
      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async revokeToken(userId: string) {
    await this.redis.del(`refresh_token:${userId}`);
  }

  // Staff authentication with 2FA
  async authenticateStaff(email: string, password: string) {
    const user = await this.prisma.staffUser.findUnique({
      where: { email, isActive: true },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    if (user.totpSecret) {
      // Generate session token for 2FA
      const sessionToken = jwt.sign(
        { userId: user.id, step: '2fa' },
        process.env.JWT_SECRET!,
        { expiresIn: '5m' }
      );

      return {
        requiresTwoFactor: true,
        sessionToken,
      };
    }

    // Generate full tokens if no 2FA
    const tokens = await this.generateTokens(user.id, user.role);
    return { ...tokens, requiresTwoFactor: false };
  }

  async verifyTwoFactor(sessionToken: string, totpCode: string) {
    try {
      const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET!) as any;
      
      if (decoded.step !== '2fa') {
        throw new Error('Invalid session');
      }

      const user = await this.prisma.staffUser.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.totpSecret) {
        throw new Error('Invalid user');
      }

      // Verify TOTP code
      const isValidTOTP = this.verifyTOTP(user.totpSecret, totpCode);
      if (!isValidTOTP) {
        throw new Error('Invalid TOTP code');
      }

      // Generate full tokens
      return await this.generateTokens(user.id, user.role);
    } catch (error) {
      throw new Error('Invalid 2FA verification');
    }
  }

  private verifyTOTP(secret: string, token: string): boolean {
    // Implement TOTP verification using speakeasy or similar library
    const speakeasy = require('speakeasy');
    
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps before/after
    });
  }
}
```

### Role-Based Access Control (RBAC)
```typescript
// src/services/rbac.service.ts
import { PrismaClient } from '@prisma/client';

export class RBACService {
  private prisma: PrismaClient;
  
  // Define permissions
  private permissions = {
    // School management
    'school:create': 'Create new schools',
    'school:read': 'View school details',
    'school:update': 'Update school information',
    'school:delete': 'Delete schools',
    'school:verify': 'Verify school data',
    
    // Review management
    'review:read': 'View reviews',
    'review:moderate': 'Moderate reviews',
    'review:delete': 'Delete reviews',
    
    // Complaint management
    'complaint:read': 'View complaints',
    'complaint:assign': 'Assign complaints',
    'complaint:resolve': 'Resolve complaints',
    
    // User management
    'user:read': 'View users',
    'user:update': 'Update user information',
    'user:ban': 'Ban users',
    
    // System administration
    'system:audit': 'View audit logs',
    'system:config': 'Modify system configuration',
    'system:backup': 'Create system backups',
  };

  // Define role permissions
  private rolePermissions = {
    DATA_COLLECTOR: [
      'school:create',
      'school:read',
      'school:update',
    ],
    
    VERIFIER: [
      'school:read',
      'school:verify',
      'review:read',
      'review:moderate',
      'complaint:read',
    ],
    
    MODERATOR: [
      'school:read',
      'school:update',
      'school:verify',
      'review:read',
      'review:moderate',
      'review:delete',
      'complaint:read',
      'complaint:assign',
      'complaint:resolve',
      'user:read',
      'user:update',
    ],
    
    ADMIN: Object.keys(this.permissions), // All permissions
  };

  constructor() {
    this.prisma = new PrismaClient();
  }

  hasPermission(userRole: string, permission: string): boolean {
    const rolePerms = this.rolePermissions[userRole as keyof typeof this.rolePermissions];
    return rolePerms ? rolePerms.includes(permission) : false;
  }

  getUserPermissions(userRole: string): string[] {
    return this.rolePermissions[userRole as keyof typeof this.rolePermissions] || [];
  }

  // Middleware factory for permission checking
  requirePermission(permission: string) {
    return (req: any, res: any, next: any) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      if (!this.hasPermission(req.user.role, permission)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      next();
    };
  }
}
```

### OTP Service
```typescript
// src/services/otp.service.ts
import Redis from 'ioredis';
import { Twilio } from 'twilio';

export class OTPService {
  private redis: Redis;
  private twilio: Twilio;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
    this.twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }

  async sendOtp(phoneNumber: string): Promise<void> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in Redis with 5-minute expiry
    const key = `otp:${phoneNumber}`;
    await this.redis.setex(key, 300, otp);
    
    // Track attempts to prevent spam
    const attemptsKey = `otp_attempts:${phoneNumber}`;
    const attempts = await this.redis.incr(attemptsKey);
    await this.redis.expire(attemptsKey, 3600); // Reset attempts every hour
    
    if (attempts > 5) {
      throw new Error('Too many OTP requests. Please try again later.');
    }

    // Send SMS
    try {
      await this.twilio.messages.create({
        body: `Your EduLens verification code is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: phoneNumber,
      });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const key = `otp:${phoneNumber}`;
    const storedOtp = await this.redis.get(key);
    
    if (!storedOtp || storedOtp !== otp) {
      return false;
    }

    // Delete OTP after successful verification
    await this.redis.del(key);
    return true;
  }
}
```

---

## 🔴 8. CI/CD & DEPLOYMENT

### GitHub Actions - Backend Pipeline
```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths: ['backend/**']
  pull_request:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: edulens_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run database migrations
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/edulens_test
        run: npx prisma migrate deploy
      
      - name: Run tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/edulens_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret
        run: npm test
      
      - name: Run linting
        working-directory: ./backend
        run: npm run lint
      
      - name: Build application
        working-directory: ./backend
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: edulens-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Deploy to ECS
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: edulens-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          aws ecs update-service \
            --cluster edulens-cluster \
            --service edulens-backend-service \
            --force-new-deployment
```

### Docker Configuration
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### Flutter CI/CD Pipeline
```yaml
# .github/workflows/flutter.yml
name: Flutter CI/CD

on:
  push:
    branches: [main, develop]
    paths: ['mobile/**']
  pull_request:
    branches: [main]
    paths: ['mobile/**']

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      
      - name: Get dependencies
        working-directory: ./mobile
        run: flutter pub get
      
      - name: Run code generation
        working-directory: ./mobile
        run: flutter packages pub run build_runner build --delete-conflicting-outputs
      
      - name: Analyze code
        working-directory: ./mobile
        run: flutter analyze
      
      - name: Run tests
        working-directory: ./mobile
        run: flutter test

  build-android:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
      
      - name: Get dependencies
        working-directory: ./mobile
        run: flutter pub get
      
      - name: Run code generation
        working-directory: ./mobile
        run: flutter packages pub run build_runner build --delete-conflicting-outputs
      
      - name: Decode keystore
        env:
          KEYSTORE_BASE64: ${{ secrets.KEYSTORE_BASE64 }}
        run: |
          echo $KEYSTORE_BASE64 | base64 -d > ./mobile/android/app/keystore.jks
      
      - name: Build APK
        working-directory: ./mobile
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
        run: flutter build apk --release
      
      - name: Build App Bundle
        working-directory: ./mobile
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
        run: flutter build appbundle --release
      
      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
          packageName: com.edulens.app
          releaseFiles: mobile/build/app/outputs/bundle/release/app-release.aab
          track: internal
          status: completed

  build-ios:
    needs: test
    runs-on: macos-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      
      - name: Get dependencies
        working-directory: ./mobile
        run: flutter pub get
      
      - name: Run code generation
        working-directory: ./mobile
        run: flutter packages pub run build_runner build --delete-conflicting-outputs
      
      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: latest-stable
      
      - name: Install CocoaPods
        run: sudo gem install cocoapods
      
      - name: Install iOS dependencies
        working-directory: ./mobile/ios
        run: pod install
      
      - name: Build iOS
        working-directory: ./mobile
        run: flutter build ios --release --no-codesign
      
      - name: Build and upload to TestFlight
        working-directory: ./mobile/ios
        env:
          FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
          FASTLANE_SESSION: ${{ secrets.FASTLANE_SESSION }}
        run: |
          fastlane beta
```

### Next.js Web App Deployment (Vercel)
```yaml
# .github/workflows/web.yml
name: Web CI/CD

on:
  push:
    branches: [main, develop]
    paths: ['web/**']
  pull_request:
    branches: [main]
    paths: ['web/**']

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: web/package-lock.json
      
      - name: Install dependencies
        working-directory: ./web
        run: npm ci
      
      - name: Run linting
        working-directory: ./web
        run: npm run lint
      
      - name: Run type checking
        working-directory: ./web
        run: npm run type-check
      
      - name: Run tests
        working-directory: ./web
        run: npm test
      
      - name: Build application
        working-directory: ./web
        env:
          NEXT_PUBLIC_API_URL: https://api.edulens.com
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./web
          vercel-args: '--prod'
```

### Infrastructure as Code (Terraform)
```hcl
# infrastructure/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "edulens-vpc"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "edulens-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier = "edulens-postgres"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "edulens"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "edulens-postgres-final-snapshot"
  
  tags = {
    Name = "edulens-postgres"
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "main" {
  name       = "edulens-cache-subnet"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "edulens-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}

# S3 Bucket for file uploads
resource "aws_s3_bucket" "uploads" {
  bucket = "edulens-uploads-${random_string.bucket_suffix.result}"
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/edulens-backend"
  retention_in_days = 30
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "edulens-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "app" {
  name     = "edulens-backend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

# Monitoring and Alerting
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "edulens-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ECS CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ServiceName = aws_ecs_service.backend.name
    ClusterName = aws_ecs_cluster.main.name
  }
}
```

### Monitoring Configuration
```yaml
# monitoring/docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: logstash
    ports:
      - "5044:5044"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  prometheus_data:
  grafana_data:
  elasticsearch_data:
```

This completes the comprehensive EduLens Hybrid System Blueprint with all the requested components including mobile app architecture, web applications, backend services, file upload systems, search engine integration, authentication with RBAC, and complete CI/CD pipelines with monitoring solutions.
