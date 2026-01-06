# TradingView Lightweight Charts Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add TradingView Lightweight Charts as a 3rd chart type option (Line | Bar | TradingView) to the v0-cryptocurrency-trading-app, using existing PocketBase candle data.

**Architecture:** Create new TradingViewChart component that wraps lightweight-charts library, adapt v0 app's candle data format (timestamp as number, OHLC values), integrate as 3rd option in existing chart type selector.

**Tech Stack:** lightweight-charts v4.1.3, React 19, TypeScript, PocketBase, Lucide React icons

---

## Task 1: Install lightweight-charts Dependency

**Files:**
- Modify: `package.json`

**Step 1: Install the dependency**

Run: `npm install lightweight-charts@^4.1.3`

Expected output:
```
added 1 package, and audited 0 packages in 1s
```

**Step 2: Verify installation**

Run: `cat package.json | grep lightweight-charts`

Expected: `"lightweight-charts": "^4.1.3"`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add lightweight-charts for TradingView candlestick charts"
```

---

## Task 2: Create TradingViewChart Component Structure

**Files:**
- Create: `components/trading/TradingViewChart.tsx`

**Step 1: Create the component file with imports**

```typescript
"use client"

import { useEffect, useRef } from "react"
import { createChart, IChartApi, ISeriesApi<ColorType> } from "lightweight-charts"
import type { Candle } from "@/lib/types"

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
```

**Step 2: Commit**

```bash
git add components/trading/TradingViewChart.tsx
git commit -m "feat: create TradingViewChart component structure"
```

---

## Task 3: Initialize Chart with Dark Theme

**Files:**
- Modify: `components/trading/TradingViewChart.tsx`

**Step 1: Add chart initialization in useEffect**

After the `seriesRef` declaration (around line 17), add:

```typescript
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
```

**Step 2: Commit**

```bash
git add components/trading/TradingViewChart.tsx
git commit -m "feat: add chart initialization with dark theme"
```

---

## Task 4: Add Candlestick Series and Data Rendering

**Files:**
- Modify: `components/trading/TradingViewChart.tsx`

**Step 1: Add series and data rendering useEffect**

After the previous useEffect (after the cleanup return), add:

```typescript
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
      time: c.timestamp,
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
```

**Step 2: Commit**

```bash
git add components/trading/TradingViewChart.tsx
git commit -m "feat: add candlestick series and data rendering"
```

---

## Task 5: Add Resize Handler

**Files:**
- Modify: `components/trading/TradingViewChart.tsx`

**Step 1: Add resize effect**

After the data rendering useEffect, add:

```typescript
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
```

**Step 2: Commit**

```bash
git add components/trading/TradingViewChart.tsx
git commit -m "feat: add responsive resize handler"
```

---

## Task 6: Add Empty State and Error Handling

**Files:**
- Modify: `components/trading/TradingViewChart.tsx`

**Step 1: Add empty state check in return**

Replace the entire return statement with:

```typescript
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
```

**Step 2: Commit**

```bash
git add components/trading/TradingViewChart.tsx
git commit -m "feat: add empty state handling"
```

---

## Task 7: Update trading-chart.tsx - Add TradingView Type

**Files:**
- Modify: `components/trading/trading-chart.tsx`

**Step 1: Update chart type state**

Find the `chartType` state declaration (around line 15-20), change to:

```typescript
const [chartType, setChartType] = useState<"line" | "bar" | "tradingview">("bar")
```

**Step 2: Add TradingViewChart import**

At the top of the file with other imports, add:

```typescript
import { TradingViewChart } from "./TradingViewChart"
import { Candlestick } from "lucide-react"
```

**Step 3: Commit**

```bash
git add components/trading/trading-chart.tsx
git commit -m "feat: add tradingview chart type and import TradingViewChart"
```

---

## Task 8: Add TradingView Button to Chart Selector

**Files:**
- Modify: `components/trading/trading-chart.tsx`

**Step 1: Add TradingView button after Bar button**

Find the chart type button section (around lines 78-99). After the Bar chart button, add:

```typescript
<Button
  variant={chartType === "tradingview" ? "secondary" : "ghost"}
  size="sm"
  onClick={() => setChartType("tradingview")}
  className={chartType === "tradingview" ? "bg-cyan-500 hover:bg-cyan-600" : "hover:bg-slate-800"}
>
  <Candlestick className="h-4 w-4" />
</Button>
```

**Step 2: Commit**

```bash
git add components/trading/trading-chart.tsx
git commit -m "feat: add TradingView button to chart selector"
```

---

## Task 9: Add Conditional Rendering for TradingView Chart

**Files:**
- Modify: `components/trading/trading-chart.tsx`

**Step 1: Find the chart rendering section**

Look for the ResponsiveContainer that renders Line/Bar charts (around lines 162-220).

**Step 2: Add conditional rendering for TradingView**

Replace the chart rendering section. The pattern should be:

```typescript
{chartType === "tradingview" ? (
  <div className="h-[400px]">
    <TradingViewChart
      symbol={symbol}
      timeframe={timeframe}
      candles={candles}
    />
  </div>
) : (
  <ResponsiveContainer width="100%" height={400}>
    {/* existing Line or Bar chart */}
  </ResponsiveContainer>
)}
```

Complete the existing Line/Bar chart logic in the else branch.

**Step 3: Commit**

```bash
git add components/trading/trading-chart.tsx
git commit -m "feat: add conditional rendering for TradingView chart"
```

---

## Task 10: Test All Chart Types

**Files:**
- Test: Manual browser testing

**Step 1: Install dependencies and run dev server**

Run: `npm install` (if not already done)
Run: `npm run dev`

Expected: Dev server starts on http://localhost:3000

**Step 2: Open trading page in browser**

Navigate to: http://localhost:3000

**Step 3: Test chart type switching**

1. Click "Line" button → Verify line chart displays
2. Click "Bar" button → Verify bar chart displays
3. Click "TradingView" button → Verify candlestick chart displays

**Step 4: Verify data consistency**

- Price levels should match across all 3 chart types
- Green candles (up) and red candles (down) should display correctly
- Timeframe switching should work for TradingView

**Step 5: Check for console errors**

Open browser DevTools (F12) → Console tab
Expected: No errors

**Step 6: Commit any fixes**

```bash
git add .
git commit -m "fix: any issues found during testing"
```

---

## Implementation Complete Checklist

- [ ] lightweight-charts dependency installed
- [ ] TradingViewChart component created with dark theme
- [ ] Candlestick series renders with correct colors
- [ ] Chart type state updated to include "tradingview"
- [ ] TradingView button added to chart selector
- [ ] Conditional rendering works for all 3 chart types
- [ ] Data consistency across chart types verified
- [ ] Responsive resize behavior works
- [ ] No console errors
- [ ] All 3 chart types cycle correctly

---

**Notes:**
- Working directory: `/Users/poom-work/tokenine/v0-cryptocurrency-trading-app`
- v0 app uses Recharts for Line/Bar charts
- PocketBase data already has candles with `timestamp` (number) and OHLC fields
- Real-time subscriptions already exist and will update TradingView automatically
