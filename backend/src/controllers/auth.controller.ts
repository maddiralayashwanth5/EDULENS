import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { OTPService } from '../services/otp.service';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OTPService
  ) {}

  async sendOtp(req: Request, res: Response) {
    // Validate request
    await body('phoneNumber')
      .isMobilePhone('any')
      .withMessage('Invalid phone number')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    try {
      const { phoneNumber } = req.body;
      
      await this.otpService.sendOtp(phoneNumber);
      
      res.json({
        success: true,
        message: 'OTP sent successfully',
      });
    } catch (error) {
      logger.error('Send OTP error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP',
      });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    // Validate request
    await body('phoneNumber')
      .isMobilePhone('any')
      .withMessage('Invalid phone number')
      .run(req);
    
    await body('otp')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be 6 digits')
      .isNumeric()
      .withMessage('OTP must contain only numbers')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    try {
      const { phoneNumber, otp } = req.body;
      
      const isValid = await this.otpService.verifyOtp(phoneNumber, otp);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP',
        });
      }

      // Create or update user
      const user = await this.authService.createOrUpdateUser(phoneNumber);
      
      // Generate tokens
      const tokens = await this.authService.generateTokens(user.id, user.role);
      
      res.json({
        success: true,
        message: 'OTP verified successfully',
        data: {
          ...tokens,
          user: {
            id: user.id,
            phone: user.phone,
            role: user.role,
            isVerified: user.isVerified,
          },
        },
      });
    } catch (error) {
      logger.error('Verify OTP error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to verify OTP',
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    // Validate request
    await body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    try {
      const { refreshToken } = req.body;
      
      const result = await this.authService.refreshTokens(refreshToken);
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await this.authService.revokeToken(refreshToken);
      }
      
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to logout',
      });
    }
  }

  // Staff authentication methods
  async staffLogin(req: Request, res: Response) {
    // Validate request
    await body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .run(req);
    
    await body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    try {
      const { email, password } = req.body;
      
      const result = await this.authService.authenticateStaff(email, password);
      
      res.json({
        success: true,
        message: result.requiresTwoFactor ? '2FA required' : 'Login successful',
        data: result,
      });
    } catch (error) {
      logger.error('Staff login error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Login failed',
      });
    }
  }

  async verifyTwoFactor(req: Request, res: Response) {
    // Validate request
    await body('sessionToken')
      .notEmpty()
      .withMessage('Session token is required')
      .run(req);
    
    await body('totpCode')
      .isLength({ min: 6, max: 6 })
      .withMessage('TOTP code must be 6 digits')
      .isNumeric()
      .withMessage('TOTP code must contain only numbers')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    try {
      const { sessionToken, totpCode } = req.body;
      
      const result = await this.authService.verifyTwoFactor(sessionToken, totpCode);
      
      res.json({
        success: true,
        message: '2FA verified successfully',
        data: result,
      });
    } catch (error) {
      logger.error('2FA verification error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      
      res.status(500).json({
        success: false,
        message: '2FA verification failed',
      });
    }
  }
}
