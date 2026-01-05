"use client"

import { useEffect, useState } from "react"
import { getPocketBase, type Trade } from "@/lib/pocketbase"

interface MarketTradesProps {
  symbol: string
}

export function MarketTrades({ symbol }: MarketTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    const pb = getPocketBase()

    async function loadTrades() {
      try {
        const tradesList = await pb.collection("trades").getList<Trade>(1, 30, {
          filter: `symbol="${symbol}"`,
          sort: "-timestamp",
        })
        setTrades(tradesList.items)
      } catch (error) {
        console.error("[v0] Error loading trades:", error)
      }
    }

    loadTrades()

    pb.collection("trades").subscribe("*", (e) => {
      const trade = e.record as Trade
      if (trade.symbol === symbol && e.action === "create") {
        setTrades((prev) => [trade, ...prev.slice(0, 29)])
      }
    })

    return () => {
      pb.collection("trades").unsubscribe("*")
    }
  }, [symbol])

  return (
    <div className="h-64 flex flex-col border-t border-slate-800 bg-slate-950">
      <div className="p-3 border-b border-slate-800">
        <h3 className="text-sm font-medium text-slate-300">Market Trades</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-slate-500 border-b border-slate-800">
        <div className="text-left">ราคา(USDT)</div>
        <div className="text-right">จำนวน(BTC)</div>
        <div className="text-right">เวลา</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {trades.map((trade, index) => (
          <div
            key={trade.id || index}
            className="grid grid-cols-3 gap-2 px-3 py-1 text-xs hover:bg-slate-800/30 transition-colors"
          >
            <div className={`text-left font-mono ${trade.side === "BUY" ? "text-green-500" : "text-red-500"}`}>
              {trade.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-right text-slate-300 font-mono">{trade.amount.toFixed(5)}</div>
            <div className="text-right text-slate-400">
              {new Date(trade.timestamp).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
