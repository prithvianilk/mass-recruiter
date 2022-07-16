import { z } from 'zod';
import { createRouter } from './context';

export const placementRouter = createRouter()
  .query('get-placement-upcoming-events', {
    async resolve({ ctx: { prisma } }) {
      return await prisma.placementEvent.findMany();
    },
  })
  .mutation('confirm-registration', {
    input: z.object({
      userId: z.string(),
      eventId: z.string(),
    }),
    async resolve({ ctx, input: { eventId, userId } }) {
      return await ctx.prisma.placementEventUserRegistration.create({
        data: { eventId, userId },
      });
    },
  })
  .mutation('delete-registration', {
    input: z.object({
      userId: z.string(),
      eventId: z.string(),
    }),
    async resolve({ ctx, input: { eventId, userId } }) {
      return await ctx.prisma.placementEventUserRegistration.delete({
        where: { userId_eventId: { eventId, userId } },
      });
    },
  });
