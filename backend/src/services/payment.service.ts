import crypto from 'crypto';
import db from '../database';
import blockchainService from './blockchain.service';
import { Transaction, PaymentLink } from '../types/payzen_types';

class PaymentService {
  /**
   * Resolve recipient (username or wallet address)
   */
  async resolveRecipient(recipient: string): Promise<string | null> {
    // Check if it's a wallet address
    if (blockchainService.isValidAddress(recipient)) {
      return recipient.toLowerCase();
    }

    // Try to find user by username
    const username = recipient.startsWith('@') ? recipient.substring(1) : recipient;
    
    const result = await db.query(
      'SELECT wallet_address FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    return result.rows.length > 0 ? result.rows[0].wallet_address : null;
  }

  /**
   * Create transaction record
   */
  async createTransaction(
    fromWallet: string,
    toWallet: string,
    amount: string,
    note?: string
  ): Promise<Transaction> {
    const result = await db.query(
      `INSERT INTO transactions (from_wallet, to_wallet, amount, note, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [fromWallet.toLowerCase(), toWallet.toLowerCase(), amount, note || null]
    );

    return result.rows[0] as Transaction;
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    transactionId: string,
    status: string,
    txHash?: string
  ): Promise<Transaction> {
    const result = await db.query(
      `UPDATE transactions 
       SET status = $1, tx_hash = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, txHash || null, transactionId]
    );

    return result.rows[0] as Transaction;
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const result = await db.query(
      'SELECT * FROM transactions WHERE id = $1',
      [transactionId]
    );

    return result.rows.length > 0 ? (result.rows[0] as Transaction) : null;
  }

  /**
   * Verify transaction on blockchain
   */
  async verifyTransactionOnChain(txHash: string): Promise<boolean> {
    try {
      const isValid = await blockchainService.verifyTransaction(txHash);
      
      if (!isValid) {
        return false;
      }

      // Optional: Parse and verify USDC transfer details
      const transfer = await blockchainService.parseUSDCTransfer(txHash);
      
      if (!transfer) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying transaction on chain:', error);
      return false;
    }
  }

  /**
   * Get user transactions (sent + received)
   */
  async getUserTransactions(
    walletAddress: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Transaction[]> {
    const result = await db.query(
      `SELECT * FROM transactions 
       WHERE from_wallet = $1 OR to_wallet = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [walletAddress.toLowerCase(), limit, offset]
    );

    return result.rows as Transaction[];
  }

  /**
   * Get sent transactions
   */
  async getSentTransactions(
    walletAddress: string,
    limit: number = 50
  ): Promise<Transaction[]> {
    const result = await db.query(
      `SELECT * FROM transactions 
       WHERE from_wallet = $1 AND status = 'completed'
       ORDER BY created_at DESC
       LIMIT $2`,
      [walletAddress.toLowerCase(), limit]
    );

    return result.rows as Transaction[];
  }

  /**
   * Get received transactions
   */
  async getReceivedTransactions(
    walletAddress: string,
    limit: number = 50
  ): Promise<Transaction[]> {
    const result = await db.query(
      `SELECT * FROM transactions 
       WHERE to_wallet = $1 AND status = 'completed'
       ORDER BY created_at DESC
       LIMIT $2`,
      [walletAddress.toLowerCase(), limit]
    );

    return result.rows as Transaction[];
  }

  /**
   * Generate unique payment link code
   */
  private generateLinkCode(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Create payment link
   */
  async createPaymentLink(
    userId: string,
    title: string,
    description: string | undefined,
    amount: string | undefined,
    flexibleAmount: boolean
  ): Promise<PaymentLink> {
    const linkCode = this.generateLinkCode();

    const result = await db.query(
      `INSERT INTO payment_links (user_id, title, description, amount, flexible_amount, link_code)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, title, description || null, amount || null, flexibleAmount, linkCode]
    );

    return result.rows[0] as PaymentLink;
  }

