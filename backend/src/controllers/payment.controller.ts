import { Request, Response } from 'express';
import paymentService from '../services/payment.service';
import blockchainService from '../services/blockchain.service';

class PaymentController {
  /**
   * Create new payment/transaction
   * POST /api/v1/payments/send
   */
  async sendPayment(req: Request, res: Response): Promise<void> {
    try {
      const { recipient, amount, note } = req.body;
      const fromWallet = req.user?.wallet_address;

      if (!fromWallet) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      // Resolve recipient (username or wallet address)
      const toWallet = await paymentService.resolveRecipient(recipient);

      if (!toWallet) {
        res.status(404).json({
          success: false,
          error: 'Recipient not found',
        });
        return;
      }

      // Check sender balance
      const balance = await blockchainService.getUSDCBalance(fromWallet);

      if (parseFloat(balance) < parseFloat(amount)) {
        res.status(400).json({
          success: false,
          error: 'Insufficient balance',
          data: {
            available: balance,
            required: amount,
          },
        });
        return;
      }

      // Create transaction record (pending state)
      const transaction = await paymentService.createTransaction(
        fromWallet,
        toWallet,
        amount,
        note
      );

      res.status(201).json({
        success: true,
        data: {
          transaction: {
            id: transaction.id,
            from_wallet: transaction.from_wallet,
            to_wallet: transaction.to_wallet,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status,
            note: transaction.note,
            created_at: transaction.created_at,
          },
        },
        message: 'Transaction created. Please sign and submit transaction hash.',
      });
    } catch (error) {
      console.error('Send payment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create transaction',
      });
    }
  }

  /**
   * Update transaction with blockchain hash
   * PUT /api/v1/payments/transactions/:id
   */
  async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { tx_hash, status } = req.body;
      const walletAddress = req.user?.wallet_address;

      if (!walletAddress) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      // Get transaction
      const transaction = await paymentService.getTransaction(id);

      if (!transaction) {
        res.status(404).json({
          success: false,
          error: 'Transaction not found',
        });
        return;
      }

      // Verify user owns this transaction
      if (transaction.from_wallet.toLowerCase() !== walletAddress.toLowerCase()) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You can only update your own transactions',
        });
        return;
      }

      // If tx_hash provided, verify on blockchain
      if (tx_hash) {
        const isValid = await paymentService.verifyTransactionOnChain(tx_hash);
        
        if (!isValid) {
          res.status(400).json({
            success: false,
            error: 'Invalid or failed transaction hash',
          });
          return;
        }
      }

      // Update transaction
      const updated = await paymentService.updateTransactionStatus(
        id,
        status,
        tx_hash
      );

      res.status(200).json({
        success: true,
        data: {
          transaction: updated,
        },
        message: 'Transaction updated successfully',
      });
    } catch (error) {
      console.error('Update transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update transaction',
      });
    }
  }

  /**
   * Get transaction history
   * GET /api/v1/payments/transactions
   */
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.user?.wallet_address;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      if (!walletAddress) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const transactions = await paymentService.getUserTransactions(
        walletAddress,
        limit,
        offset
      );

      res.status(200).json({
        success: true,
        data: {
          transactions,
          count: transactions.length,
        },
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch transactions',
      });
    }
  }

  /**
   * Get sent transactions
   * GET /api/v1/payments/transactions/sent
   */
  async getSentTransactions(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.user?.wallet_address;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!walletAddress) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const transactions = await paymentService.getSentTransactions(
        walletAddress,
        limit
      );

      res.status(200).json({
        success: true,
        data: {
          transactions,
          count: transactions.length,
        },
      });
    } catch (error) {
      console.error('Get sent transactions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch sent transactions',
      });
    }
  }

  /**
   * Get received transactions
   * GET /api/v1/payments/transactions/received
   */
  async getReceivedTransactions(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.user?.wallet_address;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!walletAddress) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const transactions = await paymentService.getReceivedTransactions(
        walletAddress,
        limit
      );

      res.status(200).json({
        success: true,
        data: {
          transactions,
          count: transactions.length,
        },
      });
    } catch (error) {
      console.error('Get received transactions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch received transactions',
      });
    }
  }

  /**
   * Get transaction by ID
   * GET /api/v1/payments/transactions/:id
   */
  async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const walletAddress = req.user?.wallet_address;

      if (!walletAddress) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const transaction = await paymentService.getTransaction(id);

      if (!transaction) {
        res.status(404).json({
          success: false,
          error: 'Transaction not found',
        });
        return;
      }

      // Check if user has access to this transaction
      if (
        transaction.from_wallet.toLowerCase() !== walletAddress.toLowerCase() &&
        transaction.to_wallet.toLowerCase() !== walletAddress.toLowerCase()
      ) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: Access denied',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          transaction,
        },
      });
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch transaction',
      });
    }
  }

  /**
   * Create payment link
   * POST /api/v1/payments/links
   */
  async createPaymentLink(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, amount, flexible_amount } = req.body;
      const userId = req.user?.user_id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const paymentLink = await paymentService.createPaymentLink(
        userId,
        title,
        description,
        amount,
        flexible_amount
      );

      res.status(201).json({
        success: true,
        data: {
          payment_link: {
            id: paymentLink.id,
            title: paymentLink.title,
            description: paymentLink.description,
            amount: paymentLink.amount,
            flexible_amount: paymentLink.flexible_amount,
            link_code: paymentLink.link_code,
            link_url: `${req.protocol}://${req.get('host')}/pay/${paymentLink.link_code}`,
            times_used: paymentLink.times_used,
            created_at: paymentLink.created_at,
          },
        },
        message: 'Payment link created successfully',
      });
    } catch (error) {
      console.error('Create payment link error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create payment link',
      });
    }
  }

  /**
   * Get payment link by code
   * GET /api/v1/payments/links/:linkCode
   */
  async getPaymentLink(req: Request, res: Response): Promise<void> {
    try {
      const { linkCode } = req.params;

      const paymentLink = await paymentService.getPaymentLinkByCode(linkCode);

      if (!paymentLink) {
        res.status(404).json({
          success: false,
          error: 'Payment link not found or inactive',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          payment_link: paymentLink,
        },
      });
    } catch (error) {
      console.error('Get payment link error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch payment link',
      });
    }
  }

  /**
   * Get user's payment links
   * GET /api/v1/payments/links
   */
  async getUserPaymentLinks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const paymentLinks = await paymentService.getUserPaymentLinks(userId);

      res.status(200).json({
        success: true,
        data: {
          payment_links: paymentLinks,
          count: paymentLinks.length,
        },
      });
    } catch (error) {
      console.error('Get user payment links error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch payment links',
      });
    }
  }

  /**
   * Deactivate payment link
   * DELETE /api/v1/payments/links/:linkCode
   */
  async deactivatePaymentLink(req: Request, res: Response): Promise<void> {
    try {
      const { linkCode } = req.params;
      const userId = req.user?.user_id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      await paymentService.deactivatePaymentLink(linkCode, userId);

      res.status(200).json({
        success: true,
        message: 'Payment link deactivated successfully',
      });
    } catch (error) {
      console.error('Deactivate payment link error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to deactivate payment link',
      });
    }
  }
}

export default new PaymentController();