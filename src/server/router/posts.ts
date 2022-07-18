import { createRouter } from './context';
import { z } from 'zod';

export const postsRouter = createRouter()
  .mutation('create-post', {
    input: z.object({
      userId: z.string(),
      postBody: z.string(),
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
      postId: z.string(),
      postBody: z.string(),
    }),
    async resolve({ ctx: { prisma }, input: { postId, postBody } }) {
      return await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          postBody: postBody,
        },
      });
    },
  });
