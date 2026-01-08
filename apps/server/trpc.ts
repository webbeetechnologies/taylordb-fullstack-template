import { initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Create context for each tRPC request
 * This is where you can add user session, database clients, etc.
 */
export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
    // Add any shared context here (e.g., database client, user session)
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC instance
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
