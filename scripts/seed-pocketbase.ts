/**
 * สคริปต์สำหรับ seed ข้อมูลเริ่มต้นไปยัง PocketBase
 * รันด้วย: node scripts/seed-pocketbase.ts
 */

// โหลด environment variables จากไฟล์ .env
import { config } from 'dotenv'
config()

import PocketBase from "pocketbase"

const pb = new PocketBase("http://127.0.0.1:8090")

// Skip authentication for now - allow public access to collections
// Admin authentication - สามารถใช้ environment variables แทนได้
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "admin@example.com"
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "admin123456"

// ข้อมูลคู่เทรดเริ่มต้น
const tradingPairs = [
  {
    symbol: "BTCUSDT",
    base_asset: "BTC",
    quote_asset: "USDT",
    last_price: 91499.99,
    price_change: 1988.65,
    price_change_percent: 2.22,
    volume_24h: 796267987.56,
    high_24h: 91800.0,
    low_24h: 89420.75,
    is_active: true,
  },
  {
    symbol: "ETHUSDT",
    base_asset: "ETH",
    quote_asset: "USDT",
    last_price: 3342.15,
    price_change: 75.2,
    price_change_percent: 2.3,
    volume_24h: 245678321.45,
    high_24h: 3380.5,
    low_24h: 3250.0,
    is_active: true,
  },
  {
    symbol: "BNBUSDT",
    base_asset: "BNB",
    quote_asset: "USDT",
    last_price: 612.5,
    price_change: -5.3,
    price_change_percent: -0.86,
    volume_24h: 89456123.78,
    high_24h: 625.0,
    low_24h: 605.2,
    is_active: true,
  },
  {
    symbol: "SOLUSDT",
    base_asset: "SOL",
    quote_asset: "USDT",
    last_price: 195.8,
    price_change: 8.4,
    price_change_percent: 4.48,
    volume_24h: 156789432.1,
    high_24h: 198.5,
    low_24h: 185.2,
    is_active: true,
  },
]

// สร้างข้อมูล candles สำหรับกราฟ
function generateCandles(symbol: string, basePrice: number, count = 100) {
  const candles = []
  const now = Date.now()
  let currentPrice = basePrice

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * 15 * 60 * 1000 // 15 minutes interval
    const open = currentPrice
    const change = (Math.random() - 0.5) * basePrice * 0.02
    const close = open + change
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01
    const volume = Math.random() * 100000

    candles.push({
      symbol,
      timeframe: "15m",
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    })

    currentPrice = close
  }

  return candles
}

// สร้าง order book
function generateOrders(symbol: string, currentPrice: number) {
  const orders = []

  // Buy orders (bids)
  for (let i = 1; i <= 20; i++) {
    const price = currentPrice - i * (currentPrice * 0.0001)
    const amount = Math.random() * 2
    orders.push({
      symbol,
      side: "BUY",
      type: "LIMIT",
      price,
      amount,
      filled: 0,
      status: "OPEN",
    })
  }

  // Sell orders (asks)
  for (let i = 1; i <= 20; i++) {
    const price = currentPrice + i * (currentPrice * 0.0001)
    const amount = Math.random() * 2
    orders.push({
      symbol,
      side: "SELL",
      type: "LIMIT",
      price,
      amount,
      filled: 0,
      status: "OPEN",
    })
  }

  return orders
}

// สร้าง recent trades
function generateTrades(symbol: string, currentPrice: number) {
  const trades = []
  const now = Date.now()

  for (let i = 0; i < 50; i++) {
    const side = Math.random() > 0.5 ? "BUY" : "SELL"
    const priceVariation = (Math.random() - 0.5) * currentPrice * 0.001
    const price = currentPrice + priceVariation
    const amount = Math.random() * 0.1
    const timestamp = now - i * 2000

    trades.push({
      symbol,
      price,
      amount,
      side,
      timestamp,
    })
  }

  return trades
}

