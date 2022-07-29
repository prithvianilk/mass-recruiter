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
            PlacementEventUserTestNotification: {
              where: {
                userId,
              },
            },
            PlacementEventUserRegistrationNotification: {
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
            PlacementEventUserRegistrationNotification,
            PlacementEventUserTestNotification,
            registrationDeadline,
            registratonLink,
            testTime,
          }) => ({
            id,
            companyName,
            registrationDeadline,
            registratonLink,
            testTime,
            wantsNotification:
              PlacementEventUserRegistrationNotification.length > 0,
            hasRegistered: PlacementEventUserTestNotification.length > 0,
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
      await prisma.placementEventUserRegistrationNotification.create({
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
      await prisma.placementEventUserRegistrationNotification.delete({
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
      await prisma.placementEventUserTestNotification.create({
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
      await prisma.placementEventUserTestNotification.delete({
        where: { userId_eventId: { eventId, userId } },
      });
      return null;
    },
  });
