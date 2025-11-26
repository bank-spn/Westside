# Vercel Deployment Guide

## Overview

คู่มือนี้จะแนะนำวิธีการ Deploy แอปพลิเคชัน Westside Parcel Tracker ไปยัง Vercel

## Prerequisites

- GitHub Account
- Vercel Account (สามารถ Sign up ด้วย GitHub)
- Supabase Database หรือ MySQL Database ที่พร้อมใช้งาน

## Step 1: Push Code ไปยัง GitHub

### 1.1 สร้าง GitHub Repository

```bash
# ใน Terminal
cd /path/to/westside-tracker

# Initialize git (ถ้ายังไม่ได้ทำ)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Westside Parcel Tracker"

# เชื่อมต่อกับ GitHub Repository
git remote add origin https://github.com/YOUR_USERNAME/westside-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.2 ตรวจสอบไฟล์ที่จำเป็น

ตรวจสอบว่ามีไฟล์เหล่านี้ใน Repository:
- ✅ `package.json` - มี build scripts
- ✅ `vercel.json` - Configuration สำหรับ Vercel (ถ้ามี)
- ✅ `.gitignore` - ไม่ commit `.env`, `node_modules`, etc.

## Step 2: Import Project ไปยัง Vercel

### 2.1 เข้าสู่ Vercel Dashboard

1. ไปที่ [vercel.com](https://vercel.com)
2. Sign in ด้วย GitHub Account
3. คลิก **"Add New..."** → **"Project"**

### 2.2 Import Repository

1. เลือก Repository **"westside-tracker"** จาก GitHub
2. คลิก **"Import"**

### 2.3 Configure Project

Vercel จะตรวจจับการตั้งค่าโดยอัตโนมัติ:

- **Framework Preset**: Vite
- **Build Command**: `pnpm build` (หรือ `npm run build`)
- **Output Directory**: `dist`
- **Install Command**: `pnpm install` (หรือ `npm install`)

## Step 3: ตั้งค่า Environment Variables

### 3.1 เพิ่ม Environment Variables

ใน Vercel Dashboard ของโปรเจกต์:

1. ไปที่ **Settings** → **Environment Variables**
2. เพิ่ม Variables ต่อไปนี้:

#### Required Variables

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
JWT_SECRET=your-jwt-secret-key-min-32-characters
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your-app-id
VITE_APP_TITLE=Westside Parcel Tracker
```

#### Optional Variables

```
VITE_APP_LOGO=https://your-logo-url.com/logo.png
OWNER_OPEN_ID=your-owner-openid
OWNER_NAME=Your Name
```

### 3.2 Environment Scope

เลือก Environment ที่ต้องการใช้:
- ✅ **Production** - สำหรับ production deployment
- ✅ **Preview** - สำหรับ preview deployments
- ⬜ **Development** - (optional) สำหรับ local development

## Step 4: Deploy

### 4.1 Deploy ครั้งแรก

1. คลิก **"Deploy"** ใน Vercel Dashboard
2. รอให้ Build เสร็จ (ประมาณ 2-3 นาที)
3. เมื่อ Deploy สำเร็จ คุณจะได้ URL เช่น:
   ```
   https://westside-tracker.vercel.app
   ```

### 4.2 ตรวจสอบ Deployment

1. เปิด URL ที่ได้
2. ทดสอบ Login
3. ทดสอบเพิ่มพัสดุ
4. ตรวจสอบว่าข้อมูลถูกบันทึกใน Database

## Step 5: Custom Domain (Optional)

### 5.1 เพิ่ม Custom Domain

1. ใน Vercel Dashboard ไปที่ **Settings** → **Domains**
2. เพิ่ม Domain ของคุณ เช่น `tracker.yourdomain.com`
3. ตั้งค่า DNS Records ตามที่ Vercel แนะนำ:
   - **Type**: CNAME
   - **Name**: tracker (หรือ subdomain ที่ต้องการ)
   - **Value**: cname.vercel-dns.com

### 5.2 รอ DNS Propagation

- DNS จะใช้เวลาประมาณ 5-60 นาทีในการ propagate
- Vercel จะออก SSL Certificate โดยอัตโนมัติ

## Step 6: Continuous Deployment

### 6.1 Auto Deploy

Vercel จะ Deploy อัตโนมัติเมื่อ:
- Push code ไปยัง `main` branch → Production deployment
- Push code ไปยัง branch อื่น → Preview deployment
- เปิด Pull Request → Preview deployment

### 6.2 Manual Deploy

หากต้องการ Deploy ด้วยตนเอง:

1. ใน Vercel Dashboard ไปที่ **Deployments**
2. คลิก **"..."** → **"Redeploy"**

## Troubleshooting

### Build Failed

**สาเหตุที่พบบ่อย:**

1. **Missing Environment Variables**
   - ตรวจสอบว่าเพิ่ม `DATABASE_URL` และ variables อื่นๆ แล้ว

2. **TypeScript Errors**
   - รัน `pnpm build` locally เพื่อตรวจสอบ errors
   - แก้ไข errors ก่อน push

3. **Dependency Issues**
   - ตรวจสอบ `package.json` ว่ามี dependencies ครบ
   - ลอง clear cache ใน Vercel และ redeploy

### Runtime Errors

**Database Connection Failed:**
- ตรวจสอบ `DATABASE_URL` ถูกต้อง
- ตรวจสอบว่า Database ไม่ได้ paused (Supabase free tier)
- ตรวจสอบ Network/Firewall settings

**OAuth Not Working:**
- ตรวจสอบ `OAUTH_SERVER_URL` และ `VITE_OAUTH_PORTAL_URL`
- ตรวจสอบว่า OAuth Redirect URL ตั้งค่าถูกต้อง

### Performance Issues

**Slow Response:**
- ตรวจสอบ Database location (ควรอยู่ใกล้ Vercel region)
- พิจารณาใช้ Connection Pooling
- เพิ่ม Database indexes สำหรับ queries ที่ใช้บ่อย

## Best Practices

### 1. Environment Variables
- ✅ ใช้ Environment Variables สำหรับ secrets
- ❌ ห้าม commit `.env` files
- ✅ ใช้ different values สำหรับ Production และ Preview

### 2. Database
- ✅ ใช้ Connection Pooling สำหรับ serverless
- ✅ Backup database เป็นประจำ
- ✅ ใช้ migrations สำหรับ schema changes

### 3. Monitoring
- ✅ ตั้งค่า Error Tracking (เช่น Sentry)
- ✅ Monitor Database performance
- ✅ ตรวจสอบ Vercel Analytics

### 4. Security
- ✅ ใช้ HTTPS เสมอ (Vercel ให้ฟรี)
- ✅ Validate user inputs
- ✅ ใช้ Rate Limiting สำหรับ API endpoints

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/environment-variables)
- [Custom Domains Guide](https://vercel.com/docs/custom-domains)

## Support

หากพบปัญหา:
1. ตรวจสอบ Vercel Logs ใน Dashboard
2. ดู Build Logs สำหรับ error messages
3. ตรวจสอบ Runtime Logs สำหรับ production issues
