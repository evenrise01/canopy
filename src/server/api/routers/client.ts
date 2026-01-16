import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const clientRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkUserId: ctx.auth.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return ctx.db.client.findMany({
      where: { workspaceId: user.workspaceId },
      orderBy: { name: "asc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.db.client.create({
        data: {
          ...input,
          workspaceId: user.workspaceId,
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

      return ctx.db.client.findFirst({
        where: {
          id: input.id,
          workspaceId: user.workspaceId,
        },
        include: {
          projects: true,
        },
      });
    }),
});
