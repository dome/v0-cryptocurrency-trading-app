# TradingView Lightweight Charts Integration Design

> **Goal:** Add TradingView Lightweight Charts as a 3rd chart type option to v0-cryptocurrency-trading-app, positioned after the Bar chart option, using existing PocketBase candle data.

---

## Overview

**Architecture:** Keep existing Line and Bar charts (Recharts), add TradingView as a 3rd option using `lightweight-charts` library, adapt v0 app's existing PocketBase candle data format.

**Tech Stack:** lightweight-charts v4.1.3, React 19, PocketBase, TypeScript

---

## Component Design

### New Component: TradingViewChart

**File:** `components/trading/TradingViewChart.tsx`

**Purpose:** Wrapper around lightweight-charts library with app styling and data transformation

**Props:**
```typescript
interface TradingViewChartProps {
  symbol: string;      // e.g., "BTCUSDT"
  timeframe: string;   // e.g., "15m"
  candles: Candle[];   // v0 app candle format
}
```

**Key Features:**
- `useClient` pattern for client-side rendering (lightweight-charts requires browser)
- Transforms v0 candle format to TradingView format
- Responsive container with resize handling
- Dark theme matching app (slate colors)

**Data Transformation:**
```typescript
// v0 format → TradingView format
{ timestamp: 1704452400, open: 3500, high: 3510, low: 3495, close: 3505, volume: 100 }
↓
{ time: 1704452400, open: 3500, high: 3510, low: 3495, close: 3505, volume: 100 }
```

**Chart Configuration:**
```typescript
const chart = createChart(container, {
  layout: {
    background: { color: '#0f172a' },  // slate-900
    textColor: '#e2e8f0',
  },
  grid: {
    vertLines: { color: '#1e293b', style: 1 },
    horzLines: { color: '#1e293b', style: 1 },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
});

const candlestickSeries = chart.addCandlestickSeries({
  upColor: '#22c55e',      // green
  downColor: '#ef4444',    // red
  borderVisible: false,
  wickUpColor: '#22c55e',
  wickDownColor: '#ef4444',
});
```

---

## Integration with Existing Chart Component

**Modifying:** `components/trading/trading-chart.tsx`

**Changes:**

1. **Update chart type enum:**
```typescript
const [chartType, setChartType] = useState<"line" | "bar" | "tradingview">("bar")
```

2. **Add 3rd chart selector button** (after Bar button, around line 95):
```typescript
<Button
  variant={chartType === "tradingview" ? "secondary" : "ghost"}
  size="sm"
  onClick={() => setChartType("tradingview")}
  className={chartType === "tradingview" ? "bg-cyan-500" : ""}
>
  <Candlestick className="h-4 w-4" />
</Button>
```

3. **Add import:**
```typescript
import { TradingViewChart } from "./TradingViewChart"
import { Candlestick } from "lucide-react"
```

4. **Conditional rendering:**
```typescript
{chartType === "tradingview" ? (
  <TradingViewChart
    symbol={symbol}
    timeframe={timeframe}
    candles={candles}
  />
) : chartType === "line" ? (
  // existing line chart (ResponsiveContainer + LineChart)
) : (
  // existing bar chart (ResponsiveContainer + BarChart)
)}
```

---

## Data Flow

**Source:** Existing PocketBase subscription in `trading-chart.tsx`

**Current fetch (unchanged):**
```typescript
const candles = await pb.collection("candles").getFullList<Candle>({
  filter: `symbol="${symbol}" && timeframe="${timeframe}"`,
  sort: "timestamp",
  limit: 100,
})
```

**Transformation (inside TradingViewChart):**
```typescript
const chartData = candles.map(c => ({
  time: c.timestamp,  // Already unix timestamp
  open: c.open,
  high: c.high,
  low: c.low,
  close: c.close,
  volume: c.volume,
}))
```

**Real-time updates (unchanged):**
- PocketBase subscription already updates `candles` state
- TradingViewChart re-renders when `candles` prop changes
- No additional subscriptions needed

---

## Dependencies

**New dependency:**
```bash
npm install lightweight-charts
```

**package.json:**
```json
{
  "lightweight-charts": "^4.1.3"
}
```

**Peer dependencies (already satisfied):**
- React >= 18
- TypeScript >= 4

---

## File Structure

**Files to CREATE:**
- `components/trading/TradingViewChart.tsx` - New TradingView component

**Files to MODIFY:**
- `components/trading/trading-chart.tsx` - Add 3rd chart type option

**Files to REFERENCE (patterns from chart-poc):**
- `chart-poc/app/infrastructure/charts/Chart.tsx` - Implementation reference

**No other files touched** - Minimal footprint, clean integration.

---

## UI/UX Design

**Button placement:** After Bar chart button

**Button order:** `Line | Bar | TradingView`

**Active state styling:**
- Active: `bg-cyan-500` (matches app's amber-cyan gradient theme)
- Inactive: `hover:bg-slate-800`

**Chart container:** Same height and responsive behavior as existing charts

**Volume chart:** Remains below main chart (unchanged)

---

## Error Handling

**Edge cases:**
1. **Empty candles array** - Show "No data available" message
2. **Invalid data** - Skip malformed candles, log error
3. **Single candle** - TradingView handles natively
4. **Large dataset** - TradingView efficiently renders 100+ candles

**Error boundary:**
```typescript
<ErrorBoundary fallback={<div>Chart unavailable</div>}>
  <TradingViewChart {...props} />
</ErrorBoundary>
```

---

## Implementation Order

1. **Install dependency:** `npm install lightweight-charts`
2. **Create TradingViewChart component** with basic chart rendering
3. **Add data transformation** from v0 format to TradingView format
4. **Integrate into trading-chart.tsx** - add 3rd button and conditional render
5. **Style refinement** - match app's dark theme
6. **Testing** - verify all 3 chart types work with same data

---

## Testing Checklist

- [ ] lightweight-charts installed successfully
- [ ] TradingViewChart component renders
- [ ] Candles display with correct green/red colors
- [ ] Chart type buttons cycle: Line → Bar → TradingView
- [ ] Data matches between all 3 chart types
- [ ] Timeframe switching updates TradingView
- [ ] Symbol switching updates TradingView
- [ ] Responsive behavior works on resize
- [ ] No console errors
- [ ] Real-time candle updates reflect in TradingView

---

## Success Criteria

- TradingView button visible and clickable
- Proper candlestick visualization (OHLC bars with wicks)
- Data consistency across all 3 chart types
- Smooth user experience
- Clean integration with existing codebase

---

## Reference Implementation

Key patterns from `chart-poc/app/infrastructure/charts/Chart.tsx`:
- Chart initialization with dark theme
- Candlestick series configuration
- Data transformation and formatting
- Resize handling with ResizeObserver
- Real-time update handling
