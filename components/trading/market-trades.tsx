"use client"

import { useEffect, useState } from "react"
import { generateRecentTrades, type Trade } from "@/lib/mock-data"
import { tradingPairs } from "@/lib/mock-data"

interface MarketTradesProps {
  symbol: string
}

export function MarketTrades({ symbol }: MarketTradesProps) {
  const pair = tradingPairs.find((p) => p.symbol === symbol) || tradingPairs[0]
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    // Initial data
    setTrades(generateRecentTrades(pair.lastPrice))

    // TODO: Replace with PocketBase real-time subscription
    const interval = setInterval(() => {
      const newTrade: Trade = {
        price: pair.lastPrice * (1 + (Math.random() - 0.5) * 0.002),
        amount: Math.random() * 0.1,
        time: new Date().toLocaleTimeString("th-TH"),
        isBuy: Math.random() > 0.5,
      }
      setTrades((prev) => [newTrade, ...prev.slice(0, 29)])
    }, 3000)

    return () => clearInterval(interval)
  }, [pair.lastPrice, symbol])

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
          <div key={index} className="grid grid-cols-3 gap-2 px-3 py-1 text-xs hover:bg-slate-800/30 transition-colors">
            <div className={`text-left font-mono ${trade.isBuy ? "text-green-500" : "text-red-500"}`}>
              {trade.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-right text-slate-300 font-mono">{trade.amount.toFixed(5)}</div>
            <div className="text-right text-slate-400">{trade.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
