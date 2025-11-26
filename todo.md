# Westside Parcel Tracker - TODO

## Core Features

### Database & Backend
- [x] สร้าง Database Schema สำหรับ Parcels
- [x] สร้าง tRPC Procedures สำหรับ Parcel CRUD
- [ ] เพิ่ม API Integration สำหรับ Tracking Data
- [x] สร้าง Database Schema สำหรับ Shipments
- [x] สร้าง Database Schema สำหรับ Projects
- [x] สร้าง Database Schema สำหรับ Weekly Plans

### Frontend Pages
- [x] Dashboard Page - แสดงสถิติและ Recent Parcels
- [x] Parcel Page - จัดการพัสดุทั้งหมด (CRUD)
- [ ] Create Shipment Page - สร้าง Shipment ใหม่
- [ ] Shipment Quote Page - คำนวณราคา Shipment
- [ ] Project Tracker Page - ติดตามโปรเจกต์
- [ ] Weekly Plan Page - วางแผนรายสัปดาห์
- [ ] Settings Page - ตั้งค่าระบบ

### Parcel Features
- [x] Add Parcel - เพิ่มพัสดุใหม่
- [x] Edit Parcel - แก้ไขข้อมูลพัสดุ
- [x] Delete Parcel - ลบพัสดุ
- [ ] Refresh Tracking - อัพเดทสถานะพัสดุ
- [x] View Tracking Timeline - แสดงประวัติการเดินทาง
- [ ] Parcel Status Filtering - กรองตามสถานะ

### Integration & Deployment
- [x] เชื่อมต่อ Supabase Database
- [ ] ทดสอบการทำงานทั้งหมด
- [ ] สร้าง GitHub Repository
- [ ] Commit Code พร้อม Documentation
- [ ] เตรียม Vercel Deployment Guide

### Testing
- [x] เขียน Vitest Tests สำหรับ tRPC Procedures
- [x] ทดสอบ Frontend UI ทุกหน้า
- [x] ทดสอบการเชื่อมต่อ Database
