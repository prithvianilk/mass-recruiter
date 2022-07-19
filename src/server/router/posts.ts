import { createRouter } from './context';
import { z } from 'zod';

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
      return await prisma.post.findMany();
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
