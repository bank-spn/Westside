import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Parcels table - เก็บข้อมูลพัสดุทั้งหมด
 */
export const parcels = mysqlTable("parcels", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackingNumber: varchar("trackingNumber", { length: 255 }).notNull(),
  parcelName: varchar("parcelName", { length: 255 }),
  destination: varchar("destination", { length: 255 }),
  dateSent: timestamp("dateSent"),
  note: text("note"),
  status: varchar("status", { length: 50 }),
  statusDescription: text("statusDescription"),
  statusDate: timestamp("statusDate"),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Parcel = typeof parcels.$inferSelect;
export type InsertParcel = typeof parcels.$inferInsert;

/**
 * Shipments table - เก็บข้อมูล Shipment
 */
export const shipments = mysqlTable("shipments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  shipmentName: varchar("shipmentName", { length: 255 }).notNull(),
  origin: varchar("origin", { length: 255 }),
  destination: varchar("destination", { length: 255 }),
  weight: varchar("weight", { length: 50 }),
  dimensions: varchar("dimensions", { length: 100 }),
  shippingMethod: varchar("shippingMethod", { length: 100 }),
  estimatedCost: varchar("estimatedCost", { length: 50 }),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;

/**
 * Projects table - เก็บข้อมูลโปรเจกต์
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectName: varchar("projectName", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["planning", "in_progress", "completed", "on_hold"]).default("planning"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  startDate: timestamp("startDate"),
  dueDate: timestamp("dueDate"),
  completedDate: timestamp("completedDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Weekly Plans table - เก็บข้อมูลแผนรายสัปดาห์
 */
export const weeklyPlans = mysqlTable("weeklyPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  weekStartDate: timestamp("weekStartDate").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  tasks: text("tasks"),
  completed: int("completed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WeeklyPlan = typeof weeklyPlans.$inferSelect;
export type InsertWeeklyPlan = typeof weeklyPlans.$inferInsert;