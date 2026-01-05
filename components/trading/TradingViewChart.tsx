"use client"

import { useEffect, useRef } from "react"
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts"
import type { Candle } from "@/lib/pocketbase"

interface TradingViewChartProps {
  symbol: string
  timeframe: string
  candles: Candle[]
}

export function TradingViewChart({ symbol, timeframe, candles }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return

    // Create chart with dark theme
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#0f172a" },
        textColor: "#e2e8f0",
      },
      grid: {
        vertLines: { color: "#1e293b", style: 1 },
        horzLines: { color: "#1e293b", style: 1 },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
      },
      rightPriceScale: {
        borderColor: "#334155",
      },
    })

    chartRef.current = chart

    // Cleanup on unmount
    return () => {
      chart.remove()
      chartRef.current = null
    }
  }, [])

  // Component will be completed in next task

  return (
    <div className="w-full h-full">
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  )
}
