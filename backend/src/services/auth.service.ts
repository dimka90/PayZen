import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../database';
import config from '../config';
import blockchainService from './blockchain.service';
import { SignOptions } from 'jsonwebtoken';
import { JWTPayload, User } from '../types/payzen_types';

class AuthService {
  /**
   * Generate a nonce for wallet signature
   */
  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await db.query(
      `INSERT INTO auth_nonces (wallet_address, nonce, expires_at)
       VALUES ($1, $2, $3)`,
      [walletAddress.toLowerCase(), nonce, expiresAt]
    );

    return nonce;
  }

  /**
   * Verify nonce exists and is valid
   */
  async verifyNonce(walletAddress: string, nonce: string): Promise<boolean> {
    const result = await db.query(
      `SELECT * FROM auth_nonces 
       WHERE wallet_address = $1 
       AND nonce = $2 
       AND used = false 
       AND expires_at > NOW()`,
      [walletAddress.toLowerCase(), nonce]
    );

    if (result.rows.length === 0) {
      return false;
    }

    // Mark nonce as used
    await db.query(
      `UPDATE auth_nonces SET used = true WHERE wallet_address = $1 AND nonce = $2`,
      [walletAddress.toLowerCase(), nonce]
    );

    return true;
  }

  /**
   * Verify signature and authenticate user
   */
  async verifySignature(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<{ valid: boolean; user?: User }> {
    // Verify signature cryptographically
    const isValidSignature = blockchainService.verifySignature(
      message,
      signature,
      walletAddress
    );

    if (!isValidSignature) {
      return { valid: false };
    }

    // Extract nonce from message (assuming format: "Sign this message to authenticate: [nonce]")
    const nonceMatch = message.match(/Sign this message to authenticate: (.+)/);
    if (!nonceMatch) {
      return { valid: false };
    }

    const nonce = nonceMatch[1];

    // Verify nonce
    const isValidNonce = await this.verifyNonce(walletAddress, nonce);
    if (!isValidNonce) {
      return { valid: false };
    }

    // Get user from database
    const result = await db.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [walletAddress.toLowerCase()]
    );

    const user = result.rows[0] as User | undefined;

    return { valid: true, user };
  }

  /**
   * Generate JWT token
   */
  // generateToken(user: User): string {
  //   const payload: JWTPayload = {
  //     wallet_address: user.wallet_address,
  //     user_id: user.id,
  //   };

  //     const options = {
  //   expiresIn: config.jwt.expires_in,
  // };

  // return jwt.sign(payload, config.jwt.secret, options)
  // }

  // /**
  //  * Verify JWT token
  //  */
  // verifyToken(token: string): JWTPayload | null {
  //   try {
  //     const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
  //     return decoded;
  //   } catch (error) {
  //     return null;
  //   }
  // }

generateToken(user: User): string {
  if (!config.jwt.secret) {
    throw new Error('JWT secret is not configured');
  }

  const payload: JWTPayload = {
    wallet_address: user.wallet_address,
    user_id: user.id,
  };

  const options: SignOptions = {
    expiresIn: typeof config.jwt.expires_in === 'number' 
      ? config.jwt.expires_in 
      : parseInt(config.jwt.expires_in, 10) || '7d',
    algorithm: 'HS256'
  };

  return jwt.sign(payload, config.jwt.secret, options);
}



  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload | null {
    if (!config.jwt.secret) {
      throw new Error('JWT secret is not configured');
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret, {
        algorithms: ['HS256']
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }


  /**
   * Register new user
   */
  async register(
    walletAddress: string,
    fullName: string,
    username: string,
    businessName?: string,
    businessType?: string
  ): Promise<User> {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE wallet_address = $1 OR username = $2',
      [walletAddress.toLowerCase(), username.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      const existing = existingUser.rows[0];
      if (existing.wallet_address === walletAddress.toLowerCase()) {
        throw new Error('Wallet address already registered');
      }
      if (existing.username === username.toLowerCase()) {
        throw new Error('Username already taken');
      }
    }

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (wallet_address, full_name, username, business_name, business_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        walletAddress.toLowerCase(),
        fullName,
        username.toLowerCase(),
        businessName || null,
        businessType || null,
      ]
    );

    return result.rows[0] as User;
  }

  /**
   * Get user by wallet address
   */
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const result = await db.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [walletAddress.toLowerCase()]
    );

    return result.rows[0] as User | null;
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<User | null> {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    return result.rows[0] as User | null;
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    const result = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    return result.rows.length === 0;
  }

  /**
   * Clean up expired nonces (should be run periodically)
   */
  async cleanupExpiredNonces(): Promise<void> {
    await db.query('DELETE FROM auth_nonces WHERE expires_at < NOW()');
  }
}

export default new AuthService();