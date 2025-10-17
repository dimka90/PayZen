"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useBaseAccount } from "./base-account-provider"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const baseAccount = useBaseAccount()

  const connect = async () => {
    try {
      await baseAccount.connect()
      // Use sub account address if available, otherwise universal address
      const activeAddress = baseAccount.subAccountAddress || baseAccount.universalAddress
      setAddress(activeAddress)
      setIsConnected(baseAccount.isConnected)
    } catch (error) {
      console.error("[v0] Wallet connection failed:", error)
      throw error
    }
  }

  const disconnect = () => {
    baseAccount.disconnect()
    setAddress(null)
    setIsConnected(false)
  }

  // Sync with Base Account state
  useState(() => {
    if (baseAccount.isConnected) {
      const activeAddress = baseAccount.subAccountAddress || baseAccount.universalAddress
      setAddress(activeAddress)
      setIsConnected(true)
    } else {
      setAddress(null)
      setIsConnected(false)
    }
  })

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
