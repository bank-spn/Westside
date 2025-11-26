import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Parcel queries
export async function getUserParcels(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { parcels } = await import("../drizzle/schema");
  return db.select().from(parcels).where(eq(parcels.userId, userId)).orderBy(parcels.createdAt);
}

export async function createParcel(parcel: typeof parcels.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { parcels } = await import("../drizzle/schema");
  const result = await db.insert(parcels).values(parcel);
  return result;
}

export async function updateParcel(id: number, userId: number, data: Partial<typeof parcels.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { parcels } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  return db.update(parcels).set(data).where(and(eq(parcels.id, id), eq(parcels.userId, userId)));
}

export async function deleteParcel(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { parcels } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  return db.delete(parcels).where(and(eq(parcels.id, id), eq(parcels.userId, userId)));
}

// Shipment queries
export async function getUserShipments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { shipments } = await import("../drizzle/schema");
  return db.select().from(shipments).where(eq(shipments.userId, userId)).orderBy(shipments.createdAt);
}

export async function createShipment(shipment: typeof shipments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { shipments } = await import("../drizzle/schema");
  return db.insert(shipments).values(shipment);
}

// Project queries
export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { projects } = await import("../drizzle/schema");
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(projects.createdAt);
}

export async function createProject(project: typeof projects.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { projects } = await import("../drizzle/schema");
  return db.insert(projects).values(project);
}

export async function updateProject(id: number, userId: number, data: Partial<typeof projects.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { projects } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  return db.update(projects).set(data).where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

export async function deleteProject(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { projects } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  return db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

// Weekly Plan queries
export async function getUserWeeklyPlans(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { weeklyPlans } = await import("../drizzle/schema");
  return db.select().from(weeklyPlans).where(eq(weeklyPlans.userId, userId)).orderBy(weeklyPlans.weekStartDate);
}

export async function createWeeklyPlan(plan: typeof weeklyPlans.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { weeklyPlans } = await import("../drizzle/schema");
  return db.insert(weeklyPlans).values(plan);
}

export async function updateWeeklyPlan(id: number, userId: number, data: Partial<typeof weeklyPlans.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { weeklyPlans } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  return db.update(weeklyPlans).set(data).where(and(eq(weeklyPlans.id, id), eq(weeklyPlans.userId, userId)));
}

export async function deleteWeeklyPlan(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { weeklyPlans } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  return db.delete(weeklyPlans).where(and(eq(weeklyPlans.id, id), eq(weeklyPlans.userId, userId)));
}
