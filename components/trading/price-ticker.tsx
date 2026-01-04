"use client"

import { useEffect, useState } from "react"
import { tradingPairs, type TradingPair } from "@/lib/mock-data"
import { Star } from "lucide-react"

export function PriceTicker({ currentPair }: { currentPair: string }) {
  const [pairs, setPairs] = useState<TradingPair[]>(tradingPairs)

  useEffect(() => {
    // TODO: Replace with PocketBase real-time subscription
    const interval = setInterval(() => {
      setPairs((prev) =>
        prev.map((pair) => ({
          ...pair,
          lastPrice: pair.lastPrice * (1 + (Math.random() - 0.5) * 0.001),
          priceChange: pair.priceChange * (1 + (Math.random() - 0.5) * 0.1),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const selectedPair = pairs.find((p) => p.symbol === currentPair) || pairs[0]

  return (
    <div className="h-16 bg-slate-950 border-b border-slate-800 px-4 flex items-center gap-6 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-fit">
        <Star className="h-4 w-4 text-slate-600" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-50 text-lg">{selectedPair.symbol}</span>
            <span className="text-xs text-slate-500">Binance Price</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 min-w-fit">
        <span
          className={`text-2xl font-bold ${selectedPair.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {selectedPair.lastPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-6 text-xs min-w-fit">
        <div>
          <div className="text-slate-500">24h เปลี่ยนแปลง</div>
          <div className={`font-medium ${selectedPair.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
            {selectedPair.priceChange >= 0 ? "+" : ""}
            {selectedPair.priceChange.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {selectedPair.priceChangePercent >= 0 ? "+" : ""}
            {selectedPair.priceChangePercent.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-slate-500">24h สูงสุด</div>
          <div className="font-medium text-slate-200">
            {selectedPair.high24h.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div>
          <div className="text-slate-500">24h ต่ำสุด</div>
          <div className="font-medium text-slate-200">
            {selectedPair.low24h.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div>
          <div className="text-slate-500">24h ปริมาณ({selectedPair.baseAsset})</div>
          <div className="font-medium text-slate-200">{(selectedPair.volume / 1000000).toFixed(2)}M</div>
        </div>
      </div>
    </div>
  )
}
