"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-xl text-slate-400">Page not found</p>
        <Link href="/">
          <Button className="bg-teal-600 hover:bg-teal-700">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}