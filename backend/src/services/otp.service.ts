import { Twilio } from 'twilio';
import { prisma } from '../index';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export class OTPService {
  private twilio: Twilio | null = null;

  private getTwilioClient(): Twilio {
    if (!this.twilio) {
      // Only initialize Twilio if credentials are valid
      if (process.env.TWILIO_ACCOUNT_SID?.startsWith('AC')) {
        this.twilio = new Twilio(
          process.env.TWILIO_ACCOUNT_SID!,
          process.env.TWILIO_AUTH_TOKEN!
        );
      }
    }
    return this.twilio!;
  }

  async sendOtp(phoneNumber: string): Promise<void> {
    try {
      // Clean phone number format
      const cleanPhone = this.cleanPhoneNumber(phoneNumber);
      
      // Check rate limiting - max 5 OTPs per hour per phone
      const recentOtps = await prisma.otpCode.count({
        where: {
          phone: cleanPhone,
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
          },
        },
      });

      if (recentOtps >= 5) {
        throw new AppError('Too many OTP requests. Please try again later.', 429);
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in database with 5-minute expiry
      await prisma.otpCode.create({
        data: {
          phone: cleanPhone,
          code: otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
      });

      // Send SMS
      if (process.env.NODE_ENV === 'production' && this.getTwilioClient()) {
        await this.getTwilioClient().messages.create({
          body: `Your EduLens verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
          from: process.env.TWILIO_PHONE_NUMBER!,
          to: cleanPhone,
        });
      } else {
        // In development, log the OTP instead of sending SMS
        logger.info(`OTP for ${cleanPhone}: ${otp}`);
      }

      logger.info(`OTP sent to ${cleanPhone}`);
    } catch (error) {
      logger.error('Failed to send OTP:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to send OTP. Please try again.', 500);
    }
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      const cleanPhone = this.cleanPhoneNumber(phoneNumber);
      
      // Find valid OTP
      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          phone: cleanPhone,
          code: otp,
          isUsed: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!otpRecord) {
        // Increment attempts for rate limiting
        await this.incrementAttempts(cleanPhone);
        return false;
      }

      // Mark OTP as used
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });

      // Clean up old OTPs for this phone number
      await this.cleanupOldOtps(cleanPhone);

      logger.info(`OTP verified successfully for ${cleanPhone}`);
      return true;
    } catch (error) {
      logger.error('Failed to verify OTP:', error);
      return false;
    }
  }

  private cleanPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.length === 10 && !cleaned.startsWith('91')) {
      cleaned = '91' + cleaned;
    }
    
    // Add + prefix
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  private async incrementAttempts(phoneNumber: string): Promise<void> {
    const recentAttempts = await prisma.otpCode.count({
      where: {
        phone: phoneNumber,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    });

    if (recentAttempts >= 10) {
      throw new AppError('Too many failed attempts. Please try again later.', 429);
    }
  }

  private async cleanupOldOtps(phoneNumber: string): Promise<void> {
    // Delete OTPs older than 1 hour
    await prisma.otpCode.deleteMany({
      where: {
        phone: phoneNumber,
        createdAt: {
          lt: new Date(Date.now() - 60 * 60 * 1000),
        },
      },
    });
  }

  // Utility method for testing
  async getOtpForTesting(phoneNumber: string): Promise<string | null> {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    const cleanPhone = this.cleanPhoneNumber(phoneNumber);
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        phone: cleanPhone,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return otpRecord?.code || null;
  }
}
