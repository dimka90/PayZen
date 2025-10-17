"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBaseAccount } from "@/components/providers/base-account-provider";
import { getBaseAccountProvider } from "@/lib/base-account";
import { toast } from "sonner";
import { requestSpendPermission } from "@base-org/account/spend-permission";
import { Loader2 } from "lucide-react";
import { parseUnits } from "viem";

export function SpendPermissionSetup({
  onPermissionGranted,
}: {
  onPermissionGranted: () => void;
}) {
  const { requestSpendPermission } = useBaseAccount();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGrantPermission = async () => {
    setIsLoading(true);
    try {
      await requestSpendPermission(amount);
      toast.success("Spend permission granted successfully!");
      onPermissionGranted();
    } catch (error) {
      console.error("Failed to grant spend permission:", error);
      toast.error("Failed to grant spend permission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-black">Set Spend Permission</h2>
        <p className="text-slate-600">
          Grant a spending limit to the server wallet to enable automated
          payments.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-slate-600">
            Amount (USDC)
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="bg-white border-slate-700 text-black placeholder:text-slate-500"
          />
        </div>
        {!baseAccount.isConnected ? (
          <Button
            type="button"
            onClick={baseAccount.connect}
            disabled={baseAccount.isLoading}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white border-0"
            size="lg"
          >
            {baseAccount.isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>Connect Wallet</>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleGrantPermission}
            disabled={isLoading || !amount}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isLoading ? "Granting..." : "Grant Permission"}
          </Button>
        )}
      </div>
    </div>
  );
}
