# Westside Parcel Tracker

แอปพลิเคชันสำหรับติดตามและจัดการพัสดุทั้งหมดในที่เดียว พร้อมระบบ Real-time tracking และประวัติการเดินทางที่ละเอียด

## ✨ Features

### 📦 Parcel Management
- เพิ่ม แก้ไข และลบข้อมูลพัสดุ
- ติดตาม Tracking Number จากหลายผู้ให้บริการ
- แสดงสถานะและตำแหน่งปัจจุบัน
- ดูประวัติการเดินทางแบบ Timeline

### 📊 Dashboard
- แสดงสถิติพัสดุทั้งหมด
- จำนวนพัสดุที่ส่งถึงแล้ว
- พัสดุที่อยู่ในศุลกากร
- พัสดุที่กำลังขนส่ง
- รายการพัสดุล่าสุด

### 🔐 Authentication
- ระบบ Login ผ่าน Manus OAuth
- ข้อมูลแยกตาม User
- ปลอดภัยด้วย JWT

### 💾 Database
- ใช้ Drizzle ORM
- รองรับ MySQL/PostgreSQL
- Schema Migration อัตโนมัติ
- Type-safe queries

## 🚀 Tech Stack

### Frontend
- **React 19** - UI Library
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component Library
- **Wouter** - Routing
- **tRPC** - Type-safe API Client

### Backend
- **Express 4** - Web Server
- **tRPC 11** - API Framework
- **Drizzle ORM** - Database ORM
- **Zod** - Schema Validation

### Database
- **MySQL/PostgreSQL** - Primary Database
- **Supabase** - Recommended hosting

### Testing
- **Vitest** - Unit Testing
- **TypeScript** - Type Safety

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- MySQL/PostgreSQL Database (Supabase recommended)

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/westside-tracker.git
cd westside-tracker
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

สร้างไฟล์ `.env` ที่ root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres"

# Authentication
JWT_SECRET="your-jwt-secret-key-min-32-characters"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://oauth.manus.im"

# App Configuration
VITE_APP_ID="your-app-id"
VITE_APP_TITLE="Westside Parcel Tracker"
VITE_APP_LOGO="https://your-logo-url.com/logo.png"

# Owner Info (Optional)
OWNER_OPEN_ID="your-owner-openid"
OWNER_NAME="Your Name"
```

### 4. Setup Database

```bash
# Push schema to database
pnpm db:push
```

### 5. Run Development Server

```bash
pnpm dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📦 Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🌐 Deployment

### Vercel (Recommended)

ดูคำแนะนำโดยละเอียดใน [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Quick Steps:**

1. Push code ไปยัง GitHub
2. Import project ใน Vercel
3. ตั้งค่า Environment Variables
4. Deploy!

### Other Platforms

แอปพลิเคชันนี้สามารถ Deploy บนแพลตฟอร์มอื่นๆ ได้:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - วิธีเชื่อมต่อ Supabase
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md) - วิธี Deploy บน Vercel
- [Database Schema](./drizzle/schema.ts) - โครงสร้าง Database

## 🗂️ Project Structure

```
westside-tracker/
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities & tRPC client
│   │   └── App.tsx        # Main app & routing
│   └── public/            # Static assets
├── server/                # Backend code
│   ├── _core/            # Core framework code
│   ├── routers.ts        # tRPC routes
│   ├── db.ts             # Database queries
│   └── *.test.ts         # Test files
├── drizzle/              # Database schema & migrations
│   └── schema.ts         # Table definitions
├── shared/               # Shared types & constants
└── package.json          # Dependencies & scripts
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler
```

## 🎯 Roadmap

### Completed ✅
- [x] Database Schema สำหรับ Parcels
- [x] tRPC API Endpoints
- [x] Dashboard Page
- [x] Parcel Management Page
- [x] Authentication System
- [x] Unit Tests
- [x] Supabase Integration Guide
- [x] Vercel Deployment Guide

### Planned 🚧
- [ ] Refresh Tracking - อัพเดทสถานะจาก API
- [ ] Parcel Status Filtering
- [ ] Create Shipment Page
- [ ] Shipment Quote Calculator
- [ ] Project Tracker
- [ ] Weekly Planner
- [ ] Email Notifications
- [ ] Mobile App

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Manus](https://manus.im) - Development Platform
- [Supabase](https://supabase.com) - Database Hosting
- [Vercel](https://vercel.com) - Deployment Platform
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [Drizzle ORM](https://orm.drizzle.team) - Database ORM

## 📧 Contact

สำหรับคำถามหรือข้อเสนอแนะ กรุณาติดต่อ:
- GitHub Issues: [Create an issue](https://github.com/YOUR_USERNAME/westside-tracker/issues)
- Email: your-email@example.com

---

Made with ❤️ by Your Name
