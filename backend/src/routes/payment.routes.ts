import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  validateSendPayment,
  validateSavePayment,
  validateCreatePaymentLink,
  validateUpdateTransaction,
} from '../middleware/validator.middleware';

const router = Router();

// All payment routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/v1/payments/send
 * @desc    Create new payment transaction
 * @access  Private
 */
router.post('/send', validateSendPayment, paymentController.sendPayment);

/**
 * @route   POST /api/v1/payments/save
 * @desc    Create new payment transaction
 * @access  Private
 */
router.post('/save', validateSavePayment, paymentController.sendPayment);

/**
 * @route   GET /api/v1/payments/transactions
 * @desc    Get user's transaction history
 * @access  Private
 */
router.get('/transactions', paymentController.getTransactions);

/**
 * @route   GET /api/v1/payments/transactions/sent
 * @desc    Get sent transactions
 * @access  Private
 */
router.get('/transactions/sent', paymentController.getSentTransactions);

/**
 * @route   GET /api/v1/payments/transactions/received
 * @desc    Get received transactions
 * @access  Private
 */
router.get('/transactions/received', paymentController.getReceivedTransactions);

/**
 * @route   GET /api/v1/payments/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private
 */
router.get('/transactions/:id', paymentController.getTransactionById);

/**
 * @route   PUT /api/v1/payments/transactions/:id
 * @desc    Update transaction with blockchain hash
 * @access  Private
 */
router.put(
  '/transactions/:id',
  validateUpdateTransaction,
  paymentController.updateTransaction
);

/**
 * @route   POST /api/v1/payments/links
 * @desc    Create payment link
 * @access  Private
 */
router.post('/links', validateCreatePaymentLink, paymentController.createPaymentLink);

/**
 * @route   GET /api/v1/payments/links
 * @desc    Get user's payment links
 * @access  Private
 */
router.get('/links', paymentController.getUserPaymentLinks);

/**
 * @route   GET /api/v1/payments/links/:linkCode
 * @desc    Get payment link by code (public access for payers)
 * @access  Public
 */
router.get('/links/:linkCode', paymentController.getPaymentLink);

/**
 * @route   DELETE /api/v1/payments/links/:linkCode
 * @desc    Deactivate payment link
 * @access  Private
 */
router.delete('/links/:linkCode', paymentController.deactivatePaymentLink);

export default router;