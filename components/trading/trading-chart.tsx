"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { generateCandlestickData, type CandlestickData, tradingPairs } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3 } from "lucide-react"

interface TradingChartProps {
  symbol: string
}

export function TradingChart({ symbol }: TradingChartProps) {
  const pair = tradingPairs.find((p) => p.symbol === symbol) || tradingPairs[0]
  const [chartData, setChartData] = useState<CandlestickData[]>([])
  const [interval, setInterval] = useState("15m")
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick")

  useEffect(() => {
    // TODO: Replace with PocketBase real-time subscription for chart data
    const data = generateCandlestickData(pair.lastPrice)
    setChartData(data)

    const updateInterval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev]
        const lastCandle = newData[newData.length - 1]
        const change = (Math.random() - 0.5) * pair.lastPrice * 0.01

        newData[newData.length - 1] = {
          ...lastCandle,
          close: lastCandle.close + change,
          high: Math.max(lastCandle.high, lastCandle.close + change),
          low: Math.min(lastCandle.low, lastCandle.close + change),
          volume: lastCandle.volume + Math.random() * 10000,
        }

        return newData
      })
    }, 3000)

    return () => clearInterval(updateInterval)
  }, [pair.lastPrice, symbol])

  const chartDisplayData = chartData.map((d) => ({
    time: new Date(d.time).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: d.close,
    volume: d.volume,
    fill: d.close >= d.open ? "#22c55e" : "#ef4444",
  }))

  return (
    <div className="h-full flex flex-col">
      {/* Chart Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs ${chartType === "candlestick" ? "bg-slate-800 text-slate-50" : "text-slate-400"}`}
            onClick={() => setChartType("candlestick")}
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Candlestick
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs ${chartType === "line" ? "bg-slate-800 text-slate-50" : "text-slate-400"}`}
            onClick={() => setChartType("line")}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Line
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {["1m", "5m", "15m", "1h", "4h", "1D", "1W"].map((int) => (
            <Button
              key={int}
              variant="ghost"
              size="sm"
              className={`text-xs px-2 ${interval === int ? "bg-slate-800 text-slate-50" : "text-slate-400"}`}
              onClick={() => setInterval(int)}
            >
              {int}
            </Button>
          ))}
        </div>
      </div>

      {/* Price and Change Info */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-baseline gap-3">
          <span className="text-xs text-slate-500">Open</span>
          <span className="text-sm text-slate-300 font-mono">
            {chartData[0]?.open.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-xs text-slate-500 ml-3">High</span>
          <span className="text-sm text-green-500 font-mono">
            {Math.max(...chartData.map((d) => d.high)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-xs text-slate-500 ml-3">Low</span>
          <span className="text-sm text-red-500 font-mono">
            {Math.min(...chartData.map((d) => d.low)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-xs text-slate-500 ml-3">Close</span>
          <span className="text-sm text-slate-300 font-mono">
            {chartData[chartData.length - 1]?.close.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-xs text-slate-500 ml-3">Change</span>
          <span className={`text-sm font-mono ${pair.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
            {pair.priceChangePercent >= 0 ? "+" : ""}
            {pair.priceChangePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={chartDisplayData}>
              <XAxis
                dataKey="time"
                stroke="#475569"
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 1000", "dataMax + 1000"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={chartDisplayData}>
              <XAxis
                dataKey="time"
                stroke="#475569"
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 1000", "dataMax + 1000"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Bar dataKey="price" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="h-24 px-4 pb-2 border-t border-slate-800">
        <div className="text-xs text-slate-500 mb-1">Volume</div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartDisplayData}>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="volume" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
