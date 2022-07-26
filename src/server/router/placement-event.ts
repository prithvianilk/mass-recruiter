import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { logger } from '../../server/utils/logger';
import { createRouter } from './context';

export const placementRouter = createRouter()
  .query('get-placement-upcoming-events', {
    async resolve({ ctx: { prisma, session } }) {
      try {
        const userId = session?.user?.id;
        const events = await prisma.placementEvent.findMany({
          select: {
            id: true,
            companyName: true,
            registrationDeadline: true,
            registratonLink: true,
            testTime: true,
            PlacementEventUserRegistration: {
              where: {
                userId,
              },
            },
            PlacementEventUserNotification: {
              where: {
                userId,
              },
            },
          },
        });
        return events.map(
          ({
            id,
            companyName,
            PlacementEventUserNotification,
            PlacementEventUserRegistration,
            registrationDeadline,
            registratonLink,
            testTime,
          }) => ({
            id,
            companyName,
            registrationDeadline,
            registratonLink,
            testTime,
            wantsNotification: PlacementEventUserNotification.length > 0,
            hasRegistered: PlacementEventUserRegistration.length > 0,
          })
        );
      } catch (error) {
        logger?.error('Error while getting all placement events: ', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
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
