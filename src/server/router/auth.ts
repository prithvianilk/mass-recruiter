import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from './context';

async function getHasCompletedSetup(id: string) {}

export const authRouter = createRouter()
  .query('getSession', {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .mutation('update-mobile-number', {
    input: z.string().nullable(),
    async resolve({ ctx: { session, prisma }, input: mobileNumber }) {
      const id = session?.user?.id;
      await prisma.user.update({
        where: { id },
        data: {
          mobileNumber: mobileNumber,
          hasCompletedSetup: true,
        },
      });
      return null;
    },
  })
  .query('has-completed-setup', {
    async resolve({ ctx: { prisma, session } }) {
      const id = session?.user?.id;
      return await prisma.user
        .findFirst({
          select: { hasCompletedSetup: true },
          where: {
            id: id,
          },
        })
        .then((user) => user?.hasCompletedSetup);
    },
  });