async function seedDatabase() {
  console.log("🌱 เริ่มต้น seed ข้อมูลไปยัง PocketBase...")

  try {
    // ลองสร้าง admin user ใหม่ถ้ายังไม่มี
    try {
      console.log("🔐 กำลังเข้าสู่ระบบด้วยสิทธิ์ admin...")
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
      console.log("✅ เข้าสู่ระบบสำเร็จ!")
    } catch (error: any) {
      console.log("❌ ไม่สามารถเข้าสู่ระบบได้:", error.message)
      console.log("\n💡 กรุณา:")
      console.log("1. เปิด http://127.0.0.1:8090/_/ ใน browser")
      console.log("2. สร้าง admin account ใหม่")
      console.log("3. อัพเดท email และ password ใน .env หรือแก้ไขโค้ดตรงๆ")
      console.log("4. รันสคริปต์ใหม่")
      return
    }
    
    // ปิด auto cancellation ของ request
    pb.autoCancellation(false)
    // 1. สร้างข้อมูล trading pairs
    console.log("\n📊 กำลังสร้างข้อมูลคู่เทรด...")
    for (const pair of tradingPairs) {
      try {
        await pb.collection("trading_pairs").create(pair)
        console.log(`✅ สร้าง ${pair.symbol} สำเร็จ`)
      } catch (error: any) {
        console.log(`⚠️  ${pair.symbol} มีอยู่แล้ว หรือ error: ${error.message}`)
      }
    }

    // 2. สร้างข้อมูล candles สำหรับแต่ละคู่
    console.log("\n📈 กำลังสร้างข้อมูลแท่งเทียน...")
    for (const pair of tradingPairs) {
      const candles = generateCandles(pair.symbol, pair.last_price)
      for (const candle of candles) {
        try {
          await pb.collection("candles").create(candle)
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`✅ สร้างข้อมูล candles สำหรับ ${pair.symbol} จำนวน ${candles.length} แท่ง`)
    }

    // 3. สร้างข้อมูล orders (order book)
    console.log("\n📋 กำลังสร้าง order book...")
    for (const pair of tradingPairs) {
      const orders = generateOrders(pair.symbol, pair.last_price)
      for (const order of orders) {
        try {
          await pb.collection("orders").create(order)
        } catch (error: any) {
          // Skip errors
        }
      }
      console.log(`✅ สร้าง orders สำหรับ ${pair.symbol} จำนวน ${orders.length} orders`)
    }

    // 4. สร้างข้อมูล trades
    console.log("\n💹 กำลังสร้างประวัติการเทรด...")
    for (const pair of tradingPairs) {
      const trades = generateTrades(pair.symbol, pair.last_price)
      for (const trade of trades) {
        try {
          await pb.collection("trades").create(trade)
        } catch (error: any) {
          // Skip errors
        }
      }
      console.log(`✅ สร้าง trades สำหรับ ${pair.symbol} จำนวน ${trades.length} trades`)
    }

    // 5. สร้างข้อมูล tickers
    console.log("\n🎯 กำลังสร้าง tickers...")
    for (const pair of tradingPairs) {
      const orders = await pb.collection("orders").getFullList({
        filter: `symbol = "${pair.symbol}" && status = "OPEN"`,
        sort: "price",
      })

      const buyOrders = orders.filter((o: any) => o.side === "BUY")
      const sellOrders = orders.filter((o: any) => o.side === "SELL")

      const bidPrice = buyOrders.length > 0 ? Math.max(...buyOrders.map((o: any) => o.price)) : pair.last_price * 0.999
      const askPrice =
        sellOrders.length > 0 ? Math.min(...sellOrders.map((o: any) => o.price)) : pair.last_price * 1.001

      try {
        await pb.collection("tickers").create({
          symbol: pair.symbol,
          bid_price: bidPrice,
          ask_price: askPrice,
          last_price: pair.last_price,
          volume_24h: pair.volume_24h,
          updated_at: Date.now(),
        })
        console.log(`✅ สร้าง ticker สำหรับ ${pair.symbol}`)
      } catch (error: any) {
        console.log(`⚠️  Ticker ${pair.symbol} มีอยู่แล้ว`)
      }
    }

    console.log("\n🎉 Seed ข้อมูลเสร็จสมบูรณ์!")
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error)
  }
}

// รันสคริปต์
seedDatabase()
