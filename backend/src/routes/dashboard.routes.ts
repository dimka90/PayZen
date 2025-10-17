import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', dashboardController.getStats);

/**
 * @route   GET /api/v1/dashboard/balance
 * @desc    Get account balance from blockchain
 * @access  Private
 */
router.get('/balance', dashboardController.getBalance);

/**
 * @route   GET /api/v1/dashboard/health
 * @desc    Check blockchain connection health
 * @access  Private
 */
router.get('/health', dashboardController.getHealth);

export default router;