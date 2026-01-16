import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const workspaceRouter = createTRPCRouter({
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkUserId: ctx.auth.userId },
      include: { workspace: true },
    });

    if (!user) {
      return { exists: false, onboardingComplete: false };
    }

    return {
      exists: true,
      onboardingComplete: user.workspace.onboardingComplete,
    };
  }),

  create: protectedProcedure
    .input(
      z.object({
        businessCategory: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Store userId in a variable to use in transaction
      const userId = ctx.auth.userId;
      
      console.log("In create mutation");
      console.log("userId:", userId);
      console.log("input:", input);
      
      // Check if user already has a workspace
      const existingUser = await ctx.db.user.findUnique({
        where: { clerkUserId: userId },
        include: { workspace: true },
      });

      if (existingUser) {
        console.log("User already exists, returning existing user");
        return existingUser;
      }

      // Create workspace and user
      console.log("Creating new workspace and user");
      return ctx.db.$transaction(async (tx) => {
        const workspace = await tx.workspace.create({
          data: {
            businessCategory: input.businessCategory,
          },
        });

        return tx.user.create({
          data: {
            clerkUserId: userId,
            workspaceId: workspace.id,
          },
        });
      });
    }),

  updateOnboarding: protectedProcedure
    .input(
      z.object({
        currency: z.string().optional(),
        businessType: z.string().optional(),
        teamSize: z.string().optional(),
        intendedUsage: z.array(z.string()).optional(),
        onboardingComplete: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;
      
      const user = await ctx.db.user.findUnique({
        where: { clerkUserId: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.db.workspace.update({
        where: { id: user.workspaceId },
        data: input,
      });
    }),
});