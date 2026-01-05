import PocketBase from "pocketbase"

// สร้าง PocketBase client singleton
let pbInstance: PocketBase | null = null

export function getPocketBase() {
  if (!pbInstance) {
    pbInstance = new PocketBase("http://127.0.0.1:8090")
    // ปิด auto-cancellation เพื่อให้ทำงานได้ดีกับ React 18
    pbInstance.autoCancellation(false)
  }
  return pbInstance
}

// Type definitions สำหรับ collections
export interface TradingPair {
  id?: string
  symbol: string
  base_asset: string
  quote_asset: string
  last_price: number
  price_change: number
  price_change_percent: number
  volume_24h: number
  high_24h: number
  low_24h: number
  is_active: boolean
  created?: string
  updated?: string
}

export interface Candle {
  id?: string
  symbol: string
  timeframe: string
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  created?: string
  updated?: string
}

export interface Order {
  id?: string
  symbol: string
  side: "BUY" | "SELL"
  type: "LIMIT" | "MARKET"
  price: number
  amount: number
  filled: number
  status: "OPEN" | "FILLED" | "CANCELLED"
  user_id?: string
  created?: string
  updated?: string
}

export interface Trade {
  id?: string
  symbol: string
  price: number
  amount: number
  side: "BUY" | "SELL"
  timestamp: number
  buyer_order_id?: string
  seller_order_id?: string
  created?: string
  updated?: string
}

export interface Ticker {
  id?: string
  symbol: string
  bid_price: number
  ask_price: number
  last_price: number
  volume_24h: number
  updated_at: number
  created?: string
  updated?: string
}
