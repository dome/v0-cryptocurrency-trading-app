"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type User } from "@/lib/auth"
import { Navigation } from "@/components/trading/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tradingPairs } from "@/lib/mock-data"
import { ArrowUpRight, ArrowDownLeft, WalletIcon, TrendingUp, DollarSign } from "lucide-react"

export default function WalletPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
  }, [router])

  if (!user) return null

  // Calculate total balance in USDT
  const totalBalanceUSDT = Object.entries(user.balance).reduce((total, [asset, amount]) => {
    if (asset === "USDT") return total + amount

    const pair = tradingPairs.find((p) => p.baseAsset === asset && p.quoteAsset === "USDT")
    return total + (pair ? amount * pair.lastPrice : 0)
  }, 0)

  const assets = Object.entries(user.balance).map(([asset, amount]) => {
    const pair = tradingPairs.find((p) => p.baseAsset === asset && p.quoteAsset === "USDT")
    const usdtValue = asset === "USDT" ? amount : pair ? amount * pair.lastPrice : 0
    const percentage = (usdtValue / totalBalanceUSDT) * 100

    return {
      asset,
      amount,
      usdtValue,
      percentage,
      price: pair?.lastPrice || 1,
      priceChange: pair?.priceChangePercent || 0,
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navigation />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">กระเป๋าเงิน</h1>
              <p className="text-slate-400 mt-1">จัดการสินทรัพย์ crypto ของคุณ</p>
            </div>
            <Button
              variant="outline"
              className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-900 bg-transparent"
              onClick={() => router.push("/trade")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              ไปหน้าเทรด
            </Button>
          </div>

          {/* Total Balance Card */}
          <Card className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 border-0 text-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <WalletIcon className="h-5 w-5" />
                ยอดรวมทั้งหมด
              </CardTitle>
              <CardDescription className="text-slate-900/70">มูลค่ารวมของสินทรัพย์ทั้งหมด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {totalBalanceUSDT.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-2xl">USDT</span>
              </div>
              <div className="text-slate-900/70 mt-2">
                ≈ $
                {totalBalanceUSDT.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>

          {/* Assets Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assets List */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-50">สินทรัพย์</CardTitle>
                  <CardDescription className="text-slate-400">รายการสินทรัพย์ crypto ของคุณ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {/* Header */}
                    <div className="grid grid-cols-5 gap-4 px-4 py-3 text-xs text-slate-500 border-b border-slate-800">
                      <div>สินทรัพย์</div>
                      <div className="text-right">ยอดคงเหลือ</div>
                      <div className="text-right">ราคา</div>
                      <div className="text-right">มูลค่า (USDT)</div>
                      <div className="text-right">เปลี่ยนแปลง</div>
                    </div>

                    {/* Asset Rows */}
                    {assets.map(({ asset, amount, usdtValue, price, priceChange }) => (
                      <div
                        key={asset}
                        className="grid grid-cols-5 gap-4 px-4 py-4 hover:bg-slate-800/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-slate-900" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-50">{asset}</div>
                            <div className="text-xs text-slate-500">{asset === "USDT" ? "Tether" : asset}</div>
                          </div>
                        </div>
                        <div className="text-right text-slate-300 font-mono self-center">
                          {amount.toLocaleString("en-US", {
                            minimumFractionDigits: asset === "USDT" ? 2 : 5,
                            maximumFractionDigits: asset === "USDT" ? 2 : 5,
                          })}
                        </div>
                        <div className="text-right text-slate-300 font-mono self-center">
                          {price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-right text-slate-300 font-mono self-center">
                          {usdtValue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div
                          className={`text-right font-medium self-center ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {priceChange >= 0 ? "+" : ""}
                          {priceChange.toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deposit/Withdraw */}
            <div>
              <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-50">ฝาก / ถอน</CardTitle>
                  <CardDescription className="text-slate-400">จัดการเงินในบัญชี</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="deposit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                      <TabsTrigger
                        value="deposit"
                        className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                      >
                        <ArrowDownLeft className="h-4 w-4 mr-1" />
                        ฝากเงิน
                      </TabsTrigger>
                      <TabsTrigger
                        value="withdraw"
                        className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                      >
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        ถอนเงิน
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="deposit" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="deposit-amount" className="text-slate-300">
                          จำนวนเงิน (USDT)
                        </Label>
                        <Input
                          id="deposit-amount"
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="0.00"
                          className="mt-2 bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <ArrowDownLeft className="h-4 w-4 mr-2" />
                        ฝากเงิน
                      </Button>
                      <p className="text-xs text-slate-500 text-center">ระบบจะอัพเดทยอดเงินใน 1-5 นาที</p>
                    </TabsContent>

                    <TabsContent value="withdraw" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="withdraw-amount" className="text-slate-300">
                          จำนวนเงิน (USDT)
                        </Label>
                        <Input
                          id="withdraw-amount"
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="0.00"
                          className="mt-2 bg-slate-800 border-slate-700 text-slate-100"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          ยอดคงเหลือ: {user.balance.USDT.toLocaleString()} USDT
                        </p>
                      </div>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        ถอนเงิน
                      </Button>
                      <p className="text-xs text-slate-500 text-center">การถอนเงินจะใช้เวลา 1-24 ชั่วโมง</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-950 border-slate-800 mt-4">
                <CardHeader>
                  <CardTitle className="text-slate-50 text-base">การดำเนินการด่วน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-700 hover:bg-slate-800 bg-transparent"
                  >
                    <WalletIcon className="h-4 w-4 mr-2" />
                    ประวัติธุรกรรม
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-700 hover:bg-slate-800 bg-transparent"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    ดูการเทรดทั้งหมด
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
