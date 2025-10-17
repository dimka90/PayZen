import { Request, Response } from 'express';
import paymentService from '../services/payment.service';
import blockchainService from '../services/blockchain.service';

class DashboardController {
  /**
   * Get dashboard statistics
   * GET /api/v1/dashboard/stats
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.user?.wallet_address;

      if (!walletAddress) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const stats = await paymentService.getDashboardStats(walletAddress);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics',
      });
    }
  }

  /**
   * Get account balance
   * GET /api/v1/dashboard/balance
   */
  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.user?.wallet_address;

      if (!walletAddress) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const balance = await blockchainService.getUSDCBalance(walletAddress);

      res.status(200).json({
        success: true,
        data: {
          balance,
          currency: 'USDC',
          network: 'Base',
        },
      });
    } catch (error) {
      console.error('Get balance error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch balance',
      });
    }
  }

  /**
   * Check blockchain connection health
   * GET /api/v1/dashboard/health
   */
  async getHealth(_: Request, res: Response): Promise<void> {
    try {
      const isConnected = await blockchainService.isConnected();

      res.status(200).json({
        success: true,
        data: {
          blockchain_connected: isConnected,
          network: 'Base',
          status: isConnected ? 'healthy' : 'disconnected',
        },
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        success: false,
        error: 'Health check failed',
      });
    }
  }
}

export default new DashboardController();