"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navigation } from "@/components/trading/navigation"
import { PriceTicker } from "@/components/trading/price-ticker"
import { OrderBook } from "@/components/trading/order-book"
import { MarketTrades } from "@/components/trading/market-trades"
import { TradingChart } from "@/components/trading/trading-chart"
import { TradingForm } from "@/components/trading/trading-form"
import { MarketPairs } from "@/components/trading/market-pairs"

export default function TradePage() {
  const router = useRouter()
  const [selectedPair, setSelectedPair] = useState("BTCUSDT")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <Navigation />
      <PriceTicker currentPair={selectedPair} />
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-0">
          {/* Left Sidebar - Order Book */}
          <div className="hidden lg:flex flex-col border-r border-slate-800 bg-slate-950">
            <OrderBook symbol={selectedPair} />
            <MarketTrades symbol={selectedPair} />
          </div>

          {/* Center - Chart Area */}
          <div className="bg-slate-900">
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <TradingChart symbol={selectedPair} />
              </div>
              {/* Trading Form Area */}
              <div className="h-64 border-t border-slate-800 bg-slate-950">
                <TradingForm symbol={selectedPair} />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Market Pairs */}
          <div className="hidden lg:block border-l border-slate-800 bg-slate-950">
            <MarketPairs selectedPair={selectedPair} onSelectPair={setSelectedPair} />
          </div>
        </div>
      </div>
    </div>
  )
}
