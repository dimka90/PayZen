import { base, baseSepolia } from 'viem/chains'

// Configuration for Base Account SDK
export const baseAccountConfig = {
  appName: 'PayZen',
  appLogoUrl: '/placeholder-logo.png',
  appChainIds: [base.id, baseSepolia.id],
  subAccounts: {
    creation: 'on-connect' as const,
    defaultAccount: 'sub' as const,
  },
}

// Lazy initialization - only create SDK on client side
let sdkInstance: any = null
let providerInstance: any = null

export const getBaseAccountSDK = () => {
  // Only run in browser
  if (typeof window === 'undefined') {
    return null
  }

  // Return cached instance if it exists
  if (sdkInstance) {
    return sdkInstance
  }

  // Import and create SDK only when needed
  try {
    const { createBaseAccountSDK } = require('@base-org/account')
    sdkInstance = createBaseAccountSDK(baseAccountConfig)
    return sdkInstance
  } catch (error) {
    console.error('Failed to initialize Base Account SDK:', error)
    return null
  }
}

export const getBaseAccountProvider = () => {
  // Only run in browser
  if (typeof window === 'undefined') {
    return null
  }

  // Return cached provider if it exists
  if (providerInstance) {
    return providerInstance
  }

  // Get SDK and extract provider
  const sdk = getBaseAccountSDK()
  if (sdk) {
    providerInstance = sdk.getProvider()
    return providerInstance
  }

  return null
}

// Keep these exports for backward compatibility, but they'll be null during SSR
export const baseAccountSDK = typeof window !== 'undefined' ? getBaseAccountSDK() : null
export const baseAccountProvider = typeof window !== 'undefined' ? getBaseAccountProvider() : null

// Export types
export type BaseAccountProvider = ReturnType<typeof getBaseAccountProvider>