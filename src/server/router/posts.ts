import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const postsRouter = createRouter()
  .mutation('create-post', {
    input: z.object({
      userId: z.string(),
      title: z.string(),
      body: z.string(),
    }),
    async resolve({ ctx: { prisma }, input }) {
      return await prisma.post.create({
        data: input,
      });
    },
  })
  .query('get-all-posts', {
    async resolve({ ctx: { prisma } }) {
      try {
        return await prisma.post.findMany();
      } catch (error) {
        console.log(`Error while getting all posts: ${error}`);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'We are facing a temporary issue. Please try again later.',
        });
      }
    },
  })
  .mutation('edit-post', {
    input: z.object({
      id: z.string(),
      title: z.string(),
      body: z.string(),
    }),
    async resolve({ ctx: { prisma }, input: { id, body, title } }) {
      return await prisma.post.update({
        where: {
          id,
        },
        data: {
          title,
          body,
        },
      });
    },
  });
