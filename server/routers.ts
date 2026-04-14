import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.create({ transformer: superjson });

export const appRouter = t.router({
  healthCheck: t.procedure.query(() => ({ status: 'ok', ts: Date.now() })),
});

export type AppRouter = typeof appRouter;