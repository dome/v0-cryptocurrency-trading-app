# Cryptocurrency Trading App 🚀

แอปพลิเคชันเทรด Cryptocurrency แบบ real-time ที่ใช้ PocketBase เป็น backend

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/dome1s-projects/v0-cryptocurrency-trading-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/muv0Ndo0Mtp)

## ✨ Features

- **Real-time Trading** - ข้อมูลราคา Order Book และ Trades อัพเดทแบบ real-time ผ่าน PocketBase subscriptions
- **Interactive Charts** - กราฟแท่งเทียนและกราฟเส้นพร้อม volume chart
- **Order Management** - สั่งซื้อ-ขายแบบ Limit และ Market orders
- **Multiple Trading Pairs** - รองรับหลายคู่เทรด (BTC/USDT, ETH/USDT, BNB/USDT, SOL/USDT)
- **No Authentication Required** - เข้าใช้งานได้เลยไม่ต้อง login
- **Modern UI** - ออกแบบตาม Binance Trading Interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: PocketBase (Real-time Database)
- **Styling**: TailwindCSS v4
- **Charts**: Recharts
- **UI Components**: Radix UI + shadcn/ui

## 📋 Prerequisites

ก่อนเริ่มต้น คุณต้องมี:

- Node.js 18+ และ npm
- PocketBase server รันอยู่ที่ `http://127.0.0.1:8090`
  - [ดาวน์โหลด PocketBase](https://pocketbase.io/docs/)

## 🚀 Getting Started

### 1. Clone และติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า PocketBase

#### 2.1 รัน PocketBase Server

```bash
# ดาวน์โหลดและแตกไฟล์ PocketBase แล้วรัน
./pocketbase serve
```

PocketBase จะรันที่ `http://127.0.0.1:8090`

#### 2.2 สร้าง Collections

เข้าไปที่ PocketBase Admin UI: `http://127.0.0.1:8090/_/`

สร้าง collections ทั้ง 5 ตัว (ดูรายละเอียดใน `docs/pocketbase-schema.md`):

1. **trading_pairs** - ข้อมูลคู่เทรด
2. **candles** - ข้อมูล OHLCV สำหรับกราฟ
3. **orders** - คำสั่งซื้อขาย (Order Book)
4. **trades** - ประวัติการเทรด
5. **tickers** - ข้อมูล ticker ปัจจุบัน

หรือใช้ไฟล์ `scripts/pocketbase-collections.json` เพื่อ import schema ทีเดียว

#### 2.3 ตั้งค่า API Rules

ในแต่ละ collection ตั้งค่า API Rules:
- **List/View**: Allow all
- **Create**: Allow all  
- **Update**: Allow all
- **Delete**: Allow all (สำหรับ demo)

### 3. Seed ข้อมูลตัวอย่าง

รันสคริปต์เพื่อเพิ่มข้อมูลตัวอย่าง:

```bash
npm run seed
```

สคริปต์นี้จะสร้าง:
- 4 คู่เทรด (BTCUSDT, ETHUSDT, BNBUSDT, SOLUSDT)
- ข้อมูล candles 100 แท่งต่อคู่
- Order book 40 orders ต่อคู่
- Recent trades 50 trades ต่อคู่
- Tickers สำหรับทุกคู่

### 4. รันโปรเจค

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000` จะเข้าหน้าเทรดได้เลย!

## 📁 Project Structure

```
├── app/
│   ├── page.tsx           # หน้าแรก (redirect ไป /trade)
│   └── trade/page.tsx     # หน้าเทรดหลัก
├── components/
│   └── trading/
│       ├── navigation.tsx       # Navigation bar
│       ├── price-ticker.tsx     # Price ticker แสดงราคา
│       ├── order-book.tsx       # Order book (bids/asks)
│       ├── market-trades.tsx    # Recent trades
│       ├── trading-chart.tsx    # กราฟแท่งเทียน
│       ├── trading-form.tsx     # ฟอร์มซื้อ-ขาย
│       └── market-pairs.tsx     # รายการคู่เทรด
├── lib/
│   └── pocketbase.ts      # PocketBase client + types
├── scripts/
│   └── seed-pocketbase.ts # สคริปต์ seed ข้อมูล
└── docs/
    ├── pocketbase-schema.md  # Database schema
    └── setup-guide.md        # คู่มือการติดตั้ง
```

## 🗄️ Database Schema

### Collections

1. **trading_pairs** - เก็บข้อมูลคู่เทรด (symbol, prices, volume)
2. **candles** - OHLCV data สำหรับกราฟ
3. **orders** - คำสั่งซื้อขาย (Order Book)
4. **trades** - ประวัติการเทรดที่เกิดขึ้น
5. **tickers** - ข้อมูล ticker ล่าสุด

ดูรายละเอียดเต็มใน `docs/pocketbase-schema.md`

## 🔄 Real-time Features

แอปใช้ PocketBase real-time subscriptions เพื่ออัพเดทข้อมูล:

```typescript
// Subscribe to order book changes
pb.collection('orders').subscribe('*', (e) => {
  updateOrderBook(e.record)
})

// Subscribe to recent trades
pb.collection('trades').subscribe('*', (e) => {
  updateTradesList(e.record)
})

// Subscribe to candles for chart
pb.collection('candles').subscribe('*', (e) => {
  updateChart(e.record)
})
```

## 🎨 Features Detail

### หน้าเทรดหลัก

- **Order Book** - แสดง bids/asks พร้อม depth visualization
- **Trading Chart** - กราฟแท่งเทียนและกราฟเส้น + volume chart
- **Trading Form** - ฟอร์มซื้อ-ขายแบบ Limit/Market
- **Market Pairs** - รายการคู่เทรดพร้อมค้นหา
- **Recent Trades** - ประวัติการเทรดล่าสุด real-time
- **Price Ticker** - แสดงราคาและสถิติ 24h

## 📝 Scripts

```bash
npm run dev      # รัน development server
npm run build    # Build production
npm run start    # รัน production server
npm run seed     # Seed ข้อมูลไปยัง PocketBase
```

## 🔧 Configuration

แอปเชื่อมต่อ PocketBase ที่ `http://127.0.0.1:8090` (ดูใน `lib/pocketbase.ts`)

หากต้องการเปลี่ยน URL:

```typescript
// lib/pocketbase.ts
export function getPocketBase() {
  if (!pbInstance) {
    pbInstance = new PocketBase("http://YOUR_POCKETBASE_URL")
  }
  return pbInstance
}
```

## 📚 Documentation

- [PocketBase Schema](docs/pocketbase-schema.md) - รายละเอียด database schema
- [Setup Guide](docs/setup-guide.md) - คู่มือการติดตั้งแบบละเอียด

## 🚀 Deployment

### Deploy บน Vercel

1. Push โค้ดขึ้น GitHub
2. Import repository ใน Vercel
3. ตั้งค่า environment variable (ถ้ามี)
4. Deploy!

**Note:** PocketBase ต้องรันบน server แยกต่างหาก ไม่สามารถ deploy ใน Vercel ได้

## 🤝 Contributing

Pull requests are welcome! สำหรับการเปลี่ยนแปลงใหญ่ กรุณาเปิด issue ก่อน

## 📄 License

MIT

## 🙏 Acknowledgments

- Design inspired by [Binance](https://www.binance.com)
- Built with [v0.dev](https://v0.dev)
- Database powered by [PocketBase](https://pocketbase.io)

---

**Built with ❤️ using Next.js 16, PocketBase & TailwindCSS v4**
