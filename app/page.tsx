"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wallet,
  Users,
  LinkIcon,
  BarChart3,
  Shield,
  Zap,
  Loader2,
} from "lucide-react";
import { useBaseAccount } from "@/components/providers/base-account-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const baseAccount = useBaseAccount();
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletConnect = async () => {
    setIsLoading(true);

    try {
      await baseAccount.connect();
      toast.success("Wallet connected successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="size-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-sans font-bold text-foreground">
                PayZen
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                How it Works
              </Link>
              <Link
                href="#security"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Security
              </Link>
            </nav>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={handleWalletConnect}
              disabled={isLoading || baseAccount.isLoading}
            >
              {isLoading || baseAccount.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm">
              <div className="size-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground">
                Built on Base • Powered by USDC
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-sans font-bold text-balance">
              Finance without
              <br />
              <span className="text-primary">the middleman.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Send, receive, and manage USDC payments with Sub Accounts. The
              self-custody platform that brings the best of DeFi directly to
              you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleWalletConnect}
                disabled={isLoading || baseAccount.isLoading}
              >
                {isLoading || baseAccount.isLoading ? (
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
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {[
              { label: "Total Volume", value: "$2.4M+" },
              { label: "Active Users", value: "12,500+" },
              { label: "Transactions", value: "45K+" },
              { label: "Avg Speed", value: "<2s" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-6 rounded-2xl text-center"
              >
                <div className="text-3xl font-sans font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4">
              Everything you need for
              <span className="text-secondary"> seamless payments</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for individuals and businesses alike
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Sub-Account Management",
                description:
                  "Create and manage multiple sub-accounts for organized finances. Perfect for separating personal and business funds.",
              },
              {
                icon: LinkIcon,
                title: "Payment Links",
                description:
                  "Generate shareable payment links with custom amounts and memos. Get paid instantly with QR codes.",
              },
              {
                icon: Zap,
                title: "Instant Transfers",
                description:
                  "Send USDC to anyone using their username or wallet address. Transactions settle in seconds.",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description:
                  "Track your payment activity with detailed analytics and transaction history across all sub-accounts.",
              },
              {
                icon: Shield,
                title: "Self-Custody",
                description:
                  "You control your keys and funds. Built on Base for security and transparency.",
              },
              {
                icon: Wallet,
                title: "USDC Native",
                description:
                  "All transactions in USDC stablecoin. No volatility, just stable digital dollars.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-2xl hover:border-primary/50 group"
              >
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-sans font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-12 rounded-3xl text-center">
            <h2 className="text-4xl font-sans font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users managing their USDC payments with PayZen.
              Connect your wallet and start in minutes.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleWalletConnect}
              disabled={isLoading || baseAccount.isLoading}
            >
              {isLoading || baseAccount.isLoading ? (
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <Wallet className="size-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-sans font-bold">PayZen</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional USDC payments on Base blockchain.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security", "Roadmap"],
              },
              {
                title: "Resources",
                links: ["Documentation", "API Reference", "Support", "Status"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-sans font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PayZen. All rights reserved. Built on Base.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
