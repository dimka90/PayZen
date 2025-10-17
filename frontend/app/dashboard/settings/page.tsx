"use client"

export const dynamic = 'force-dynamic'

import type React from "react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Settings</h1>
      <p className="text-lg text-gray-400">Manage your account settings here.</p>
    </div>
  )
}