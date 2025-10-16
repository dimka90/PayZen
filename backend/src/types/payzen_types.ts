// Type Definitions for PayZen Backend

export interface User {
  id: string;
  wallet_address: string;
  full_name: string;
  username: string;
  business_name?: string;
  business_type?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: string;
  from_wallet: string;
  to_wallet: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  tx_hash?: string;
  note?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentLink {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  amount?: string;
  flexible_amount: boolean;
  link_code: string;
  times_used: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthNonce {
  id: string;
  wallet_address: string;
  nonce: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

// Request/Response Types
export interface AuthRequest {
  wallet_address: string;
  signature: string;
  message: string;
}

export interface RegisterRequest {
  wallet_address: string;
  full_name: string;
  username: string;
  business_name?: string;
  business_type?: string;
}

export interface SendPaymentRequest {
  recipient: string; // username or wallet address
  amount: string;
  note?: string;
}

export interface CreatePaymentLinkRequest {
  title: string;
  description?: string;
  amount?: string;
  flexible_amount: boolean;
}

export interface JWTPayload {
  wallet_address: string;
  user_id: string;
  iat?: number;
  exp?: number;
}

export interface DashboardStats {
  total_balance: string;
  monthly_volume: string;
  monthly_change: number;
  received_count: number;
  received_amount: string;
  sent_count: number;
  sent_amount: string;
}

// Express Request with User
export interface AuthenticatedRequest extends Express.Request {
  user?: JWTPayload;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Blockchain types
export interface USDCBalance {
  balance: string;
  formatted: string;
}