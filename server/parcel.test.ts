import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("parcel router", () => {
  it("should list parcels for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.parcel.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a new parcel", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.parcel.create({
      trackingNumber: "TEST123456",
      parcelName: "Test Parcel",
      destination: "Thailand",
      statusDescription: "Pending",
    });

    expect(result).toEqual({ success: true });
  });

  it("should update an existing parcel", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a parcel
    await caller.parcel.create({
      trackingNumber: "TEST789",
      parcelName: "Update Test",
      statusDescription: "Pending",
    });

    // Get the list to find the ID
    const parcels = await caller.parcel.list();
    const testParcel = parcels.find((p) => p.trackingNumber === "TEST789");

    if (testParcel) {
      const result = await caller.parcel.update({
        id: testParcel.id,
        parcelName: "Updated Name",
      });

      expect(result).toEqual({ success: true });
    }
  });

  it("should delete a parcel", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a parcel
    await caller.parcel.create({
      trackingNumber: "DELETE123",
      parcelName: "Delete Test",
      statusDescription: "Pending",
    });

    // Get the list to find the ID
    const parcels = await caller.parcel.list();
    const testParcel = parcels.find((p) => p.trackingNumber === "DELETE123");

    if (testParcel) {
      const result = await caller.parcel.delete({
        id: testParcel.id,
      });

      expect(result).toEqual({ success: true });

      // Verify it's deleted
      const updatedParcels = await caller.parcel.list();
      const deletedParcel = updatedParcels.find((p) => p.id === testParcel.id);
      expect(deletedParcel).toBeUndefined();
    }
  });
});
