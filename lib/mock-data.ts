// Mock market data - ready for real-time PocketBase integration
export interface TradingPair {
  symbol: string
  baseAsset: string
  quoteAsset: string
  lastPrice: number
  priceChange: number
  priceChangePercent: number
  volume: number
  high24h: number
  low24h: number
}

export interface OrderBookEntry {
  price: number
  amount: number
  total: number
}

export interface Trade {
  price: number
  amount: number
  time: string
  isBuy: boolean
}

export interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Mock trading pairs
export const tradingPairs: TradingPair[] = [
  {
    symbol: "BTCUSDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    lastPrice: 91499.99,
    priceChange: 1988.65,
    priceChangePercent: 2.22,
    volume: 796267987.56,
    high24h: 91800.0,
    low24h: 89420.75,
  },
  {
    symbol: "ETHUSDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    lastPrice: 3342.15,
    priceChange: 75.2,
    priceChangePercent: 2.3,
    volume: 245678321.45,
    high24h: 3380.5,
    low24h: 3250.0,
  },
  {
    symbol: "BNBUSDT",
    baseAsset: "BNB",
    quoteAsset: "USDT",
    lastPrice: 612.5,
    priceChange: -5.3,
    priceChangePercent: -0.86,
    volume: 89456123.78,
    high24h: 625.0,
    low24h: 605.2,
  },
  {
    symbol: "1000CATUSDT",
    baseAsset: "1000CAT",
    quoteAsset: "USDT",
    lastPrice: 0.00319,
    priceChange: 0.00028,
    priceChangePercent: 8.87,
    volume: 12345678.9,
    high24h: 0.00325,
    low24h: 0.00285,
  },
  {
    symbol: "1000CHEEMS",
    baseAsset: "1000CHEEMS",
    quoteAsset: "USDT",
    lastPrice: 0.000964,
    priceChange: -0.000012,
    priceChangePercent: -1.23,
    volume: 5678901.23,
    high24h: 0.001,
    low24h: 0.00095,
  },
]

// Generate mock order book
export function generateOrderBook(currentPrice: number): {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
} {
  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []

  for (let i = 0; i < 20; i++) {
    const bidPrice = currentPrice - (i + 1) * (currentPrice * 0.0001)
    const bidAmount = Math.random() * 2
    bids.push({
      price: bidPrice,
      amount: bidAmount,
      total: bidPrice * bidAmount,
    })

    const askPrice = currentPrice + (i + 1) * (currentPrice * 0.0001)
    const askAmount = Math.random() * 2
    asks.push({
      price: askPrice,
      amount: askAmount,
      total: askPrice * askAmount,
    })
  }

  return { bids, asks }
}

// Generate mock recent trades
export function generateRecentTrades(currentPrice: number): Trade[] {
  const trades: Trade[] = []
  const now = Date.now()

  for (let i = 0; i < 30; i++) {
    const isBuy = Math.random() > 0.5
    const priceVariation = (Math.random() - 0.5) * currentPrice * 0.001
    trades.push({
      price: currentPrice + priceVariation,
      amount: Math.random() * 0.1,
      time: new Date(now - i * 2000).toLocaleTimeString("th-TH"),
      isBuy,
    })
  }

  return trades
}

// Generate mock candlestick data
export function generateCandlestickData(basePrice: number, periods = 100): CandlestickData[] {
  const data: CandlestickData[] = []
  const now = Date.now()
  let currentPrice = basePrice

  for (let i = periods; i >= 0; i--) {
    const open = currentPrice
    const change = (Math.random() - 0.5) * basePrice * 0.02
    const close = open + change
    const high = Math.max(open, close) + Math.random() * basePrice * 0.01
    const low = Math.min(open, close) - Math.random() * basePrice * 0.01
    const volume = Math.random() * 100000

    data.push({
      time: new Date(now - i * 15 * 60 * 1000).toISOString(),
      open,
      high,
      low,
      close,
      volume,
    })

    currentPrice = close
  }

  return data
}

// TODO: Replace with PocketBase real-time subscriptions
// export function subscribeToMarketData(symbol: string, callback: (data: any) => void) {
//   const pb = new PocketBase('YOUR_POCKETBASE_URL')
//   pb.collection('market_data').subscribe(symbol, callback)
// }
