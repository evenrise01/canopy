import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ProjectStatus, MilestoneStatus } from "@generated/prisma";

export const projectRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkUserId: ctx.auth.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return ctx.db.project.findMany({
      where: { workspaceId: user.workspaceId },
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        clientId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.db.project.create({
        data: {
          ...input,
          workspaceId: user.workspaceId,
          status: "NOT_STARTED",
        },
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.db.project.findFirst({
        where: {
          id: input.id,
          workspaceId: user.workspaceId,
        },
        include: {
          client: true,
          milestones: {
            orderBy: { createdAt: "asc" },
          },
          notes: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        status: z.nativeEnum(ProjectStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.db.project.update({
        where: {
          id: input.projectId,
          workspaceId: user.workspaceId,
        },
        data: { status: input.status },
      });
    }),

  addMilestone: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        dueDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verify project ownership
      const project = await ctx.db.project.findFirst({
        where: { id: input.projectId, workspaceId: user.workspaceId },
      });

      if (!project) throw new Error("Project not found");

      return ctx.db.milestone.create({
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          projectId: input.projectId,
        },
      });
    }),

  updateMilestone: protectedProcedure
    .input(
      z.object({
        milestoneId: z.string(),
        status: z.nativeEnum(MilestoneStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verify milestone ownership through project
      const milestone = await ctx.db.milestone.findFirst({
        where: {
          id: input.milestoneId,
          project: {
            workspaceId: user.workspaceId,
          },
        },
      });

      if (!milestone) throw new Error("Milestone not found");

      return ctx.db.milestone.update({
        where: { id: input.milestoneId },
        data: { status: input.status },
      });
    }),

  addNote: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const project = await ctx.db.project.findFirst({
        where: { id: input.projectId, workspaceId: user.workspaceId },
      });

      if (!project) throw new Error("Project not found");

      return ctx.db.internalNote.create({
        data: {
          content: input.content,
          projectId: input.projectId,
        },
      });
    }),
});
