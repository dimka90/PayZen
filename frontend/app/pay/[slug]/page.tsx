"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, CheckCircle2, Wallet } from "lucide-react"
import Link from "next/link"

// Mock data - in production, this would be fetched based on the slug
const paymentLinkData = {
  "freelance-services": {
    title: "Freelance Services",
    description: "Payment for web development services",
    amount: 500,
    isFlexible: false,
    recipient: "@johndoe",
    recipientName: "John Doe",
  },
  coffee: {
    title: "Coffee Donation",
    description: "Buy me a coffee",
    isFlexible: true,
    recipient: "@johndoe",
    recipientName: "John Doe",
  },
  "product-xyz": {
    title: "Product Purchase",
    description: "Digital product payment",
    amount: 99.99,
    isFlexible: false,
    recipient: "@johndoe",
    recipientName: "John Doe",
  },
}

type PaymentStep = "form" | "processing" | "success"

export default function PaymentLinkPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const linkData = paymentLinkData[slug as keyof typeof paymentLinkData]

  const [step, setStep] = useState<PaymentStep>("form")
  const [amount, setAmount] = useState(linkData?.amount?.toString() || "")
  const [note, setNote] = useState("")
  const [senderName, setSenderName] = useState("")

  if (!linkData) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card border-slate-700/50 max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-white text-lg">Payment link not found</p>
            <Link href="/">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("processing")

    console.log("[v0] Processing payment:", { amount, note, senderName })

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setStep("success")
  }

  if (step === "success") {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card border-slate-700/50 max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 rounded-full bg-green-600/20 border border-green-600/30">
                <CheckCircle2 className="h-16 w-16 text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                <p className="text-slate-400">Your payment has been sent to {linkData.recipientName}</p>
              </div>
              <div className="w-full space-y-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-white font-bold">${amount} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Recipient</span>
                  <span className="text-white font-mono">{linkData.recipient}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="text-white font-mono text-xs">0xabcd...1234</span>
                </div>
              </div>
              <div className="w-full space-y-2">
                <Link href="/" className="block">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Create Your Own PayZen</Button>
                </Link>
                <Button
                  onClick={() => {
                    setStep("form")
                    setAmount(linkData.amount?.toString() || "")
                    setNote("")
                    setSenderName("")
                  }}
                  variant="outline"
                  className="w-full bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                >
                  Make Another Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "processing") {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card border-slate-700/50 max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-slate-700 border-t-teal-500 animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Processing Payment...</h2>
                <p className="text-slate-400">Please wait while we confirm your transaction on the blockchain</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="gradient-bg min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <Link href="/" className="font-sans text-xl font-bold text-white">
            PayZen
          </Link>
        </div>

        {/* Payment Card */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader className="text-center border-b border-slate-700/50 pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white text-2xl font-bold">
                {linkData.recipientName.charAt(0)}
              </div>
            </div>
            <CardTitle className="text-white text-2xl">{linkData.title}</CardTitle>
            {linkData.description && (
              <CardDescription className="text-slate-400 mt-2">{linkData.description}</CardDescription>
            )}
            <div className="mt-4">
              <p className="text-sm text-slate-400">Payment to</p>
              <p className="text-white font-medium">{linkData.recipientName}</p>
              <p className="text-slate-500 font-mono text-sm">{linkData.recipient}</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-slate-300">
                  Amount (USDC)
                </Label>
                {linkData.isFlexible ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pl-7 text-lg"
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-3xl font-bold text-white">${linkData.amount?.toFixed(2)}</p>
                    <p className="text-sm text-slate-400 mt-1">Fixed amount</p>
                  </div>
                )}
              </div>

              {/* Sender Name */}
              <div className="space-y-2">
                <Label htmlFor="senderName" className="text-slate-300">
                  Your Name (Optional)
                </Label>
                <Input
                  id="senderName"
                  placeholder="Enter your name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-slate-300">
                  Note (Optional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="Add a message..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white border-0"
                size="lg"
              >
                <Send className="mr-2 h-5 w-5" />
                Pay ${linkData.isFlexible ? amount || "0.00" : linkData.amount?.toFixed(2)}
              </Button>

              {/* Info */}
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  Powered by PayZen. Secure USDC payments on Base blockchain. Your transaction will be confirmed
                  on-chain.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <Card className="glass-card border-slate-700/50 bg-gradient-to-br from-teal-600/10 to-green-600/10">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-white font-medium">Want to accept payments like this?</p>
                <p className="text-slate-400 text-sm">Create your own PayZen account in minutes</p>
              </div>
              <Link href="/auth/signup">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white whitespace-nowrap">
                  <Wallet className="mr-2 h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
