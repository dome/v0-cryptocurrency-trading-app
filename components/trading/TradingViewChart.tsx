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

  // Component will be completed in next task

  return (
    <div className="w-full h-full">
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  )
}
