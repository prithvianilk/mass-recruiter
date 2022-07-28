// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { authRouter } from './auth';
import { placementRouter } from './placement-event';
import { postsRouter } from './posts';
import { dataRouter } from './data';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('auth.', authRouter)
  .merge('placement.', placementRouter)
  .merge('posts.', postsRouter)
  .merge('data.',dataRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
