import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import { AppError } from '../middleware/error.middleware';
import { prisma } from '../index';

export class AuthService {
  async generateTokens(userId: string, role: string) {
    const payload = { userId, role };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // Store refresh token in database
    await prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      
      // Check if refresh token exists in database
      const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const tokens = await this.generateTokens(decoded.userId, decoded.role);
      
      // Delete old refresh token
      await prisma.session.delete({
        where: { refreshToken },
      });
      
      return { ...tokens, user: session.user };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async revokeToken(refreshToken: string) {
    await prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  async createOrUpdateUser(phoneNumber: string) {
    const user = await prisma.user.upsert({
      where: { phone: phoneNumber },
      update: { 
        isVerified: true,
        updatedAt: new Date(),
      },
      create: {
        phone: phoneNumber,
        isVerified: true,
        role: 'PARENT',
      },
    });

    return user;
  }

  // Staff authentication methods
  async authenticateStaff(email: string, password: string) {
    const user = await prisma.staffUser.findUnique({
      where: { email, isActive: true },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await prisma.staffUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

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
    const tokens = await this.generateStaffTokens(user.id, user.role);
    return { ...tokens, requiresTwoFactor: false, user };
  }

  async verifyTwoFactor(sessionToken: string, totpCode: string) {
    try {
      const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET!) as any;
      
      if (decoded.step !== '2fa') {
        throw new AppError('Invalid session', 401);
      }

      const user = await prisma.staffUser.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.totpSecret) {
        throw new AppError('Invalid user', 401);
      }

      // Verify TOTP code
      const isValidTOTP = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: totpCode,
        window: 2, // Allow 2 time steps before/after
      });

      if (!isValidTOTP) {
        throw new AppError('Invalid TOTP code', 401);
      }

      // Generate full tokens
      const tokens = await this.generateStaffTokens(user.id, user.role);
      return { ...tokens, user };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid 2FA verification', 401);
    }
  }

  private async generateStaffTokens(userId: string, role: string) {
    const payload = { userId, role, isStaff: true };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    // Store refresh token in database
    await prisma.staffSession.create({
      data: {
        staffUserId: userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken, refreshToken };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateTOTPSecret(): string {
    return speakeasy.generateSecret({
      name: 'EduLens Admin',
      length: 32,
    }).base32;
  }
}
