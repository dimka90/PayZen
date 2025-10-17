"use client";

import type React from "react";
import { Toaster } from "sonner";
import { BaseAccountProvider } from "@/components/providers/base-account-provider";
import { WalletProvider } from "@/components/providers/wallet-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BaseAccountProvider>
      <WalletProvider>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "rgb(15 23 42)",
              border: "1px solid rgb(51 65 85)",
              color: "white",
            },
          }}
        />
      </WalletProvider>
    </BaseAccountProvider>
  );
}
