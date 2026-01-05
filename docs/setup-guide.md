# คู่มือการติดตั้งและใช้งาน

## ขั้นตอนการตั้งค่า PocketBase

### 1. สร้าง Collections ใน PocketBase

เข้าไปที่ PocketBase Admin UI: http://127.0.0.1:8090/_/

สร้าง collections ทั้ง 5 ตัวตามที่กำหนดใน `docs/pocketbase-schema.md`:

1. **trading_pairs** - เก็บข้อมูลคู่เทรด
2. **candles** - เก็บข้อมูล OHLCV สำหรับกราฟ
3. **orders** - เก็บคำสั่งซื้อขาย (Order Book)
4. **trades** - เก็บประวัติการเทรด
5. **tickers** - เก็บข้อมูล ticker ปัจจุบัน

หรือใช้ไฟล์ `scripts/pocketbase-collections.json` เพื่อ import ทีเดียว

### 2. ติดตั้ง Dependencies

```bash
npm install pocketbase
```

### 3. Seed ข้อมูลเริ่มต้น

รันสคริปต์ seed เพื่อเพิ่มข้อมูลตัวอย่าง:

```bash
npx tsx scripts/seed-pocketbase.ts
```

สคริปต์นี้จะสร้าง:
- 4 คู่เทรด (BTCUSDT, ETHUSDT, BNBUSDT, SOLUSDT)
- ข้อมูล candles สำหรับกราฟ 100 แท่งต่อคู่
- Order book (40 orders ต่อคู่)
- Recent trades (50 trades ต่อคู่)
- Tickers สำหรับทุกคู่

### 4. การตั้งค่า API Rules ใน PocketBase

สำหรับการใช้งานเบื้องต้น ควรตั้งค่า API Rules ดังนี้:

**สำหรับทุก collections:**
- **List/View**: Allow all (เพื่อให้เว็บดึงข้อมูลได้)
- **Create**: Allow all (สำหรับ demo, ในโปรเจคจริงควรใช้ auth)
- **Update**: Allow all (สำหรับ demo)
- **Delete**: Admin only (หรือ Allow all สำหรับ demo)

### 5. รันโปรเจค

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3000 จะเปิดหน้าเทรดได้เลย (ไม่ต้อง login)

## การใช้งาน Real-time Features

ระบบจะ subscribe ไปยัง PocketBase real-time events อัตโนมัติ:

- **Order Book**: อัพเดทเมื่อมี order ใหม่หรือถูก fill
- **Market Trades**: แสดง trade ใหม่แบบ real-time
- **Chart**: อัพเดทเมื่อมี candle ใหม่
- **Price Ticker**: อัพเดทราคาล่าสุดจาก tickers collection

## ข้อมูลเพิ่มเติม

- Schema details: `docs/pocketbase-schema.md`
- PocketBase client: `lib/pocketbase.ts`
- Seed script: `scripts/seed-pocketbase.ts`
