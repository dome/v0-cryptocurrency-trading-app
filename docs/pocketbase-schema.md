# PocketBase Collections Schema

## Collections ที่ต้องสร้างสำหรับระบบเทรด Cryptocurrency

### 1. trading_pairs
เก็บข้อมูลคู่เทรดทั้งหมด (BTC/USDT, ETH/USDT, ฯลฯ)

**Fields:**
- `symbol` (text, required, unique) - ชื่อคู่เทรด เช่น "BTCUSDT"
- `base_asset` (text, required) - สกุลเงินหลัก เช่น "BTC"
- `quote_asset` (text, required) - สกุลเงินอ้างอิง เช่น "USDT"
- `last_price` (number, required) - ราคาล่าสุด
- `price_change` (number) - การเปลี่ยนแปลงราคา (บาท)
- `price_change_percent` (number) - การเปลี่ยนแปลงราคา (%)
- `volume_24h` (number) - ปริมาณการซื้อขาย 24 ชั่วโมง
- `high_24h` (number) - ราคาสูงสุด 24 ชั่วโมง
- `low_24h` (number) - ราคาต่ำสุด 24 ชั่วโมง
- `is_active` (bool, default: true) - สถานะเปิดให้เทรด

### 2. candles
เก็บข้อมูล OHLCV (Open, High, Low, Close, Volume) สำหรับสร้างกราฟแท่งเทียน

**Fields:**
- `symbol` (text, required, index) - ชื่อคู่เทรด
- `timeframe` (text, required) - ช่วงเวลา: "1m", "5m", "15m", "1h", "4h", "1d"
- `timestamp` (number, required, index) - เวลา Unix timestamp
- `open` (number, required) - ราคาเปิด
- `high` (number, required) - ราคาสูงสุด
- `low` (number, required) - ราคาต่ำสุด
- `close` (number, required) - ราคาปิด
- `volume` (number, required) - ปริมาณการซื้อขาย

**Indexes:**
- Composite index: `symbol + timeframe + timestamp` (unique)

### 3. orders
เก็บคำสั่งซื้อขาย (Order Book)

**Fields:**
- `symbol` (text, required, index) - ชื่อคู่เทรด
- `side` (text, required) - "BUY" หรือ "SELL"
- `type` (text, required) - "LIMIT" หรือ "MARKET"
- `price` (number, required) - ราคาที่ตั้ง
- `amount` (number, required) - จำนวนที่ต้องการซื้อ/ขาย
- `filled` (number, default: 0) - จำนวนที่เทรดสำเร็จแล้ว
- `status` (text, default: "OPEN") - สถานะ: "OPEN", "FILLED", "CANCELLED"
- `user_id` (text) - ID ของผู้ใช้ (สำหรับในอนาคต)

**Indexes:**
- `symbol + status + side + price` สำหรับดึง Order Book

### 4. trades
เก็บประวัติการเทรดที่เกิดขึ้นจริง (Executed Trades)

**Fields:**
- `symbol` (text, required, index) - ชื่อคู่เทรด
- `price` (number, required) - ราคาที่เทรด
- `amount` (number, required) - จำนวนที่เทรด
- `side` (text, required) - "BUY" หรือ "SELL"
- `timestamp` (number, required, index) - เวลาที่เทรด Unix timestamp
- `buyer_order_id` (text) - ID คำสั่งซื้อ
- `seller_order_id` (text) - ID คำสั่งขาย

**Indexes:**
- `symbol + timestamp` สำหรับดึงประวัติการเทรดล่าสุด

### 5. tickers
เก็บข้อมูล ticker ปัจจุบัน (อัพเดทบ่อย)

**Fields:**
- `symbol` (text, required, unique) - ชื่อคู่เทรด
- `bid_price` (number) - ราคาซื้อสูงสุด
- `ask_price` (number) - ราคาขายต่ำสุด
- `last_price` (number) - ราคาล่าสุด
- `volume_24h` (number) - ปริมาณซื้อขาย 24h
- `updated_at` (number) - เวลาอัพเดทล่าสุด

## การใช้งาน Real-time

PocketBase รองรับ real-time subscriptions ผ่าน WebSocket:

```javascript
// Subscribe to order book changes
pb.collection('orders').subscribe('*', (e) => {
  if (e.record.symbol === 'BTCUSDT') {
    updateOrderBook(e.record)
  }
})

// Subscribe to recent trades
pb.collection('trades').subscribe('*', (e) => {
  updateTradesList(e.record)
})

// Subscribe to candles for chart updates
pb.collection('candles').subscribe('*', (e) => {
  updateChart(e.record)
})
