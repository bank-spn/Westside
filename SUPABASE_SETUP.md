# Supabase Setup Guide

## Overview

แอปพลิเคชัน Westside Parcel Tracker ใช้ Drizzle ORM เชื่อมต่อกับ MySQL/TiDB Database ซึ่งสามารถใช้ Supabase หรือ Database Service อื่นๆ ได้

## การเชื่อมต่อ Supabase

### 1. สร้าง Supabase Project

1. ไปที่ [Supabase Dashboard](https://app.supabase.com/)
2. สร้าง Project ใหม่
3. เลือก Region ที่ใกล้ที่สุด
4. รอให้ Database พร้อมใช้งาน (ประมาณ 2-3 นาที)

### 2. ดึง Connection String

1. ไปที่ **Project Settings** → **Database**
2. ในส่วน **Connection String** เลือก **URI**
3. Copy Connection String ที่มีรูปแบบ:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### 3. แปลง Connection String เป็น MySQL Format

เนื่องจากโปรเจกต์นี้ใช้ Drizzle ORM กับ MySQL Dialect คุณมี 2 ตัวเลือก:

#### ตัวเลือก 1: ใช้ Supabase PostgreSQL (แนะนำ)

แก้ไข `drizzle.config.ts` และ `server/db.ts` เพื่อใช้ PostgreSQL แทน MySQL:

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // เปลี่ยนจาก mysql2 เป็น postgresql
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

และแก้ไข Schema ใน `drizzle/schema.ts` เป็น PostgreSQL:

```typescript
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
// แทนที่ mysqlTable ด้วย pgTable
// แทนที่ int().autoincrement() ด้วย serial()
```

#### ตัวเลือก 2: ใช้ MySQL Database Service อื่น

หากต้องการใช้ MySQL ให้ใช้ Service เหล่านี้:
- **PlanetScale** - MySQL-compatible serverless database
- **Railway** - รองรับ MySQL
- **DigitalOcean Managed MySQL**
- **AWS RDS MySQL**

### 4. ตั้งค่า Environment Variable

1. ใน Manus Management UI ไปที่ **Settings** → **Secrets**
2. เพิ่ม/แก้ไข `DATABASE_URL` ด้วย Connection String ของคุณ

หรือในไฟล์ `.env` (สำหรับ local development):

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 5. Push Schema ไปยัง Database

```bash
pnpm db:push
```

คำสั่งนี้จะ:
1. Generate migration files
2. Apply migrations ไปยัง Database
3. สร้าง Tables ทั้งหมดตาม Schema

### 6. ทดสอบการเชื่อมต่อ

```bash
pnpm test
```

หรือเปิดแอปพลิเคชันและลอง:
1. Login เข้าสู่ระบบ
2. ไปที่หน้า Parcels
3. เพิ่มพัสดุใหม่
4. ตรวจสอบว่าข้อมูลถูกบันทึกใน Database

## Database Tables

โปรเจกต์นี้มี Tables ดังนี้:

### users
- เก็บข้อมูลผู้ใช้จาก OAuth
- มี role (user/admin) สำหรับ authorization

### parcels
- เก็บข้อมูลพัสดุทั้งหมด
- เชื่อมโยงกับ user ผ่าน userId (foreign key)
- มีข้อมูล tracking number, status, location, etc.

### shipments
- เก็บข้อมูล shipment quotes
- สำหรับคำนวณราคาและวางแผนการส่ง

### projects
- เก็บข้อมูลโปรเจกต์
- สำหรับติดตามงาน

### weeklyPlans
- เก็บข้อมูลแผนรายสัปดาห์
- สำหรับวางแผนการทำงาน

## การ Deploy บน Vercel

เมื่อ Deploy บน Vercel:

1. เพิ่ม `DATABASE_URL` ใน **Environment Variables**
2. Vercel จะรัน build command โดยอัตโนมัติ
3. Database จะต้องสามารถเข้าถึงได้จาก Vercel Servers

**หมายเหตุ:** Supabase อนุญาตการเชื่อมต่อจาก IP ใดก็ได้ตามค่าเริ่มต้น ไม่จำเป็นต้องตั้งค่า IP Whitelist

## Troubleshooting

### Connection Timeout
- ตรวจสอบว่า Connection String ถูกต้อง
- ตรวจสอบว่า Database ไม่ได้ paused (Supabase free tier จะ pause หลังไม่ใช้งาน 7 วัน)

### Schema Mismatch
- ลบ migrations เก่าใน `drizzle/` folder
- รัน `pnpm db:push` ใหม่

### Permission Denied
- ตรวจสอบว่า Database User มี permissions เพียงพอ
- ใน Supabase ให้ใช้ `postgres` user ที่มีสิทธิ์เต็ม

## Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
