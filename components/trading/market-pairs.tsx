"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { tradingPairs } from "@/lib/mock-data"
import { Search, Star } from "lucide-react"

interface MarketPairsProps {
  selectedPair: string
  onSelectPair: (symbol: string) => void
}

export function MarketPairs({ selectedPair, onSelectPair }: MarketPairsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "favorites">("all")

  const filteredPairs = tradingPairs.filter((pair) => {
    const matchesSearch =
      pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.baseAsset.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-800">
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="ค้นหา"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm h-8"
          />
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 text-xs ${filter === "all" ? "bg-slate-700" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 text-xs ${filter === "favorites" ? "bg-slate-700" : ""}`}
            onClick={() => setFilter("favorites")}
          >
            <Star className="h-3 w-3 mr-1" />
            Favorites
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-slate-500 border-b border-slate-800">
        <div className="text-left">Pair</div>
        <div className="text-right">ราคา</div>
        <div className="text-right">เปลี่ยนแปลง</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredPairs.map((pair) => (
          <button
            key={pair.symbol}
            onClick={() => onSelectPair(pair.symbol)}
            className={`w-full grid grid-cols-3 gap-2 px-3 py-2.5 text-xs hover:bg-slate-800/50 transition-colors ${
              selectedPair === pair.symbol ? "bg-slate-800" : ""
            }`}
          >
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 text-slate-600 hover:text-amber-500 transition-colors" />
                <span className="text-slate-200 font-medium">{pair.baseAsset}</span>
                <span className="text-slate-500">/{pair.quoteAsset}</span>
              </div>
              <div className="text-slate-600 text-[10px] mt-0.5">5x</div>
            </div>
            <div className="text-right">
              <div className={`font-mono ${pair.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                {pair.lastPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: pair.lastPrice < 1 ? 5 : 2,
                })}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${pair.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                {pair.priceChangePercent >= 0 ? "+" : ""}
                {pair.priceChangePercent.toFixed(2)}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
