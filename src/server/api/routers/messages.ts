import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { prisma } from "@/server/db";

export const messagesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.messages.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }),

  createMessage: protectedProcedure
    .input(z.object({ userId: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      const prismaData = {
        data: {
          message: input.message,
          userId: input.userId,
        },
      };

      const data = await prisma.messages.create(prismaData);

      return data;
    }),
});
