# Base Account SDK Integration

This document describes the Base Account SDK integration with Sub Accounts and Auto Spend Permissions in the PayZen platform.

## Overview

The PayZen platform now integrates with the Base Account SDK to provide:
- **Sub Accounts**: App-specific wallet accounts for users
- **Auto Spend Permissions**: Frictionless transactions without repeated signing
- **Gas Sponsorship**: Optional paymaster support for better UX

## Implementation

### 1. Base Account SDK Configuration

The SDK is configured in `lib/base-account.ts`:

```typescript
export const baseAccountConfig = {
  appName: 'PayZen',
  appLogoUrl: '/placeholder-logo.png',
  appChainIds: [base.id, baseSepolia.id],
  subAccounts: {
    creation: 'on-connect', // Auto-create sub account on connection
    defaultAccount: 'sub',  // Use sub account as default
  },
}
```

### 2. Provider Integration

The `BaseAccountProvider` in `components/providers/base-account-provider.tsx` provides:
- Wallet connection management
- Sub Account creation and retrieval
- Transaction sending with proper account selection
- Error handling and loading states

### 3. Key Features Implemented

#### Sub Account Management
- **Automatic Creation**: Sub accounts are created automatically when users connect
- **Account Switching**: Users can choose which account to send from
- **Visual Management**: Clean UI for managing multiple accounts

#### Spend Permissions
- **Permission Granting**: Allow sub accounts to spend from universal account
- **Automatic Requests**: Permissions are requested as needed
- **Visual Management**: Dashboard for viewing and managing permissions

#### Payment Flows
- **Account Selection**: Choose between universal and sub accounts
- **Frictionless Payments**: Sub accounts can send without user signatures
- **Transaction Tracking**: Proper transaction hash tracking

### 4. UI Components

#### Dashboard Integration
- `BaseAccountDemo`: Shows connection status and account information
- `SpendPermissions`: Component for managing spend permissions
- Updated payment flows with account selection

#### Authentication Pages
- Updated login/signup pages to use Base Account connection
- Proper loading states and error handling
- Toast notifications for user feedback

### 5. File Structure

```
├── lib/
│   └── base-account.ts                    # SDK configuration
├── components/
│   ├── providers/
│   │   ├── base-account-provider.tsx      # Base Account context
│   │   └── wallet-provider.tsx            # Updated wallet provider
│   ├── base-account-demo.tsx              # Demo component
│   └── spend-permissions.tsx              # Spend permissions management
├── app/
│   ├── dashboard/
│   │   ├── sub-accounts/page.tsx          # Sub account management
│   │   ├── spend-permissions/page.tsx     # Spend permissions page
│   │   ├── send/page.tsx                  # Updated payment flow
│   │   └── page.tsx                       # Dashboard with demo
│   └── auth/
│       ├── login/page.tsx                 # Updated login
│       └── signup/page.tsx                # Updated signup
```

## Usage

### Connecting Base Account

```typescript
import { useBaseAccount } from '@/components/providers/base-account-provider'

function MyComponent() {
  const baseAccount = useBaseAccount()
  
  const handleConnect = async () => {
    await baseAccount.connect()
    // Sub account is automatically created
  }
}
```

### Creating Sub Accounts

```typescript
const handleCreateSubAccount = async () => {
  const address = await baseAccount.createSubAccount()
  console.log('New sub account:', address)
}
```

### Sending Transactions

```typescript
const handleSendPayment = async () => {
  const txHash = await baseAccount.sendTransaction({
    to: recipientAddress,
    value: amount,
    from: subAccountAddress, // Optional, defaults to sub account
  })
}
```

### Managing Spend Permissions

```typescript
// Spend permissions are automatically requested when needed
// Manual management available in the dashboard
```

## Configuration

### Environment Variables

No additional environment variables are required for basic functionality. For production:

- Add paymaster URLs for gas sponsorship
- Configure app metadata (name, logo, etc.)
- Set up proper chain IDs for your environment

### Customization

The integration can be customized by:
- Modifying the SDK configuration in `lib/base-account.ts`
- Updating the provider logic in `base-account-provider.tsx`
- Customizing UI components as needed

## Benefits

1. **Frictionless Payments**: Sub accounts enable payments without repeated signing
2. **Better Organization**: Separate accounts for different purposes
3. **Auto Spend Permissions**: Seamless transaction flow
4. **Gas Optimization**: Optional paymaster support
5. **User Control**: Users manage all accounts at account.base.app

## Next Steps

1. **Production Setup**: Configure paymaster URLs for gas sponsorship
2. **Backend Integration**: Connect with your payment processing backend
3. **Analytics**: Add transaction tracking and analytics
4. **Advanced Features**: Implement batch transactions and advanced spend permissions

## Resources

- [Base Account SDK Documentation](https://docs.base.org/base-account/improve-ux/sub-accounts)
- [Spend Permissions Guide](https://docs.base.org/base-account/improve-ux/spend-permissions)
- [Base Chain Documentation](https://docs.base.org)
