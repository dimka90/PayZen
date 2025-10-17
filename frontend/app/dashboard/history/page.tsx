"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, ArrowDownRight, Search, Filter, ExternalLink, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: string
  type: "sent" | "received"
  counterparty: string
  amount: number
  status: "completed" | "pending" | "failed"
  timestamp: string
  txHash: string
  note?: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "received",
    counterparty: "@alice",
    amount: 150.0,
    status: "completed",
    timestamp: "2024-01-15T14:30:00Z",
    txHash: "0xabcd1234...",
    note: "Payment for services",
  },
  {
    id: "2",
    type: "sent",
    counterparty: "@bob",
    amount: 75.5,
    status: "completed",
    timestamp: "2024-01-15T10:15:00Z",
    txHash: "0xefgh5678...",
  },
  {
    id: "3",
    type: "received",
    counterparty: "@charlie",
    amount: 200.0,
    status: "completed",
    timestamp: "2024-01-14T16:45:00Z",
    txHash: "0xijkl9012...",
    note: "Invoice #1234",
  },
  {
    id: "4",
    type: "sent",
    counterparty: "@david",
    amount: 50.0,
    status: "completed",
    timestamp: "2024-01-14T09:20:00Z",
    txHash: "0xmnop3456...",
  },
  {
    id: "5",
    type: "received",
    counterparty: "@eve",
    amount: 300.0,
    status: "pending",
    timestamp: "2024-01-15T15:00:00Z",
    txHash: "0xqrst7890...",
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "sent" | "received">("all")
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || tx.type === filterType
    return matchesSearch && matchesFilter
  })

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="font-sans text-3xl font-bold text-white">Transaction History</h1>
        <p className="text-slate-400">View and manage all your payment transactions</p>
      </div>

      {/* Filters */}
      <Card className="glass-card border-slate-700/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by username or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-white hover:bg-slate-800 focus:bg-slate-800">
                  All Transactions
                </SelectItem>
                <SelectItem value="received" className="text-white hover:bg-slate-800 focus:bg-slate-800">
                  Received
                </SelectItem>
                <SelectItem value="sent" className="text-white hover:bg-slate-800 focus:bg-slate-800">
                  Sent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {filteredTransactions.length === 0 ? (
            <Card className="glass-card border-slate-700/50">
              <CardContent className="py-12 text-center">
                <p className="text-slate-400">No transactions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((tx) => (
              <Card
                key={tx.id}
                className={`glass-card border-slate-700/50 cursor-pointer transition-colors ${
                  selectedTx?.id === tx.id ? "border-teal-600/50 bg-teal-600/5" : "hover:border-slate-600/50"
                }`}
                onClick={() => setSelectedTx(tx)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          tx.type === "received"
                            ? "bg-green-600/20 border border-green-600/30"
                            : "bg-amber-600/20 border border-amber-600/30"
                        }`}
                      >
                        {tx.type === "received" ? (
                          <ArrowDownRight className="h-4 w-4 text-green-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {tx.type === "received" ? "From" : "To"} {tx.counterparty}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDate(tx.timestamp)} at {formatTime(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.type === "received" ? "text-green-400" : "text-white"}`}>
                        {tx.type === "received" ? "+" : "-"}${tx.amount.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          tx.status === "completed"
                            ? "text-green-400"
                            : tx.status === "pending"
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Transaction Details */}
        <div className="lg:col-span-1">
          <Card className="glass-card border-slate-700/50 sticky top-6">
            <CardHeader>
              <CardTitle className="text-white">Transaction Details</CardTitle>
              <CardDescription className="text-slate-400">
                {selectedTx ? "View complete transaction information" : "Select a transaction to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTx ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Type</p>
                      <p className="text-white capitalize">{selectedTx.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Amount</p>
                      <p className="text-2xl font-bold text-white">${selectedTx.amount.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">USDC</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">{selectedTx.type === "received" ? "From" : "To"}</p>
                      <p className="text-white font-mono">{selectedTx.counterparty}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Status</p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          selectedTx.status === "completed"
                            ? "bg-green-600/20 text-green-400 border border-green-600/30"
                            : selectedTx.status === "pending"
                              ? "bg-amber-600/20 text-amber-400 border border-amber-600/30"
                              : "bg-red-600/20 text-red-400 border border-red-600/30"
                        }`}
                      >
                        {selectedTx.status.charAt(0).toUpperCase() + selectedTx.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Date & Time</p>
                      <p className="text-white">
                        {formatDate(selectedTx.timestamp)} at {formatTime(selectedTx.timestamp)}
                      </p>
                    </div>
                    {selectedTx.note && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Note</p>
                        <p className="text-white">{selectedTx.note}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Transaction Hash</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-mono text-xs flex-1 truncate">{selectedTx.txHash}</p>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedTx.txHash)
                            console.log("[v0] Hash copied")
                          }}
                          className="h-8 w-8 text-slate-400 hover:text-white"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    onClick={() => window.open(`https://basescan.org/tx/${selectedTx.txHash}`, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on BaseScan
                  </Button>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-500 text-sm">No transaction selected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
