"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getBaseAccountProvider,
  type BaseAccountProvider,
} from "@/lib/base-account";
import { requestSpendPermission } from "@base-org/account/spend-permission";
import { parseUnits, encodeFunctionData } from "viem";

interface BaseAccountContextType {
  provider: BaseAccountProvider | null;
  isConnected: boolean;
  universalAddress: string | null;
  subAccountAddress: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  createSubAccount: () => Promise<string | null>;
  getSubAccounts: () => Promise<any[]>;
  sendUsdcTransaction: (params: {
    to: string;
    amount: string;
  }) => Promise<string>;
  getCallsStatus: (callsId: string) => Promise<any>;
  requestSpendPermission: (amount: string) => Promise<void>;
  getSpendPermission: () => Promise<boolean>;
  sendTransaction: (params: {
    to: string;
    value?: string;
    data?: string;
    from?: string;
  }) => Promise<string>;
}

const BaseAccountContext = createContext<BaseAccountContextType | undefined>(
  undefined,
);

export function BaseAccountProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BaseAccountProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [universalAddress, setUniversalAddress] = useState<string | null>(null);
  const [subAccountAddress, setSubAccountAddress] = useState<string | null>(
    null,
  );
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Initialize the provider only on client side
    setIsMounted(true);
    const baseProvider = getBaseAccountProvider();
    setProvider(baseProvider);
  }, []);

  const ERC20_ABI = [
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
  ] as const;

  const getUsdcBalance = async (address: string): Promise<string> => {
    if (!provider) return "0";

    const chainId = await provider.request({ method: "eth_chainId" });

    const usdcContractAddress =
      chainId === "0x2105" // Base Mainnet
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia

    const data = `0x70a08231${address.substring(2).padStart(64, "0")}`;

    const balance = await provider.request({
      method: "eth_call",
      params: [{ to: usdcContractAddress, data }, "latest"],
    });

    return balance as string;
  };

  const [hasSpendPermission, setHasSpendPermission] = useState(false);
  const serverWalletAddress = "0xdE4Bd03D84F4aFEce434093A334E56dc14CEd147"; // TODO: Replace with actual server wallet address

  const getSpendPermission = async (): Promise<boolean> => {
    if (!provider || !universalAddress) return false;

    try {
      const permissions = await provider.request({
        method: "wallet_getPermissions",
      });

      const hasPermission = permissions.some(
        (permission: any) =>
          permission.parentAccount === universalAddress &&
          permission.permissions.some(
            (p: any) => p.target === serverWalletAddress,
          ),
      );

      setHasSpendPermission(hasPermission);

      return hasPermission;
    } catch (error) {
      console.error("Failed to get spend permissions:", error);
      return false;
    }
  };

  const requestSpendPermission = async (amount: string) => {
    if (!provider || !universalAddress) {
      throw new Error("Provider not available or not connected");
    }

    const chainId = await provider.request({ method: "eth_chainId" });
    const usdcContractAddress =
      chainId === "0x2105" // Base Mainnet
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia

    try {
      await provider.request({
        method: "wallet_requestPermissions",
        params: [
          {
            erc20: {
              required: true,
              permissions: [
                {
                  target: serverWalletAddress,
                  amount: parseUnits(amount, 6).toString(),
                  token: usdcContractAddress,
                },
              ],
            },
          },
        ],
      });
      setHasSpendPermission(true);
    } catch (error) {
      console.error("Failed to request spend permissions:", error);
      throw new Error("Failed to request spend permissions");
    }
  };

  const connect = async () => {
    if (!isMounted || !provider) {
      setError("Provider not initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Connect to the wallet and get accounts
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
        params: [],
      })) as string[];

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setUniversalAddress(accounts[1]);
        setIsConnected(true);

        // Fetch balance
        const usdcBalance = await getUsdcBalance(address);
        setBalance(usdcBalance);

        // Check for existing sub account
        const response = (await provider.request({
          method: "wallet_getSubAccounts",
          params: [
            {
              account: accounts[0],
              domain: window.location.origin,
            },
          ],
        })) as { subAccounts: any[] };

        const existingSubAccount = response.subAccounts?.[0];
        if (existingSubAccount) {
          setSubAccountAddress(existingSubAccount.address);
        }

        await getSpendPermission();
      }
    } catch (err) {
      console.error("Connection failed:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setUniversalAddress(null);
    setSubAccountAddress(null);
    setBalance(null);
    setIsConnected(false);
    setError(null);
  };

  const createSubAccount = async (): Promise<string | null> => {
    if (!provider || !universalAddress) {
      setError("Not connected or provider not available");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newSubAccount = (await provider.request({
        method: "wallet_addSubAccount",
        params: [
          {
            account: {
              type: "create",
            },
          },
        ],
      })) as { address: string };

      setSubAccountAddress(newSubAccount.address);
      return newSubAccount.address;
    } catch (err) {
      console.error("Sub account creation failed:", err);
      setError(
        err instanceof Error ? err.message : "Sub account creation failed",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSubAccounts = async (): Promise<any[]> => {
    if (!provider || !universalAddress) {
      return [];
    }

    try {
      const response = (await provider.request({
        method: "wallet_getSubAccounts",
        params: [
          {
            account: universalAddress,
            domain: window.location.origin,
          },
        ],
      })) as { subAccounts: any[] };

      return response.subAccounts || [];
    } catch (err) {
      console.error("Failed to get sub accounts:", err);
      return [];
    }
  };

  const getCallsStatus = async (callsId: string): Promise<any> => {
    if (!provider) {
      throw new Error("Provider not available");
    }

    try {
      const status = await provider.request({
        method: "wallet_getCallsStatus",
        params: [callsId],
      });

      return status;
    } catch (err) {
      console.error("Failed to get calls status:", err);
      throw err instanceof Error
        ? err
        : new Error("Failed to get calls status");
    }
  };

  const sendTransaction = async (params: {
    to: string;
    value?: string;
    data?: string;
    from?: string;
  }): Promise<string> => {
    if (!provider) {
      throw new Error("Provider not available");
    }

    const fromAddress = params.from || subAccountAddress || universalAddress;
    console.log("From Address:", fromAddress);
    if (!fromAddress) {
      throw new Error("No address available for sending transaction");
    }

    const chainId = await provider.request({ method: "eth_chainId" });

    try {
      const callsId = (await provider.request({
        method: "wallet_sendCalls",
        params: [
          {
            version: "2.0.0",
            atomicRequired: true,
            from: fromAddress,
            chainId: chainId,
            calls: [
              {
                to: params.to,
                data: params.data || "0x",
                value: params.value || "0x0",
              },
            ],
            capabilities: {
              // Add paymaster URL here if you have one
              // paymasterUrl: 'your-paymaster-url',
            },
          },
        ],
      })) as string;

      return callsId;
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err instanceof Error ? err : new Error("Transaction failed");
    }
  };

  const sendUsdcTransaction2 = async (params: {
    to: string;
    amount: string;
  }): Promise<string> => {
    if (!provider) {
      throw new Error("Provider not available");
    }

    const fromAddress = subAccountAddress || universalAddress;
    if (!fromAddress) {
      throw new Error("No address available for sending transaction");
    }

    const chainId = await provider.request({ method: "eth_chainId" });
    console.log("Chain ID:", chainId);
    const usdcContractAddress =
      chainId === "0x2105" // Base Mainnet
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia

    console.log("USDC Contract Address:", usdcContractAddress);
    console.log("From Address:", fromAddress);

    const parts = params.amount.split(".");
    const integerPart = parts[0];
    const fractionalPart =
      parts.length > 1 ? parts[1].padEnd(6, "0") : "000000";
    const amountInSmallestUnit = BigInt(integerPart + fractionalPart);

    const data = `0xa9059cbb${params.to.substring(2).padStart(64, "0")}${amountInSmallestUnit.toString(16).padStart(64, "0")}`;

    try {
      const callsId = (await provider.request({
        method: "wallet_sendCalls",
        params: [
          {
            version: "2.0",
            atomicRequired: true,
            from: fromAddress,
            chainId: chainId,
            calls: [
              {
                to: usdcContractAddress,
                data: data,
                value: "0x0",
              },
            ],
          },
        ],
      })) as string;

      return callsId;
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err instanceof Error ? err : new Error("Transaction failed");
    }
  };

  const sendUsdcTransaction = async (params: {
    to: string;
    amount: string;
  }): Promise<string> => {
    if (!provider) {
      throw new Error("Provider not available");
    }

    const fromAddress = subAccountAddress || universalAddress;
    if (!fromAddress) {
      throw new Error("No address available for sending transaction");
    }

    const chainId = await provider.request({ method: "eth_chainId" });

    const usdcContractAddress =
      chainId === "0x2105"
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

    try {
      // Parse amount (USDC has 6 decimals)
      const amountInUnits = parseUnits(params.amount, 6);

      // Encode the transfer function call
      const data: any = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [params.to as `0x${string}`, amountInUnits],
      });

      const reqparams = {
        version: "2.0",
        atomicRequired: true,
        chainId: chainId,
        from: fromAddress,
        calls: [
          {
            to: usdcContractAddress,
            data: data,
            value: "0x0",
          },
        ],
      };

      console.log("wallet_sendCalls params:", params, reqparams);

      const callsId = (await provider.request({
        method: "wallet_sendCalls",
        params: [reqparams],
      })) as string;

      console.log("Transaction sent! Calls ID:", callsId);
      return callsId;
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err instanceof Error ? err : new Error("Transaction failed");
    }
  };

  const value: BaseAccountContextType = {
    provider,
    isConnected,
    universalAddress,
    subAccountAddress,
    balance,
    isLoading,
    error,
    connect,
    disconnect,
    createSubAccount,
    getSubAccounts,
    sendUsdcTransaction,
    getCallsStatus,
    requestSpendPermission,
    getSpendPermission,
    sendTransaction
  };

  return (
    <BaseAccountContext.Provider value={value}>
      {children}
    </BaseAccountContext.Provider>
  );
}

export function useBaseAccount() {
  const context = useContext(BaseAccountContext);
  if (context === undefined) {
    throw new Error("useBaseAccount must be used within a BaseAccountProvider");
  }
  return context;
}
