import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Parcel router
  parcel: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await import("./db");
      return db.getUserParcels(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          trackingNumber: z.string(),
          parcelName: z.string().optional(),
          destination: z.string().optional(),
          dateSent: z.string().optional(),
          note: z.string().optional(),
          status: z.string().optional(),
          statusDescription: z.string().optional(),
          statusDate: z.string().optional(),
          location: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        await db.createParcel({
          userId: ctx.user.id,
          trackingNumber: input.trackingNumber,
          parcelName: input.parcelName,
          destination: input.destination,
          dateSent: input.dateSent ? new Date(input.dateSent) : undefined,
          note: input.note,
          status: input.status,
          statusDescription: input.statusDescription,
          statusDate: input.statusDate ? new Date(input.statusDate) : undefined,
          location: input.location,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          trackingNumber: z.string().optional(),
          parcelName: z.string().optional(),
          destination: z.string().optional(),
          dateSent: z.string().optional(),
          note: z.string().optional(),
          status: z.string().optional(),
          statusDescription: z.string().optional(),
          statusDate: z.string().optional(),
          location: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.trackingNumber !== undefined) updateData.trackingNumber = data.trackingNumber;
        if (data.parcelName !== undefined) updateData.parcelName = data.parcelName;
        if (data.destination !== undefined) updateData.destination = data.destination;
        if (data.dateSent !== undefined) updateData.dateSent = new Date(data.dateSent);
        if (data.note !== undefined) updateData.note = data.note;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.statusDescription !== undefined) updateData.statusDescription = data.statusDescription;
        if (data.statusDate !== undefined) updateData.statusDate = new Date(data.statusDate);
        if (data.location !== undefined) updateData.location = data.location;
        await db.updateParcel(id, ctx.user.id, updateData);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        await db.deleteParcel(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Shipment router
  shipment: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await import("./db");
      return db.getUserShipments(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          shipmentName: z.string(),
          origin: z.string().optional(),
          destination: z.string().optional(),
          weight: z.string().optional(),
          dimensions: z.string().optional(),
          shippingMethod: z.string().optional(),
          estimatedCost: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        await db.createShipment({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  // Project router
  project: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await import("./db");
      return db.getUserProjects(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          projectName: z.string(),
          description: z.string().optional(),
          status: z.enum(["planning", "in_progress", "completed", "on_hold"]).optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
          startDate: z.string().optional(),
          dueDate: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        await db.createProject({
          userId: ctx.user.id,
          projectName: input.projectName,
          description: input.description,
          status: input.status,
          priority: input.priority,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          projectName: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(["planning", "in_progress", "completed", "on_hold"]).optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
          startDate: z.string().optional(),
          dueDate: z.string().optional(),
          completedDate: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        const { id, ...data } = input;
        const updateData: any = {};
        if (data.projectName !== undefined) updateData.projectName = data.projectName;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.priority !== undefined) updateData.priority = data.priority;
        if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
        if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
        if (data.completedDate !== undefined) updateData.completedDate = new Date(data.completedDate);
        await db.updateProject(id, ctx.user.id, updateData);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        await db.deleteProject(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Weekly Plan router
  weeklyPlan: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await import("./db");
      return db.getUserWeeklyPlans(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          weekStartDate: z.string(),
          title: z.string(),
          description: z.string().optional(),
          tasks: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        await db.createWeeklyPlan({
          userId: ctx.user.id,
          weekStartDate: new Date(input.weekStartDate),
          title: input.title,
          description: input.description,
          tasks: input.tasks,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          tasks: z.string().optional(),
          completed: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        const { id, ...data } = input;
        await db.updateWeeklyPlan(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db");
        await db.deleteWeeklyPlan(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
