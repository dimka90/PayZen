"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wallet, 
  Plus, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Loader2,
  ArrowRight,
  Shield
} from "lucide-react"
import { useBaseAccount } from "@/components/providers/base-account-provider"
import { toast } from "sonner"

export function BaseAccountDemo() {
  const baseAccount = useBaseAccount()
  const [isCreatingSubAccount, setIsCreatingSubAccount] = useState(false)

  const handleConnect = async () => {
    try {
      await baseAccount.connect()
      toast.success("Base Account connected successfully!")
    } catch (error) {
      toast.error("Failed to connect Base Account")
    }
  }

  const handleCreateSubAccount = async () => {
    setIsCreatingSubAccount(true)
    try {
      const address = await baseAccount.createSubAccount()
      if (address) {
        toast.success("Sub Account created successfully!")
      }
    } catch (error) {
      toast.error("Failed to create Sub Account")
    } finally {
      setIsCreatingSubAccount(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  if (!baseAccount.isConnected) {
    return (
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-teal-400" />
            <span>Base Account Integration</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Connect your Base Account to start using Sub Accounts and Spend Permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <h3 className="text-white font-medium mb-2">Features Available:</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Automatic Sub Account creation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Spend Permissions for frictionless payments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Gas sponsorship support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Base blockchain integration</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={handleConnect}
              disabled={baseAccount.isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              size="lg"
            >
              {baseAccount.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Base Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span>Base Account Connected</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your Base Account is connected and ready to use Sub Accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Universal Account */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">Universal Account</h3>
              <Badge className="bg-teal-600/20 text-teal-400 border-teal-600/30">
                Main Account
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <code className="text-sm text-slate-300 bg-slate-900 px-2 py-1 rounded">
                {baseAccount.universalAddress}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(baseAccount.universalAddress!, "Universal address")}
                className="text-slate-400 hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sub Account */}
          {baseAccount.subAccountAddress ? (
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">Sub Account</h3>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                  Active
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <code className="text-sm text-slate-300 bg-slate-900 px-2 py-1 rounded">
                  {baseAccount.subAccountAddress}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(baseAccount.subAccountAddress!, "Sub account address")}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">Sub Account</h3>
                <Badge className="bg-slate-600/20 text-slate-400 border-slate-600/30">
                  Not Created
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mb-3">
                Create a Sub Account for frictionless payments and better organization
              </p>
              <Button
                onClick={handleCreateSubAccount}
                disabled={isCreatingSubAccount}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCreatingSubAccount ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Sub Account
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Features */}
          <div className="p-4 rounded-lg bg-green-600/10 border border-green-600/30">
            <h3 className="text-green-200 font-medium mb-2 flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Available Features</span>
            </h3>
            <ul className="text-sm text-green-300/80 space-y-1">
              <li>• Send payments from Sub Accounts</li>
              <li>• Automatic Spend Permissions</li>
              <li>• Gas sponsorship support</li>
              <li>• Multiple account management</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => window.open("/dashboard/send", "_blank")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
              size="sm"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Send Payment
            </Button>
            <Button
              onClick={() => window.open("/dashboard/sub-accounts", "_blank")}
              variant="outline"
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white"
              size="sm"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Manage Accounts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
