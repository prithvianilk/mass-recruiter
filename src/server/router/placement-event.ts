import { createRouter } from './context';
import { prisma } from '../db/client';
import { z } from 'zod';
import { UserBindingContext } from 'twilio/lib/rest/chat/v2/service/user/userBinding';

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
    async resolve({ input }) {
      return await prisma.placementEventUserNotification.create({
        data: input,
      });
    },
  });
