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

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return

    const chart = chartRef.current

    // Remove existing series if any
    if (seriesRef.current) {
      chart.removeSeries(seriesRef.current)
    }

    // Add candlestick series
    const series = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    })

    seriesRef.current = series

    // Transform v0 candle format to TradingView format
    const chartData = candles.map((c) => ({
      time: c.timestamp as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume || 0,
    }))

    // Set data
    series.setData(chartData)

    // Fit content
    chart.timeScale().fitContent()
  }, [candles])

  useEffect(() => {
    if (!chartRef.current) return

    const chart = chartRef.current

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    // Initial resize
    handleResize()

    // Add resize listener
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="w-full h-full">
      {candles.length === 0 ? (
        <div className="flex items-center justify-center h-[400px] text-slate-400">
          No data available
        </div>
      ) : (
        <div ref={chartContainerRef} className="w-full h-[400px]" />
      )}
    </div>
  )
}
