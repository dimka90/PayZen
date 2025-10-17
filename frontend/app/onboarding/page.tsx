"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Building2, User, Wallet, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"

type OnboardingStep = "profile" | "business" | "wallet" | "complete"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("profile")
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [profile, setProfile] = useState({ name: "", username: "" })
  const [business, setBusiness] = useState({ name: "", type: "" })

  const steps: OnboardingStep[] = ["profile", "business", "wallet", "complete"]
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
    setIsLoading(false)
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    console.log("[v0] Onboarding complete", { profile, business })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/dashboard")
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-sans text-3xl font-bold text-white">Welcome to PayZen</h1>
          <p className="text-slate-400 font-mono text-sm">Let's set up your account</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2 bg-slate-800" />
          <div className="flex justify-between text-xs text-slate-400">
            <span>
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        {/* Onboarding Card */}
        <Card className="glass-card border-slate-700/50">
          {currentStep === "profile" && (
            <>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-teal-600/20 border border-teal-600/30">
                    <User className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                    <CardDescription className="text-slate-400">Tell us about yourself</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-500">
                    This will be your payment link: payzen.app/@{profile.username || "username"}
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === "business" && (
            <>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-teal-600/20 border border-teal-600/30">
                    <Building2 className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Business Details</CardTitle>
                    <CardDescription className="text-slate-400">Optional - helps us serve you better</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-slate-300">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Acme Inc."
                    value={business.name}
                    onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-slate-300">
                    Business Type
                  </Label>
                  <Input
                    id="businessType"
                    placeholder="E-commerce, SaaS, Freelance, etc."
                    value={business.type}
                    onChange={(e) => setBusiness({ ...business, type: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === "wallet" && (
            <>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-teal-600/20 border border-teal-600/30">
                    <Wallet className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Setup Wallet</CardTitle>
                    <CardDescription className="text-slate-400">
                      Create your embedded wallet for receiving payments
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Secure & Non-Custodial</p>
                      <p className="text-sm text-slate-400">You control your private keys</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Base Network</p>
                      <p className="text-sm text-slate-400">Low fees, fast transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Sub Accounts Ready</p>
                      <p className="text-sm text-slate-400">Organize payments with multiple accounts</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white border-0"
                  size="lg"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Create Wallet
                </Button>
              </CardContent>
            </>
          )}

          {currentStep === "complete" && (
            <>
              <CardHeader>
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className="p-4 rounded-full bg-green-600/20 border border-green-600/30">
                    <CheckCircle2 className="h-12 w-12 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-2xl">You're all set!</CardTitle>
                    <CardDescription className="text-slate-400 mt-2">
                      Your PayZen account is ready to use
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-slate-400">Your payment link</p>
                    <p className="text-white font-mono">payzen.app/@{profile.username}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-slate-400">Wallet address</p>
                    <p className="text-white font-mono text-sm">0x1234...5678</p>
                  </div>
                </div>
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white border-0"
                  size="lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          {currentStep !== "complete" && (
            <div className="flex justify-between p-6 border-t border-slate-700/50">
              <Button
                onClick={handleBack}
                disabled={currentStepIndex === 0 || isLoading}
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {currentStep !== "wallet" && (
                <Button onClick={handleNext} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
