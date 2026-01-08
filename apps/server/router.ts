import { z } from "zod";
import { router, publicProcedure } from "./trpc";
// import * as db from "./taylordb/query-builder";

/**
 * Main tRPC Router
 *
 * This is your main API router. Define all your procedures here.
 * Group related procedures together for better organization.
 *
 * Example structure:
 *
 * export const appRouter = router({
 *   users: {
 *     getAll: publicProcedure.query(async () => { ... }),
 *     getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => { ... }),
 *     create: publicProcedure.input(z.object({ ... })).mutation(async ({ input }) => { ... }),
 *     update: publicProcedure.input(z.object({ ... })).mutation(async ({ input }) => { ... }),
 *     delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => { ... }),
 *   },
 *   posts: {
 *     // ...
 *   },
 * });
 */

export const appRouter = router({
  // ============================================================================
  // Example / Test Procedures
  // ============================================================================

  hello: publicProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      return {
        message: `Hello ${input?.name ?? "World"}!`,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }),

  // ============================================================================
  // Your API Procedures
  // ============================================================================
  //
  // Add your procedures here following this pattern:
  //
  // tableName: {
  //   getAll: publicProcedure.query(async () => {
  //     return await db.getAllRecords();
  //   }),
  //
  //   getById: publicProcedure
  //     .input(z.object({ id: z.number() }))
  //     .query(async ({ input }) => {
  //       return await db.getRecordById(input.id);
  //     }),
  //
  //   create: publicProcedure
  //     .input(z.object({
  //       name: z.string().min(1),
  //       status: z.string()
  //     }))
  //     .mutation(async ({ input }) => {
  //       return await db.createRecord(input);
  //     }),
  //
  //   update: publicProcedure
  //     .input(z.object({
  //       id: z.number(),
  //       name: z.string().optional(),
  //       status: z.string().optional()
  //     }))
  //     .mutation(async ({ input }) => {
  //       const { id, ...data } = input;
  //       return await db.updateRecord(id, data);
  //     }),
  //
  //   delete: publicProcedure
  //     .input(z.object({ id: z.number() }))
  //     .mutation(async ({ input }) => {
  //       return await db.deleteRecord(input.id);
  //     }),
  // },
});

// Export type definition of API
export type AppRouter = typeof appRouter;

/**
 * ============================================================================
 * tRPC Quick Reference
 * ============================================================================
 *
 * QUERIES (for reading data):
 * - Use .query() for operations that don't modify data
 * - Example: getAll, getById, search, etc.
 *
 * MUTATIONS (for writing data):
 * - Use .mutation() for operations that create, update, or delete data
 * - Example: create, update, delete
 *
 * INPUT VALIDATION:
 * - Use .input() with Zod schemas to validate input
 * - Example: .input(z.object({ id: z.number(), name: z.string() }))
 *
 * ACCESSING INPUT:
 * - Access validated input via { input } destructuring
 * - Example: .query(async ({ input }) => { ... })
 *
 * ORGANIZATION:
 * - Group related procedures under a namespace
 * - Example: users.getAll, users.create, posts.getAll, etc.
 *
 * ERROR HANDLING:
 * - Throw errors from procedures, tRPC will handle them
 * - Example: throw new Error("User not found");
 *
 * For comprehensive examples, see the example implementation or docs.
 */