  /**
   * Get payment link by code
   */
  async getPaymentLinkByCode(linkCode: string): Promise<(PaymentLink & { user: any }) | null> {
    const result = await db.query(
      `SELECT pl.*, 
              u.wallet_address, u.username, u.full_name
       FROM payment_links pl
       JOIN users u ON pl.user_id = u.id
       WHERE pl.link_code = $1 AND pl.is_active = true`,
      [linkCode]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    
    return {
      ...row,
      user: {
        wallet_address: row.wallet_address,
        username: row.username,
        full_name: row.full_name,
      },
    };
  }

  /**
   * Get user's payment links
   */
  async getUserPaymentLinks(userId: string): Promise<PaymentLink[]> {
    const result = await db.query(
      `SELECT * FROM payment_links 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows as PaymentLink[];
  }

  /**
   * Deactivate payment link
   */
  async deactivatePaymentLink(linkCode: string, userId: string): Promise<void> {
    await db.query(
      `UPDATE payment_links 
       SET is_active = false 
       WHERE link_code = $1 AND user_id = $2`,
      [linkCode, userId]
    );
  }

  /**
   * Increment payment link usage
   */
  async incrementLinkUsage(linkCode: string): Promise<void> {
    await db.query(
      `UPDATE payment_links 
       SET times_used = times_used + 1 
       WHERE link_code = $1`,
      [linkCode]
    );
  }

  /**
   * Record payment link payment
   */
  async recordPaymentLinkPayment(
    paymentLinkId: string,
    transactionId: string,
    payerWallet: string,
    amount: string
  ): Promise<void> {
    await db.query(
      `INSERT INTO payment_link_payments (payment_link_id, transaction_id, payer_wallet, amount)
       VALUES ($1, $2, $3, $4)`,
      [paymentLinkId, transactionId, payerWallet.toLowerCase(), amount]
    );

    // Increment link usage
    await db.query(
      `UPDATE payment_links 
       SET times_used = times_used + 1 
       WHERE id = $1`,
      [paymentLinkId]
    );
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(walletAddress: string): Promise<{
    total_balance: string;
    monthly_volume: string;
    monthly_change: number;
    received_count: number;
    received_amount: string;
    sent_count: number;
    sent_amount: string;
  }> {
    const wallet = walletAddress.toLowerCase();

    // Get balance from blockchain
    const balance = await blockchainService.getUSDCBalance(wallet);

    // Get this month's transactions
    const thisMonth = await db.query(
      `SELECT 
        SUM(CASE WHEN to_wallet = $1 AND status = 'completed' THEN amount ELSE 0 END) as received,
        SUM(CASE WHEN from_wallet = $1 AND status = 'completed' THEN amount ELSE 0 END) as sent,
        COUNT(CASE WHEN to_wallet = $1 AND status = 'completed' THEN 1 END) as received_count,
        COUNT(CASE WHEN from_wallet = $1 AND status = 'completed' THEN 1 END) as sent_count
       FROM transactions
       WHERE (from_wallet = $1 OR to_wallet = $1)
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
       AND status = 'completed'`,
      [wallet]
    );

    // Get last month's transactions for comparison
    const lastMonth = await db.query(
      `SELECT 
        SUM(CASE WHEN to_wallet = $1 THEN amount ELSE -amount END) as volume
       FROM transactions
       WHERE (from_wallet = $1 OR to_wallet = $1)
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND created_at < DATE_TRUNC('month', CURRENT_DATE)
       AND status = 'completed'`,
      [wallet]
    );

    const currentMonthData = thisMonth.rows[0];
    const lastMonthVolume = parseFloat(lastMonth.rows[0]?.volume || '0');
    const currentMonthVolume = 
      parseFloat(currentMonthData.received || '0') + 
      parseFloat(currentMonthData.sent || '0');

    // Calculate percentage change
    const monthlyChange = lastMonthVolume > 0
      ? ((currentMonthVolume - lastMonthVolume) / lastMonthVolume) * 100
      : 0;

    // Get all-time received and sent
    const allTime = await db.query(
      `SELECT 
        COUNT(CASE WHEN to_wallet = $1 AND status = 'completed' THEN 1 END) as received_count,
        SUM(CASE WHEN to_wallet = $1 AND status = 'completed' THEN amount ELSE 0 END) as received_amount,
        COUNT(CASE WHEN from_wallet = $1 AND status = 'completed' THEN 1 END) as sent_count,
        SUM(CASE WHEN from_wallet = $1 AND status = 'completed' THEN amount ELSE 0 END) as sent_amount
       FROM transactions
       WHERE (from_wallet = $1 OR to_wallet = $1)
       AND status = 'completed'`,
      [wallet]
    );

    const allTimeData = allTime.rows[0];

    return {
      total_balance: balance,
      monthly_volume: currentMonthVolume.toFixed(2),
      monthly_change: parseFloat(monthlyChange.toFixed(2)),
      received_count: parseInt(allTimeData.received_count || '0'),
      received_amount: parseFloat(allTimeData.received_amount || '0').toFixed(2),
      sent_count: parseInt(allTimeData.sent_count || '0'),
      sent_amount: parseFloat(allTimeData.sent_amount || '0').toFixed(2),
    };
  }
}

export default new PaymentService();