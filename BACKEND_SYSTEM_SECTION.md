## 🟢 4. BACKEND SYSTEM (Node.js/Express)

### Project Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── docker/
└── scripts/
```

### Dependencies (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.6.0",
    "@prisma/client": "^5.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "rate-limiter-flexible": "^3.0.8",
    "redis": "^4.6.10",
    "aws-sdk": "^2.1490.0",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "nodemailer": "^6.9.7",
    "twilio": "^4.19.0",
    "meilisearch": "^0.35.0",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.8.10",
    "@types/express": "^4.17.21",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### Database Schema (Prisma)
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  phone       String?  @unique
  email       String?  @unique
  role        UserRole @default(PARENT)
  isVerified  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  reviews     Review[]
  complaints  Complaint[]
  sessions    Session[]

  @@map("users")
}

model StaffUser {
  id          String     @id @default(cuid())
  email       String     @unique
  password    String
  role        StaffRole
  permissions Json
  totpSecret  String?
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Relations
  sessions    StaffSession[]
  auditLogs   AuditLog[]

  @@map("staff_users")
}

model School {
  id              String   @id @default(cuid())
  name            String
  address         String
  city            String
  state           String
  pincode         String
  latitude        Float
  longitude       Float
  phone           String
  email           String
  website         String?
  
  // School Details
  board           Board
  type            SchoolType
  medium          String[]
  gradesFrom      String
  gradesTo        String
  
  // Infrastructure
  totalArea       Float
  builtUpArea     Float
  playgroundArea  Float
  laboratories    String[]
  hasLibrary      Boolean  @default(false)
  hasComputerLab  Boolean  @default(false)
  hasSportsComplex Boolean @default(false)
  
  // Fees
  admissionFee    Float
  annualFee       Float
  transportFee    Float?
  
  // Safety & Compliance
  fireSafety      Boolean  @default(false)
  cctvSurveillance Boolean @default(false)
  securityGuards  Boolean  @default(false)
  medicalRoom     Boolean  @default(false)
  
  // Teachers
  totalTeachers   Int
  qualifiedTeachers Int
  studentTeacherRatio Float
  
  // Academics
  passingRate     Float
  averageScore    Float
  
  // ETI Score
  etiScore        Float    @default(0)
  etiBreakdown    Json
  
  // Status
  isVerified      Boolean  @default(false)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  reviews         Review[]
  complaints      Complaint[]
  documents       Document[]
  verifications   Verification[]

  @@map("schools")
}

model Review {
  id          String      @id @default(cuid())
  schoolId    String
  userId      String
  rating      Int         // 1-5
  title       String
  content     String
  isAnonymous Boolean     @default(false)
  status      ReviewStatus @default(PENDING)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  school      School      @relation(fields: [schoolId], references: [id])
  user        User        @relation(fields: [userId], references: [id])

  @@map("reviews")
}

model Complaint {
  id          String         @id @default(cuid())
  schoolId    String
  userId      String
  category    ComplaintCategory
  title       String
  description String
  evidence    Json           // Array of file URLs
  status      ComplaintStatus @default(OPEN)
  priority    Priority       @default(MEDIUM)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  // Relations
  school      School         @relation(fields: [schoolId], references: [id])
  user        User           @relation(fields: [userId], references: [id])

  @@map("complaints")
}

model Document {
  id          String       @id @default(cuid())
  schoolId    String?
  filename    String
  originalName String
  mimeType    String
  size        Int
  url         String
  category    DocumentCategory
  isVerified  Boolean      @default(false)
  uploadedBy  String
  createdAt   DateTime     @default(now())

  // Relations
  school      School?      @relation(fields: [schoolId], references: [id])

  @@map("documents")
}

model Verification {
  id          String           @id @default(cuid())
  schoolId    String
  field       String
  oldValue    Json
  newValue    Json
  aiFlag      String?
  confidence  Float?
  status      VerificationStatus @default(PENDING)
  reviewedBy  String?
  reviewedAt  DateTime?
  createdAt   DateTime         @default(now())

  // Relations
  school      School           @relation(fields: [schoolId], references: [id])

  @@map("verifications")
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  action      String
  resource    String
  resourceId  String
  oldValues   Json?
  newValues   Json?
  ipAddress   String
  userAgent   String
  createdAt   DateTime @default(now())

  // Relations
  user        StaffUser @relation(fields: [userId], references: [id])

  @@map("audit_logs")
}

// Enums
enum UserRole {
  PARENT
  GUARDIAN
}

enum StaffRole {
  DATA_COLLECTOR
  VERIFIER
  MODERATOR
  ADMIN
}

enum Board {
  CBSE
  ICSE
  STATE_BOARD
  IB
  IGCSE
}

enum SchoolType {
  GOVERNMENT
  PRIVATE
  AIDED
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ComplaintCategory {
  INFRASTRUCTURE
  TEACHING_QUALITY
  SAFETY
  FEES
  ADMINISTRATION
  OTHER
}

enum ComplaintStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum DocumentCategory {
  SCHOOL_CERTIFICATE
  INFRASTRUCTURE_PHOTO
  SAFETY_CERTIFICATE
  OTHER
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### API Controllers

#### Auth Controller
```typescript
// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { OTPService } from '../services/otp.service';
import { validateSchema } from '../middleware/validation';
import { sendOtpSchema, verifyOtpSchema } from '../schemas/auth.schema';

