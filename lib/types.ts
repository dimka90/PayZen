export interface SubAccount {
  id: string
  name: string
  address: string
  balance: string
  isDefault: boolean
  createdAt: Date
}

export interface Transaction {
  id: string
  type: "send" | "receive"
  amount: string
  from: string
  to: string
  memo?: string
  status: "pending" | "completed" | "failed"
  timestamp: Date
  subAccountId: string
}

export interface PaymentLink {
  id: string
  title: string
  amount: string
  description?: string
  expiresAt?: Date
  isActive: boolean
  customFields?: Record<string, string>
  createdAt: Date
  subAccountId: string
  views: number
  payments: number
}

export interface User {
  id: string
  address: string
  username?: string
  name?: string
  age?: number
  defaultSubAccountId?: string
  createdAt: Date
}
