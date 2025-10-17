import { Request, Response } from 'express';
import authService from '../services/auth.service';
import blockchainService from '../services/blockchain.service';

class AuthController {
  /**
   * Generate nonce for wallet signature
   * POST /api/v1/auth/nonce
   */
  async generateNonce(req: Request, res: Response): Promise<void> {
    try {
      const { wallet_address } = req.body;

      // Validate wallet address
      if (!blockchainService.isValidAddress(wallet_address)) {
        res.status(400).json({
          success: false,
          error: 'Invalid wallet address',
        });
        return;
      }

      const nonce = await authService.generateNonce(wallet_address);

      res.status(200).json({
        success: true,
        data: {
          nonce,
          message: `Sign this message to authenticate: ${nonce}`,
        },
      });
    } catch (error) {
      console.error('Generate nonce error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate nonce',
      });
    }
  }

  /**
   * Authenticate user with signature
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { wallet_address, signature, message } = req.body;

      // Verify signature
      const { valid, user } = await authService.verifySignature(
        wallet_address,
        signature,
        message
      );

      if (!valid) {
        res.status(401).json({
          success: false,
          error: 'Invalid signature or expired nonce',
        });
        return;
      }

      if (!user) {
        // User not registered
        res.status(404).json({
          success: false,
          error: 'User not registered',
          message: 'Please complete registration',
        });
        return;
      }

      // Generate JWT token
      const token = authService.generateToken(user);

      res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            wallet_address: user.wallet_address,
            full_name: user.full_name,
            username: user.username,
            business_name: user.business_name,
            business_type: user.business_type,
          },
        },
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Authentication failed',
      });
    }
  }

  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { wallet_address, full_name, username, business_name, business_type } = req.body;

      // Validate wallet address
      if (!blockchainService.isValidAddress(wallet_address)) {
        res.status(400).json({
          success: false,
          error: 'Invalid wallet address',
        });
        return;
      }

      // Register user
      const user = await authService.register(
        wallet_address,
        full_name,
        username,
        business_name,
        business_type
      );

      // Generate JWT token
      const token = authService.generateToken(user);

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            wallet_address: user.wallet_address,
            full_name: user.full_name,
            username: user.username,
            business_name: user.business_name,
            business_type: user.business_type,
          },
        },
        message: 'Registration successful',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message.includes('already registered') || error.message.includes('already taken')) {
        res.status(409).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Registration failed',
      });
    }
  }

  /**
   * Check if username is available
   * GET /api/v1/auth/username/check?username=johndoe
   */
  async checkUsername(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.query;

      if (!username || typeof username !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Username is required',
        });
        return;
      }

      const isAvailable = await authService.isUsernameAvailable(username);

      res.status(200).json({
        success: true,
        data: {
          username,
          available: isAvailable,
        },
      });
    } catch (error) {
      console.error('Check username error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check username',
      });
    }
  }


  /**
   * Check if username is available
   * GET /api/v1/auth/username/check?username=johndoe
   */
  async checkWalletAddress(req: Request, res: Response): Promise<void> {
    try {
      const { wallet_address } = req.body;

      if (!wallet_address || typeof wallet_address !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Wallet address is required',
        });
        return;
      }

      const isAvailable = await authService.getUserByWallet(wallet_address);

      if(!isAvailable) {
        res.status(400).json({
          success: false,
          error: 'User not found.',
        });
        return;
      }

      res.status(200).json({
        success: true
      });
    } catch (error) {
      console.error('Check username error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check username',
      });
    }
  }

  /**
   * Get current user info
   * GET /api/v1/auth/me
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.user?.wallet_address;

      if (!walletAddress) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const user = await authService.getUserByWallet(walletAddress);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            wallet_address: user.wallet_address,
            full_name: user.full_name,
            username: user.username,
            business_name: user.business_name,
            business_type: user.business_type,
            created_at: user.created_at,
          },
        },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user info',
      });
    }
  }

  /**
   * Get current user info
   * GET /api/v1/auth/me
   */
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;

      if(!username) {
        res.status(400).json({
          success: false,
          error: 'User name is required',
        });
        return;
      }

      const user = await authService.getUserByUsername(username);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            wallet_address: user.wallet_address,
            full_name: user.full_name,
            username: user.username
          },
        },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user info',
      });
    }
  }
}

export default new AuthController();