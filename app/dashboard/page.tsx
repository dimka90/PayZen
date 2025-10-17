"use client";

export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  Send,
  Link2,
  Copy,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { BaseAccountDemo } from "@/components/base-account-demo";

const recentTransactions = [
  {
    id: 1,
    type: "received",
    from: "@alice",
    amount: 150.0,
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "sent",
    to: "@bob",
    amount: 75.5,
    time: "5 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "received",
    from: "@charlie",
    amount: 200.0,
    time: "1 day ago",
    status: "completed",
  },
  {
    id: 4,
    type: "sent",
    to: "@david",
    amount: 50.0,
    time: "2 days ago",
    status: "completed",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-sans text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-slate-500">
          Welcome back! Here's your account overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$1,802.45</div>
            <p className="text-xs text-slate-400 mt-1">USDC on Base</p>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$3,456.78</div>
            <p className="text-xs text-green-400 mt-1">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        {/* Received */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Received
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$4,123.00</div>
            <p className="text-xs text-slate-400 mt-1">23 transactions</p>
          </CardContent>
        </Card>

        {/* Sent */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Sent
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$2,666.22</div>
            <p className="text-xs text-slate-400 mt-1">15 transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-black">Quick Actions</CardTitle>
          <CardDescription className="text-slate-600">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/send">
            <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white border-0 h-auto py-4">
              <div className="flex flex-col items-center space-y-2">
                <Send className="h-6 w-6" />
                <span>Send Payment</span>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/payment-links">
            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 h-auto py-4">
              <div className="flex flex-col items-center space-y-2">
                <Link2 className="h-6 w-6" />
                <span>Create Link</span>
              </div>
            </Button>
          </Link>
          <Button
            onClick={() => {
              navigator.clipboard.writeText("payzen.app/@username");
              console.log("[v0] Payment link copied");
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 h-auto py-4"
          >
            <div className="flex flex-col items-center space-y-2">
              <Copy className="h-6 w-6" />
              <span>Copy My Link</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Base Account Integration */}
      <BaseAccountDemo />

      {/* Recent Transactions & Payment Link */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="glass-card border-slate-700/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-black">Recent Transactions</CardTitle>
              <CardDescription className="text-slate-600">
                Your latest payment activity
              </CardDescription>
            </div>
            <Link href="/dashboard/history">
              <Button
                variant="ghost"
                size="sm"
                className="text-teal-400 hover:text-teal-300"
              >
                View All
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700"
                >
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
                        {tx.type === "received"
                          ? `From ${tx.from}`
                          : `To ${tx.to}`}
                      </p>
                      <p className="text-xs text-slate-400">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${tx.type === "received" ? "text-green-400" : "text-white"}`}
                    >
                      {tx.type === "received" ? "+" : "-"}$
                      {tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400">USDC</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Link Card */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-black">Your Payment Link</CardTitle>
            <CardDescription className="text-slate-600">
              Share this link to receive payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-white font-mono text-sm break-all">
                payzen.app/@username
              </p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText("payzen.app/@username");
                  console.log("[v0] Link copied");
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                className="w-full bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Public Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
