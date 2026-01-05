"use client"

import { useEffect, useState } from "react"
import { getPocketBase, type Order } from "@/lib/pocketbase"

interface OrderBookProps {
  symbol: string
}

interface OrderBookEntry {
  price: number
  amount: number
  total: number
}

export function OrderBook({ symbol }: OrderBookProps) {
  const [bids, setBids] = useState<OrderBookEntry[]>([])
  const [asks, setAsks] = useState<OrderBookEntry[]>([])
  const [currentPrice, setCurrentPrice] = useState(0)

  useEffect(() => {
    const pb = getPocketBase()

    async function loadOrderBook() {
      try {
        // Get current price from trading_pairs
        const pair = await pb.collection("trading_pairs").getFirstListItem(`symbol="${symbol}"`)
        setCurrentPrice(pair.last_price)

        // Get buy orders (bids)
        const buyOrders = await pb.collection("orders").getFullList<Order>({
          filter: `symbol="${symbol}" && status="OPEN" && side="BUY"`,
          sort: "-price",
          limit: 20,
        })

        // Get sell orders (asks)
        const sellOrders = await pb.collection("orders").getFullList<Order>({
          filter: `symbol="${symbol}" && status="OPEN" && side="SELL"`,
          sort: "+price",
          limit: 20,
        })

        // Convert to OrderBookEntry format
        const bidsData = buyOrders.map((order) => ({
          price: order.price,
          amount: order.amount - order.filled,
          total: order.price * (order.amount - order.filled),
        }))

        const asksData = sellOrders.map((order) => ({
          price: order.price,
          amount: order.amount - order.filled,
          total: order.price * (order.amount - order.filled),
        }))

        setBids(bidsData)
        setAsks(asksData)
      } catch (error) {
        console.error("[v0] Error loading order book:", error)
      }
    }

    loadOrderBook()

    pb.collection("orders").subscribe("*", (e) => {
      const order = e.record as Order
      if (order.symbol === symbol && order.status === "OPEN") {
        loadOrderBook() // Reload order book when there's an update
      }
    })

    // Subscribe to price updates
    pb.collection("trading_pairs").subscribe("*", (e) => {
      if (e.record.symbol === symbol) {
        setCurrentPrice(e.record.last_price)
      }
    })

    return () => {
      pb.collection("orders").unsubscribe("*")
      pb.collection("trading_pairs").unsubscribe("*")
    }
  }, [symbol])

  const maxBidTotal = Math.max(...bids.slice(0, 15).map((b) => b.total), 1)
  const maxAskTotal = Math.max(...asks.slice(0, 15).map((a) => a.total), 1)

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
          {asks.slice(0, 12).map((ask, index) => (
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
              {currentPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-xs text-slate-500">≈ ${currentPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div>
          {bids.slice(0, 12).map((bid, index) => (
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
