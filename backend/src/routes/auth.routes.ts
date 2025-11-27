import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { OTPService } from '../services/otp.service';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../middleware/error.middleware';

const router = Router();

// Initialize services and controller
const otpService = new OTPService();
const authService = new AuthService();
const authController = new AuthController(authService, otpService);

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to phone number
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+919876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid phone number or rate limit exceeded
 */
router.post('/send-otp', asyncHandler(authController.sendOtp.bind(authController)));

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and get access tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+919876543210"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       type: object
 *       400:
 *         description: Invalid OTP
 */
router.post('/verify-otp', asyncHandler(authController.verifyOtp.bind(authController)));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', asyncHandler(authController.refreshToken.bind(authController)));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', asyncHandler(authController.logout.bind(authController)));

// Staff authentication routes
/**
 * @swagger
 * /api/auth/staff/login:
 *   post:
 *     summary: Staff login with email and password
 *     tags: [Staff Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful or 2FA required
 *       401:
 *         description: Invalid credentials
 */
router.post('/staff/login', asyncHandler(authController.staffLogin.bind(authController)));

/**
 * @swagger
 * /api/auth/staff/verify-2fa:
 *   post:
 *     summary: Verify 2FA code for staff login
 *     tags: [Staff Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *               totpCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA verified successfully
 *       401:
 *         description: Invalid 2FA code
 */
router.post('/staff/verify-2fa', asyncHandler(authController.verifyTwoFactor.bind(authController)));

export default router;
