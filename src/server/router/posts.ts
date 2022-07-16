import { createRouter } from './context';
import { z } from 'zod';
import { resolve } from 'path';
import { prisma } from '../db/client';

export const postsRouter = createRouter().mutation('create-post', {
  input: z.object({
    userID: z.string(),
    postBody: z.string(),
  }),
  async resolve({ input }) {
    return await prisma.post.create({
      data: input,
    });
  },
})
.query('get-all-posts',{
  async resolve() {
    return await prisma.post.findMany();
  },
})
;
