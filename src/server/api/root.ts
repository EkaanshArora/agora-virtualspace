import { createTRPCRouter } from "./trpc";
import { mainRouter } from "./routers/mainRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  main: mainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
