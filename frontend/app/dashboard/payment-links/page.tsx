"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Link2, Copy, QrCode, ExternalLink, MoreVertical, Trash2, Edit, DollarSign } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

interface PaymentLink {
  id: string
  title: string
  description?: string
  amount?: number
  isFlexible: boolean
  url: string
  qrCode: string
  clicks: number
  payments: number
  totalReceived: number
  isActive: boolean
  createdAt: string
}

const initialLinks: PaymentLink[] = [
  {
    id: "1",
    title: "Freelance Services",
    description: "Payment for web development services",
    amount: 500,
    isFlexible: false,
    url: "payzen.app/pay/freelance-services",
    qrCode: "/qr-code-for-payment-link.jpg",
    clicks: 45,
    payments: 12,
    totalReceived: 6000,
    isActive: true,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Coffee Donation",
    description: "Buy me a coffee",
    isFlexible: true,
    url: "payzen.app/pay/coffee",
    qrCode: "/qr-code-for-donation.jpg",
    clicks: 128,
    payments: 34,
    totalReceived: 340,
    isActive: true,
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    title: "Product Purchase",
    description: "Digital product payment",
    amount: 99.99,
    isFlexible: false,
    url: "payzen.app/pay/product-xyz",
    qrCode: "/qr-code-for-product.jpg",
    clicks: 89,
    payments: 23,
    totalReceived: 2299.77,
    isActive: true,
    createdAt: "2024-01-08",
  },
]

export default function PaymentLinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>(initialLinks)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null)
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [isFlexible, setIsFlexible] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateLink = async () => {
    if (!title.trim()) return

    setIsCreating(true)
    console.log("[v0] Creating payment link:", { title, description, amount, isFlexible })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const slug = title.toLowerCase().replace(/\s+/g, "-")
    const newLink: PaymentLink = {
      id: Date.now().toString(),
      title,
      description,
      amount: isFlexible ? undefined : Number.parseFloat(amount),
      isFlexible,
      url: `payzen.app/pay/${slug}`,
      qrCode: "/qr-code-for-new-payment-link.jpg",
      clicks: 0,
      payments: 0,
      totalReceived: 0,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setLinks([newLink, ...links])
    setTitle("")
    setDescription("")
    setAmount("")
    setIsFlexible(false)
    setIsCreateDialogOpen(false)
    setIsCreating(false)
  }

  const handleDeleteLink = (id: string) => {
    console.log("[v0] Deleting payment link:", id)
    setLinks(links.filter((link) => link.id !== id))
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`)
    console.log("[v0] Link copied:", url)
  }

  const totalReceived = links.reduce((sum, link) => sum + link.totalReceived, 0)
  const totalPayments = links.reduce((sum, link) => sum + link.payments, 0)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-sans text-3xl font-bold text-white">Payment Links</h1>
          <p className="text-slate-400">Create and manage shareable payment links</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white border-0">
              <Plus className="mr-2 h-4 w-4" />
              Create Link
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Create Payment Link</DialogTitle>
              <DialogDescription className="text-slate-400">
                Generate a shareable link to receive payments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Freelance Services"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="What is this payment for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="space-y-0.5">
                  <Label htmlFor="flexible" className="text-slate-300">
                    Flexible Amount
                  </Label>
                  <p className="text-xs text-slate-500">Let payers choose the amount</p>
                </div>
                <Switch
                  id="flexible"
                  checked={isFlexible}
                  onCheckedChange={setIsFlexible}
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>
              {!isFlexible && (
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
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pl-7"
                    />
                  </div>
                </div>
              )}
              <Button
                onClick={handleCreateLink}
                disabled={isCreating || !title.trim() || (!isFlexible && !amount)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isCreating ? "Creating..." : "Create Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Links</CardTitle>
            <Link2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{links.length}</div>
            <p className="text-xs text-slate-400 mt-1">{links.filter((l) => l.isActive).length} active</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPayments}</div>
            <p className="text-xs text-slate-400 mt-1">Across all links</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Received</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalReceived.toFixed(2)}</div>
            <p className="text-xs text-slate-400 mt-1">USDC</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Links Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Card
            key={link.id}
            className="glass-card border-slate-700/50 group hover:border-slate-600/50 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{link.title}</CardTitle>
                  {link.description && (
                    <CardDescription className="text-slate-400 text-sm mt-1">{link.description}</CardDescription>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border-slate-700">
                    <DropdownMenuItem className="text-white hover:bg-slate-800 focus:bg-slate-800">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyLink(link.url)}
                      className="text-white hover:bg-slate-800 focus:bg-slate-800"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedLink(link)
                        setIsQRDialogOpen(true)
                      }}
                      className="text-white hover:bg-slate-800 focus:bg-slate-800"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      View QR Code
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-400 hover:bg-slate-800 focus:bg-slate-800"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount */}
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Amount</p>
                <p className="text-xl font-bold text-white">
                  {link.isFlexible ? "Flexible" : `$${link.amount?.toFixed(2)}`}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-800/30">
                  <p className="text-xs text-slate-400">Clicks</p>
                  <p className="text-sm font-bold text-white">{link.clicks}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/30">
                  <p className="text-xs text-slate-400">Payments</p>
                  <p className="text-sm font-bold text-white">{link.payments}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/30">
                  <p className="text-xs text-slate-400">Received</p>
                  <p className="text-sm font-bold text-green-400">${link.totalReceived.toFixed(0)}</p>
                </div>
              </div>

              {/* URL */}
              <div className="p-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <p className="text-xs text-slate-500 font-mono truncate">{link.url}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => handleCopyLink(link.url)}
                  className="bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-600/30"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.open(`https://${link.url}`, "_blank")}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedLink?.title}</DialogTitle>
            <DialogDescription className="text-slate-400">Scan this QR code to make a payment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center p-6 rounded-lg bg-white">
              <img src={selectedLink?.qrCode || "/placeholder.svg"} alt="QR Code" className="w-64 h-64" />
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Payment Link</p>
              <p className="text-white font-mono text-sm break-all">{selectedLink?.url}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  if (selectedLink) handleCopyLink(selectedLink.url)
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <QrCode className="mr-2 h-4 w-4" />
                Download QR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
