import { Suspense } from "react"
import Hero from "@/components/hero"
import Dashboard from "@/components/dashboard"
import AiAdvisor from "@/components/ai-advisor"
import MarketOverview from "@/components/market-overview"
import LoanCalculator from "@/components/loan-calculator"
import ConnectWallet from "@/components/connect-wallet"
import Loading from "@/components/loading"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ConnectWallet />
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
      <AiAdvisor />
      <MarketOverview />
      <LoanCalculator />
    </main>
  )
}

