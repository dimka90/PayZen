"use client"

export const dynamic = 'force-dynamic'

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useBaseAccount } from "@/components/providers/base-account-provider"
import { toast } from "sonner"

type SendStep = "form" | "confirm" | "success"

export default function SendPaymentPage() {
  const router = useRouter()
  const baseAccount = useBaseAccount()
  const [step, setStep] = useState<SendStep>("form")
  const [isProcessing, setIsProcessing] = useState(false)

  // Form state
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [fromAccount, setFromAccount] = useState<string>("")
  const [transactionHash, setTransactionHash] = useState<string>("")

  // Available accounts for sending
  const availableAccounts = [
    {
      id: "sub",
      name: "Sub Account",
      address: baseAccount.subAccountAddress,
      description: "Recommended for payments",
    },
    {
      id: "universal",
      name: "Universal Account",
      address: baseAccount.universalAddress,
      description: "Main account",
    },
  ].filter(acc => acc.address)

  // Set default account
  useState(() => {
    if (availableAccounts.length > 0) {
      setFromAccount(availableAccounts[0].id)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("confirm")
  }

  const handleConfirm = async () => {
    if (!baseAccount.isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsProcessing(true)
    
    try {
      const selectedAccount = availableAccounts.find(acc => acc.id === fromAccount)
      if (!selectedAccount) {
        throw new Error("No account selected")
      }

      // For demo purposes, we'll simulate a transaction
      // In a real implementation, you would:
      // 1. Validate the recipient address
      // 2. Check if the sender has sufficient balance
      // 3. Call the Base Account SDK to send the transaction
      
      const mockTxHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`
      setTransactionHash(mockTxHash)
      
      // Simulate blockchain transaction time
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      toast.success("Payment sent successfully!")
      setStep("success")
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error(error instanceof Error ? error.message : "Payment failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNewPayment = () => {
    setRecipient("")
    setAmount("")
    setNote("")
    setTransactionHash("")
    setStep("form")
  }

  if (step === "success") {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="glass-card border-slate-700/50 max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 rounded-full bg-green-600/20 border border-green-600/30">
                <CheckCircle2 className="h-16 w-16 text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Payment Sent!</h2>
                <p className="text-slate-400">Your payment has been successfully processed</p>
              </div>
              <div className="w-full space-y-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Recipient</span>
                  <span className="text-white font-mono">{recipient}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-white font-bold">${amount} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="text-white font-mono text-xs">{transactionHash}</span>
                </div>
              </div>
              <div className="w-full space-y-2">
                <Button onClick={handleNewPayment} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Send Another Payment
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="w-full bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "confirm") {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setStep("form")
          }}
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to form
        </Link>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="font-sans text-3xl font-bold text-white">Confirm Payment</h1>
            <p className="text-slate-400">Review the details before sending</p>
          </div>

          <Card className="glass-card border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Payment Details</CardTitle>
              <CardDescription className="text-slate-400">Please verify all information is correct</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Recipient</p>
                  <p className="text-white font-mono">{recipient}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-white">${amount}</p>
                  <p className="text-sm text-slate-400 mt-1">USDC on Base</p>
                </div>
                {note && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Note</p>
                    <p className="text-white">{note}</p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-amber-600/10 border border-amber-600/30 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-200">
                  <p className="font-medium mb-1">Important</p>
                  <p className="text-amber-300/80">
                    This transaction cannot be reversed. Please verify the recipient address is correct.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("form")}
                  variant="outline"
                  className="flex-1 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white border-0"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm & Send"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="font-sans text-3xl font-bold text-white">Send Payment</h1>
          <p className="text-slate-400">Send USDC to any wallet address or username</p>
        </div>

        <Card className="glass-card border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Payment Information</CardTitle>
            <CardDescription className="text-slate-400">Enter the recipient and amount details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* From Account Selector */}
              <div className="space-y-2">
                <Label htmlFor="fromAccount" className="text-slate-300">
                  Send From
                </Label>
                <Select value={fromAccount} onValueChange={setFromAccount}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {availableAccounts.map((account) => (
                      <SelectItem 
                        key={account.id} 
                        value={account.id}
                        className="text-white hover:bg-slate-800 focus:bg-slate-800"
                      >
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-xs text-slate-400">{account.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-slate-300">
                  Recipient
                </Label>
                <Input
                  id="recipient"
                  placeholder="@username or 0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-500">Enter a PayZen username or wallet address</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-slate-300">
                  Amount (USDC)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pl-7"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Available balance: $1,234.56</span>
                  <button
                    type="button"
                    onClick={() => setAmount("1234.56")}
                    className="text-teal-400 hover:text-teal-300"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-slate-300">
                  Note (Optional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="Add a note for this payment..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
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
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white border-0"
                  size="lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Continue
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Quick Send */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["@alice", "@bob", "@charlie"].map((user) => (
                <button
                  key={user}
                  onClick={() => setRecipient(user)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white font-medium">
                      {user.charAt(1).toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{user}</span>
                  </div>
                  <Send className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
