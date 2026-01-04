"use client"

import { useEffect, useState } from "react"
import { generateOrderBook, type OrderBookEntry } from "@/lib/mock-data"
import { tradingPairs } from "@/lib/mock-data"

interface OrderBookProps {
  symbol: string
}

export function OrderBook({ symbol }: OrderBookProps) {
  const pair = tradingPairs.find((p) => p.symbol === symbol) || tradingPairs[0]
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({
    bids: [],
    asks: [],
  })

  useEffect(() => {
    // Initial data
    setOrderBook(generateOrderBook(pair.lastPrice))

    // TODO: Replace with PocketBase real-time subscription
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook(pair.lastPrice * (1 + (Math.random() - 0.5) * 0.001)))
    }, 2000)

    return () => clearInterval(interval)
  }, [pair.lastPrice, symbol])

  const maxBidTotal = Math.max(...orderBook.bids.slice(0, 15).map((b) => b.total))
  const maxAskTotal = Math.max(...orderBook.asks.slice(0, 15).map((a) => a.total))

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800">
        <h3 className="text-sm font-medium text-slate-300">Order Book</h3>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-slate-500 border-b border-slate-800">
        <div className="text-left">ราคา(USDT)</div>
        <div className="text-right">จำนวน(BTC)</div>
        <div className="text-right">รวม</div>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col-reverse">
          {orderBook.asks.slice(0, 12).map((ask, index) => (
            <div key={`ask-${index}`} className="relative group hover:bg-slate-800/30 transition-colors">
              <div
                className="absolute right-0 top-0 bottom-0 bg-red-950/20"
                style={{
                  width: `${(ask.total / maxAskTotal) * 100}%`,
                }}
              />
              <div className="relative grid grid-cols-3 gap-2 px-3 py-0.5 text-xs">
                <div className="text-left text-red-500 font-mono">
                  {ask.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-right text-slate-300 font-mono">{ask.amount.toFixed(5)}</div>
                <div className="text-right text-slate-400 font-mono">{ask.total.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="py-3 px-3 border-y border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-500">
              {pair.lastPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs text-slate-500">≈ ${pair.lastPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div>
          {orderBook.bids.slice(0, 12).map((bid, index) => (
            <div key={`bid-${index}`} className="relative group hover:bg-slate-800/30 transition-colors">
              <div
                className="absolute right-0 top-0 bottom-0 bg-green-950/20"
                style={{
                  width: `${(bid.total / maxBidTotal) * 100}%`,
                }}
              />
              <div className="relative grid grid-cols-3 gap-2 px-3 py-0.5 text-xs">
                <div className="text-left text-green-500 font-mono">
                  {bid.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-right text-slate-300 font-mono">{bid.amount.toFixed(5)}</div>
                <div className="text-right text-slate-400 font-mono">{bid.total.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
