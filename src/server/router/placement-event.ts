import { createRouter } from './context';
import { prisma } from '../db/client';

export const placementRouter = createRouter().query(
  'get-placement-upcoming-events',
  {
    async resolve() {
      return await prisma.placementEvent.findMany();
    },
  }
)

