"use client"

import { useEffect, useState } from "react"
import { getPocketBase, type TradingPair } from "@/lib/pocketbase"
import { Star } from "lucide-react"

export function PriceTicker({ currentPair }: { currentPair: string }) {
  const [pairs, setPairs] = useState<TradingPair[]>([])
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null)

  useEffect(() => {
    const pb = getPocketBase()

    async function loadPairs() {
      try {
        const pairsList = await pb.collection("trading_pairs").getFullList<TradingPair>({
          filter: "is_active = true",
        })
        setPairs(pairsList)
        setSelectedPair(pairsList.find((p) => p.symbol === currentPair) || pairsList[0])
      } catch (error) {
        console.error("[v0] Error loading pairs:", error)
      }
    }

    loadPairs()

    pb.collection("trading_pairs").subscribe("*", (e) => {
      const updatedPair = e.record as TradingPair
      if (e.action === "update") {
        setPairs((prev) => prev.map((p) => (p.id === updatedPair.id ? updatedPair : p)))
        if (updatedPair.symbol === currentPair) {
          setSelectedPair(updatedPair)
        }
      }
    })

    return () => {
      pb.collection("trading_pairs").unsubscribe("*")
    }
  }, [currentPair])

  if (!selectedPair) return null

  return (
    <div className="h-16 bg-slate-950 border-b border-slate-800 px-4 flex items-center gap-6 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-fit">
        <Star className="h-4 w-4 text-slate-600" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-50 text-lg">{selectedPair.symbol}</span>
            <span className="text-xs text-slate-500">PocketBase Price</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 min-w-fit">
        <span
          className={`text-2xl font-bold ${selectedPair.price_change_percent >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {selectedPair.last_price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-6 text-xs min-w-fit">
        <div>
          <div className="text-slate-500">24h เปลี่ยนแปลง</div>
          <div className={`font-medium ${selectedPair.price_change_percent >= 0 ? "text-green-500" : "text-red-500"}`}>
            {selectedPair.price_change >= 0 ? "+" : ""}
            {selectedPair.price_change.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {selectedPair.price_change_percent >= 0 ? "+" : ""}
            {selectedPair.price_change_percent.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-slate-500">24h สูงสุด</div>
          <div className="font-medium text-slate-200">
            {selectedPair.high_24h.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div>
          <div className="text-slate-500">24h ต่ำสุด</div>
          <div className="font-medium text-slate-200">
            {selectedPair.low_24h.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div>
          <div className="text-slate-500">24h ปริมาณ({selectedPair.base_asset})</div>
          <div className="font-medium text-slate-200">{(selectedPair.volume_24h / 1000000).toFixed(2)}M</div>
        </div>
      </div>
    </div>
  )
}
