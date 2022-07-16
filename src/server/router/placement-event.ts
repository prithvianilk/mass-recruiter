import { z } from 'zod';
import { createRouter } from './context';
import { prisma } from '../db/client';

export const placementRouter = createRouter()
  .query('get-placement-upcoming-events', {
    async resolve() {
      return await prisma.placementEvent.findMany();
    },
  })
  .mutation('notify-event', {
    input: z.object({
      userId: z.string(),
      eventId: z.string(),
    }),
    async resolve({ ctx: { prisma }, input }) {
      await prisma.placementEventUserNotification.create({
        data: input,
      });
      return null;
    },
  })
  .mutation('unnotify-event', {
    input: z.object({
      userId: z.string(),
      eventId: z.string(),
    }),
    async resolve({ ctx: { prisma }, input: { userId, eventId } }) {
      await prisma.placementEventUserNotification.delete({
        where: { userId_eventId: { eventId, userId } },
      });
      return null;
    },
  })
  .mutation('confirm-registration', {
    input: z.object({
      userId: z.string(),
      eventId: z.string(),
    }),

    async resolve({ ctx: { prisma }, input: { eventId, userId } }) {
      await prisma.placementEventUserRegistration.create({
        data: { eventId, userId },
      });
      return null;
    },
  })
  .mutation('delete-registration', {
    input: z.object({
      userId: z.string(),
      eventId: z.string(),
    }),
    async resolve({ ctx: { prisma }, input: { eventId, userId } }) {
      await prisma.placementEventUserRegistration.delete({
        where: { userId_eventId: { eventId, userId } },
      });
      return null;
    },
  });
