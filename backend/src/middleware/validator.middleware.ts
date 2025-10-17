import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

// Helper to check validation results
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
    return;
  }
  next();
};

// Nonce validation
export const validateNonce = [
  body('wallet_address')
    .exists().withMessage('Wallet address is required')
    .isString().withMessage('Wallet address must be a string')
    .isLength({ min: 42, max: 42 }).withMessage('Invalid wallet address format')
    .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid Ethereum address'),
  validate,
];

// Login validation
export const validateAuth = [
  body('wallet_address')
    .exists().withMessage('Wallet address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid Ethereum address'),
  body('signature')
    .exists().withMessage('Signature is required')
    .isString().withMessage('Signature must be a string'),
  body('message')
    .exists().withMessage('Message is required')
    .isString().withMessage('Message must be a string'),
  validate,
];

// Registration validation
export const validateRegister = [
  body('wallet_address')
    .exists().withMessage('Wallet address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid Ethereum address'),
  body('full_name')
    .exists().withMessage('Full name is required')
    .isString().withMessage('Full name must be a string')
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage('Full name must be between 2 and 255 characters'),
  body('username')
    .exists().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),
  body('business_name')
    .optional()
    .isString().withMessage('Business name must be a string')
    .trim()
    .isLength({ max: 255 }).withMessage('Business name must not exceed 255 characters'),
  body('business_type')
    .optional()
    .isString().withMessage('Business type must be a string')
    .trim()
    .isLength({ max: 100 }).withMessage('Business type must not exceed 100 characters'),
  validate,
];

// Username check validation
export const validateUsernameCheck = [
  query('username')
    .exists().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  validate,
];

// Send payment validation
export const validateSendPayment = [
  body('recipient')
    .exists().withMessage('Recipient is required')
    .isString().withMessage('Recipient must be a string')
    .trim()
    .notEmpty().withMessage('Recipient cannot be empty'),
  body('amount')
    .exists().withMessage('Amount is required')
    .isString().withMessage('Amount must be a string')
    .matches(/^\d+(\.\d{1,6})?$/).withMessage('Invalid amount format')
    .custom((value) => parseFloat(value) > 0).withMessage('Amount must be greater than 0'),
  body('note')
    .optional()
    .isString().withMessage('Note must be a string')
    .trim()
    .isLength({ max: 500 }).withMessage('Note must not exceed 500 characters'),
  validate,
];

// Save payment validation
export const validateSavePayment = [
  body('transaction_hash')
    .exists().withMessage('Transaction hash is required')
    .isString().withMessage('Transaction hash must be a string')
    .trim()
    .notEmpty().withMessage('Transaction hash cannot be empty'),

  body('from_wallet')
    .exists().withMessage('Sender wallet address is required')
    .isString().withMessage('Sender wallet address must be a string')
    .trim()
    .notEmpty().withMessage('Sender wallet address cannot be empty'),

  body('to_wallet')
    .exists().withMessage('Recipient wallet address is required')
    .isString().withMessage('Recipient wallet address must be a string')
    .trim()
    .notEmpty().withMessage('Recipient wallet address cannot be empty'),

  body('amount')
    .exists().withMessage('Amount is required')
    .isString().withMessage('Amount must be a string')
    .matches(/^\d+(\.\d{1,6})?$/).withMessage('Invalid amount format')
    .custom((value) => parseFloat(value) > 0).withMessage('Amount must be greater than 0'),

  body('currency')
    .optional()
    .isString().withMessage('Currency must be a string')
    .isIn(['USDC', 'ETH', 'STRK']).withMessage('Unsupported currency type'),

  body('note')
    .optional()
    .isString().withMessage('Note must be a string')
    .trim()
    .isLength({ max: 500 }).withMessage('Note must not exceed 500 characters'),

  body('status')
    .optional()
    .isString().withMessage('Status must be a string')
    .isIn(['pending', 'completed', 'failed']).withMessage('Invalid transaction status'),

  validate,
];

// Create payment link validation
export const validateCreatePaymentLink = [
  body('title')
    .exists().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  body('amount')
    .optional()
    .isString().withMessage('Amount must be a string')
    .matches(/^\d+(\.\d{1,6})?$/).withMessage('Invalid amount format'),
  body('flexible_amount')
    .exists().withMessage('Flexible amount flag is required')
    .isBoolean().withMessage('Flexible amount must be a boolean'),
  validate,
];

// Update transaction validation
export const validateUpdateTransaction = [
  body('status')
    .optional()
    .isString().withMessage('Status must be a string')
    .isIn(['pending', 'completed', 'failed']).withMessage('Invalid status'),
  body('tx_hash')
    .optional()
    .isString().withMessage('Transaction hash must be a string')
    .matches(/^0x[a-fA-F0-9]{64}$/).withMessage('Invalid transaction hash format'),
  validate,
];