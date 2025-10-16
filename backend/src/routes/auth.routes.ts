import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  validateNonce,
  validateAuth,
  validateRegister,
  validateUsernameCheck,
} from '../middleware/validator.middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/nonce
 * @desc    Generate nonce for wallet signature
 * @access  Public
 */
router.post('/nonce', validateNonce, authController.generateNonce);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user with signature
 * @access  Public
 */
router.post('/login', validateAuth, authController.login);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   GET /api/v1/auth/username/check
 * @desc    Check if username is available
 * @access  Public
 */
router.get('/username/check', validateUsernameCheck, authController.checkUsername);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user information
 * @access  Private
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;