import type React from "react"
import localFont from "next/font/local"
import "./globals.css"
import { Providers } from "./providers"

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-Variable.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "300 700",
})

const inter = localFont({
  src: [
    {
      path: "./fonts/Inter-Variable.ttf",
    },
  ],
  variable: "--font-mono",
  display: "swap",
})

export const metadata = {
  title: "PayZen - USDC Payments on Base",
  description: "Professional USDC payment platform with Sub Accounts integration",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="gradient-bg min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
