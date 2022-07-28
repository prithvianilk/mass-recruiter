import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { logger } from '../../server/utils/logger';
import { createRouter } from './context';

export const dataRouter = createRouter()
.mutation('update-mobile-number',{
    input:z.object({
        email:z.string(),
        mobileNumber:z.string()
    }),
    async resolve({ ctx: { prisma }, input} ){
        const updateUser = await prisma.user.update({
            where: {
              email: input.email,
            },
            data: {
              mobileNumber: input.mobileNumber,
            },
          })
        return {
            "Message":"Updation Successful"
        }
    }
})