export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OTPService
  ) {}

  @validateSchema(sendOtpSchema)
  async sendOtp(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;
      
      await this.otpService.sendOtp(phoneNumber);
      
      res.json({
        success: true,
        message: 'OTP sent successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  @validateSchema(verifyOtpSchema)
  async verifyOtp(req: Request, res: Response) {
    try {
      const { phoneNumber, otp } = req.body;
      
      const isValid = await this.otpService.verifyOtp(phoneNumber, otp);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP',
        });
      }

      const tokens = await this.authService.generateTokens(phoneNumber);
      
      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      const tokens = await this.authService.refreshTokens(refreshToken);
      
      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }
  }
}
```

#### School Controller
```typescript
// src/controllers/school.controller.ts
import { Request, Response } from 'express';
import { SchoolService } from '../services/school.service';
import { SearchService } from '../services/search.service';
import { validateSchema } from '../middleware/validation';
import { createSchoolSchema, updateSchoolSchema } from '../schemas/school.schema';

export class SchoolController {
  constructor(
    private schoolService: SchoolService,
    private searchService: SearchService
  ) {}

  async searchSchools(req: Request, res: Response) {
    try {
      const {
        q: query,
        lat: latitude,
        lng: longitude,
        radius,
        board,
        type,
        minScore,
        maxFees,
        page = 1,
        limit = 20,
      } = req.query;

      const searchParams = {
        query: query as string,
        location: latitude && longitude ? {
          lat: parseFloat(latitude as string),
          lng: parseFloat(longitude as string),
          radius: radius ? parseInt(radius as string) : 10,
        } : undefined,
        filters: {
          board: board as string,
          type: type as string,
          minScore: minScore ? parseFloat(minScore as string) : undefined,
          maxFees: maxFees ? parseFloat(maxFees as string) : undefined,
        },
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
        },
      };

      const results = await this.searchService.searchSchools(searchParams);
      
      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getSchool(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const school = await this.schoolService.getSchoolById(id);
      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found',
        });
      }

      res.json({
        success: true,
        data: school,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  @validateSchema(createSchoolSchema)
  async createSchool(req: Request, res: Response) {
    try {
      const schoolData = req.body;
      const userId = req.user.id; // From auth middleware
      
      const school = await this.schoolService.createSchool(schoolData, userId);
      
      res.status(201).json({
        success: true,
        data: school,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  @validateSchema(updateSchoolSchema)
  async updateSchool(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      
      const school = await this.schoolService.updateSchool(id, updateData, userId);
      
      res.json({
        success: true,
        data: school,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
```

### Services Layer

#### School Service
```typescript
// src/services/school.service.ts
import { PrismaClient } from '@prisma/client';
import { SearchService } from './search.service';
import { ETICalculatorService } from './eti-calculator.service';
import { AuditService } from './audit.service';

export class SchoolService {
  constructor(
    private prisma: PrismaClient,
    private searchService: SearchService,
    private etiCalculator: ETICalculatorService,
    private auditService: AuditService
  ) {}

  async createSchool(data: CreateSchoolData, createdBy: string) {
    const etiScore = this.etiCalculator.calculateETI(data);
    
    const school = await this.prisma.school.create({
      data: {
        ...data,
        etiScore: etiScore.total,
        etiBreakdown: etiScore.breakdown,
      },
    });

    // Index in search engine
    await this.searchService.indexSchool(school);

    // Log audit trail
    await this.auditService.log({
      userId: createdBy,
      action: 'CREATE_SCHOOL',
      resource: 'school',
      resourceId: school.id,
      newValues: school,
    });

    return school;
  }

  async updateSchool(id: string, data: UpdateSchoolData, updatedBy: string) {
    const existingSchool = await this.prisma.school.findUnique({
      where: { id },
    });

    if (!existingSchool) {
      throw new Error('School not found');
    }

    // Recalculate ETI score if relevant fields changed
    const etiScore = this.etiCalculator.calculateETI({ ...existingSchool, ...data });
    
    const updatedSchool = await this.prisma.school.update({
      where: { id },
      data: {
        ...data,
        etiScore: etiScore.total,
        etiBreakdown: etiScore.breakdown,
      },
    });

    // Update search index
    await this.searchService.updateSchool(updatedSchool);

    // Log audit trail
    await this.auditService.log({
      userId: updatedBy,
      action: 'UPDATE_SCHOOL',
      resource: 'school',
      resourceId: id,
      oldValues: existingSchool,
      newValues: updatedSchool,
    });

    return updatedSchool;
  }

  async getSchoolById(id: string) {
    return this.prisma.school.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { status: 'APPROVED' },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          where: { isVerified: true },
        },
      },
    });
  }

  async getTopSchools(limit = 10) {
    return this.prisma.school.findMany({
      where: {
        isVerified: true,
        isActive: true,
      },
      orderBy: { etiScore: 'desc' },
      take: limit,
    });
  }
}
```

#### ETI Calculator Service
```typescript
// src/services/eti-calculator.service.ts
export class ETICalculatorService {
  calculateETI(schoolData: any) {
    const weights = {
      infrastructure: 0.25,
      academics: 0.30,
      safety: 0.20,
      teachers: 0.15,
      facilities: 0.10,
    };

    const scores = {
      infrastructure: this.calculateInfrastructureScore(schoolData),
      academics: this.calculateAcademicsScore(schoolData),
      safety: this.calculateSafetyScore(schoolData),
      teachers: this.calculateTeachersScore(schoolData),
      facilities: this.calculateFacilitiesScore(schoolData),
    };

    const total = Object.entries(scores).reduce((sum, [key, score]) => {
      return sum + (score * weights[key as keyof typeof weights]);
    }, 0);

    return {
      total: Math.round(total),
      breakdown: scores,
      weights,
    };
  }

  private calculateInfrastructureScore(data: any): number {
    let score = 0;
    
    // Area calculations
    const areaRatio = data.builtUpArea / data.totalArea;
    score += Math.min(areaRatio * 40, 40); // Max 40 points
    
    // Playground area
    const playgroundRatio = data.playgroundArea / data.totalArea;
    score += Math.min(playgroundRatio * 100 * 20, 20); // Max 20 points
    
    // Laboratories
    score += Math.min(data.laboratories.length * 5, 25); // Max 25 points
    
    // Basic facilities
    if (data.hasLibrary) score += 5;
    if (data.hasComputerLab) score += 5;
    if (data.hasSportsComplex) score += 5;
    
    return Math.min(score, 100);
  }

  private calculateAcademicsScore(data: any): number {
    let score = 0;
    
    // Passing rate (40% weightage)
    score += (data.passingRate / 100) * 40;
    
    // Average score (40% weightage)
    score += (data.averageScore / 100) * 40;
    
    // Board bonus (20% weightage)
    const boardBonus = {
      'CBSE': 20,
      'ICSE': 18,
      'IB': 20,
      'IGCSE': 18,
      'STATE_BOARD': 15,
    };
    score += boardBonus[data.board] || 10;
    
    return Math.min(score, 100);
  }

  private calculateSafetyScore(data: any): number {
    let score = 0;
    
    if (data.fireSafety) score += 25;
    if (data.cctvSurveillance) score += 25;
    if (data.securityGuards) score += 25;
    if (data.medicalRoom) score += 25;
    
    return score;
  }

  private calculateTeachersScore(data: any): number {
    let score = 0;
    
    // Qualification ratio (50% weightage)
    const qualificationRatio = data.qualifiedTeachers / data.totalTeachers;
    score += qualificationRatio * 50;
    
    // Student-teacher ratio (50% weightage)
    // Ideal ratio is 1:20, score decreases as ratio increases
    const idealRatio = 20;
    const ratioScore = Math.max(0, (idealRatio - Math.abs(data.studentTeacherRatio - idealRatio)) / idealRatio * 50);
    score += ratioScore;
    
    return Math.min(score, 100);
  }

  private calculateFacilitiesScore(data: any): number {
    let score = 0;
    
    // Fee affordability (relative to area average)
    // This would need area-specific data
    score += 50; // Placeholder
    
    // Additional facilities
    if (data.transportFee !== null) score += 10;
    
    // Medium diversity
    score += Math.min(data.medium.length * 10, 40);
    
    return Math.min(score, 100);
  }
}
```

### Middleware

#### Authentication Middleware
```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
    permissions?: string[];
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }
    next();
  };
};
```

#### Rate Limiting Middleware
```typescript
// src/middleware/rate-limit.middleware.ts
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

// Different rate limits for different endpoints
const rateLimiters = {
  auth: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rl_auth',
    points: 5, // Number of requests
    duration: 300, // Per 5 minutes
  }),
  
  search: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rl_search',
    points: 100, // Number of requests
    duration: 60, // Per minute
  }),
  
  general: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rl_general',
    points: 1000, // Number of requests
    duration: 3600, // Per hour
  }),
};

export const createRateLimit = (type: keyof typeof rateLimiters) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = req.ip || req.connection.remoteAddress || 'unknown';
      await rateLimiters[type].consume(key);
      next();
    } catch (rejRes) {
      const remainingPoints = rejRes.remainingPoints || 0;
      const msBeforeNext = rejRes.msBeforeNext || 1000;
      
      res.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
      res.set('X-RateLimit-Limit', String(rateLimiters[type].points));
      res.set('X-RateLimit-Remaining', String(remainingPoints));
      res.set('X-RateLimit-Reset', String(new Date(Date.now() + msBeforeNext)));
      
      res.status(429).json({
        success: false,
        message: 'Too many requests',
      });
    }
  };
};
```
