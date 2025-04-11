import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Web3Provider } from "@/components/web3-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DeFi Genius - AI-Powered Lending on Rootstock",
  description: "Decentralized lending platform with AI-powered risk assessment and loan recommendations on Rootstock",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Web3Provider>
            <Navbar />
            {children}
            <Footer />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'