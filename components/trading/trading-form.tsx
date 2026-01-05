"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPocketBase, type TradingPair, type Order } from "@/lib/pocketbase"
import { useToast } from "@/hooks/use-toast"

interface TradingFormProps {
  symbol: string
}

export function TradingForm({ symbol }: TradingFormProps) {
  const { toast } = useToast()
  const [pair, setPair] = useState<TradingPair | null>(null)
  const [buyAmount, setBuyAmount] = useState("")
  const [buyPrice, setBuyPrice] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [sellPrice, setSellPrice] = useState("")
  const [orderType, setOrderType] = useState<"limit" | "market">("limit")

  useEffect(() => {
    const pb = getPocketBase()

    async function loadPair() {
      try {
        const pairData = await pb.collection("trading_pairs").getFirstListItem<TradingPair>(`symbol="${symbol}"`)
        setPair(pairData)
        setBuyPrice(pairData.last_price.toString())
        setSellPrice(pairData.last_price.toString())
      } catch (error) {
        console.error("[v0] Error loading pair:", error)
      }
    }

    loadPair()

    pb.collection("trading_pairs").subscribe("*", (e) => {
      if (e.record.symbol === symbol) {
        const updatedPair = e.record as TradingPair
        setPair(updatedPair)
      }
    })

    return () => {
      pb.collection("trading_pairs").unsubscribe("*")
    }
  }, [symbol])

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pair) return

    const pb = getPocketBase()

    try {
      const orderData: Partial<Order> = {
        symbol: pair.symbol,
        side: "BUY",
        type: orderType === "limit" ? "LIMIT" : "MARKET",
        price: orderType === "limit" ? Number.parseFloat(buyPrice) : pair.last_price,
        amount: Number.parseFloat(buyAmount),
        filled: 0,
        status: "OPEN",
      }

      await pb.collection("orders").create(orderData)

      toast({
        title: "คำสั่งซื้อสำเร็จ",
        description: `ซื้อ ${buyAmount} ${pair.base_asset} ที่ราคา ${orderType === "limit" ? buyPrice : pair.last_price} USDT`,
      })
      setBuyAmount("")
    } catch (error) {
      console.error("[v0] Error creating buy order:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างคำสั่งซื้อได้",
        variant: "destructive",
      })
    }
  }

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pair) return

    const pb = getPocketBase()

    try {
      const orderData: Partial<Order> = {
        symbol: pair.symbol,
        side: "SELL",
        type: orderType === "limit" ? "LIMIT" : "MARKET",
        price: orderType === "limit" ? Number.parseFloat(sellPrice) : pair.last_price,
        amount: Number.parseFloat(sellAmount),
        filled: 0,
        status: "OPEN",
      }

      await pb.collection("orders").create(orderData)

      toast({
        title: "คำสั่งขายสำเร็จ",
        description: `ขาย ${sellAmount} ${pair.base_asset} ที่ราคา ${orderType === "limit" ? sellPrice : pair.last_price} USDT`,
      })
      setSellAmount("")
    } catch (error) {
      console.error("[v0] Error creating sell order:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างคำสั่งขายได้",
        variant: "destructive",
      })
    }
  }

  if (!pair) return null

  const buyTotal = (Number.parseFloat(buyAmount) || 0) * (Number.parseFloat(buyPrice) || 0)
  const sellTotal = (Number.parseFloat(sellAmount) || 0) * (Number.parseFloat(sellPrice) || 0)

  return (
    <div className="h-full">
      <Tabs defaultValue="spot" className="h-full flex flex-col">
        <div className="px-4 pt-3 pb-2 border-b border-slate-800">
          <TabsList className="bg-slate-800/50 p-1">
            <TabsTrigger value="spot" className="text-xs data-[state=active]:bg-slate-700">
              Spot
            </TabsTrigger>
            <TabsTrigger value="cross" className="text-xs data-[state=active]:bg-slate-700">
              Cross
            </TabsTrigger>
            <TabsTrigger value="isolated" className="text-xs data-[state=active]:bg-slate-700">
              Isolated
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="spot" className="flex-1 mt-0">
          <div className="h-full grid grid-cols-2 gap-3 p-4">
            {/* Buy Form */}
            <form onSubmit={handleBuy} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">ซื้อ {pair.base_asset}</span>
              </div>

              <div className="flex gap-1 mb-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`flex-1 text-xs ${orderType === "limit" ? "bg-slate-700" : ""}`}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`flex-1 text-xs ${orderType === "market" ? "bg-slate-700" : ""}`}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </Button>
              </div>

              <div className="space-y-3">
                {orderType === "limit" && (
                  <div>
                    <Label htmlFor="buy-price" className="text-xs text-slate-400">
                      ราคา
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="buy-price"
                        type="number"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-slate-100 pr-12 font-mono"
                        step="0.01"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">USDT</span>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="buy-amount" className="text-xs text-slate-400">
                    จำนวน
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="buy-amount"
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-100 pr-12 font-mono"
                      step="0.00001"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                      {pair.base_asset}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500">รวม</span>
                    <span className="text-slate-300 font-mono">{buyTotal.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>ขั้นต่ำ 5 USDT</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-auto bg-green-600 hover:bg-green-700 text-white font-medium"
                disabled={!buyAmount || buyTotal < 5}
              >
                ซื้อ {pair.base_asset}
              </Button>
            </form>

            {/* Sell Form */}
            <form onSubmit={handleSell} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">ขาย {pair.base_asset}</span>
              </div>

              <div className="flex gap-1 mb-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`flex-1 text-xs ${orderType === "limit" ? "bg-slate-700" : ""}`}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`flex-1 text-xs ${orderType === "market" ? "bg-slate-700" : ""}`}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </Button>
              </div>

              <div className="space-y-3">
                {orderType === "limit" && (
                  <div>
                    <Label htmlFor="sell-price" className="text-xs text-slate-400">
                      ราคา
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="sell-price"
                        type="number"
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-slate-100 pr-12 font-mono"
                        step="0.01"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">USDT</span>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="sell-amount" className="text-xs text-slate-400">
                    จำนวน
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="sell-amount"
                      type="number"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-100 pr-12 font-mono"
                      step="0.00001"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                      {pair.base_asset}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500">รวม</span>
                    <span className="text-slate-300 font-mono">{sellTotal.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>ขั้นต่ำ 5 USDT</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-auto bg-red-600 hover:bg-red-700 text-white font-medium"
                disabled={!sellAmount || sellTotal < 5}
              >
                ขาย {pair.base_asset}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="cross" className="flex-1 mt-0 p-4">
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">Cross Margin Trading</div>
        </TabsContent>

        <TabsContent value="isolated" className="flex-1 mt-0 p-4">
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">Isolated Margin Trading</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
