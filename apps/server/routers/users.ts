import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// In-memory demo implementation: see docs/examples.md

export const usersRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.queryBuilder
      .selectFrom("users")
      .select(["id", "name", "email", "createdAt"])
      .orderBy("createdAt", "desc")
      .execute();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.queryBuilder
        .selectFrom("users")
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),

  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.queryBuilder.insertInto("users").values(input).executeTakeFirst();
    }),

  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.queryBuilder
        .update("users")
        .set({ name: input.name, email: input.email })
        .where("id", "=", input.id)
        .execute();
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.queryBuilder.deleteFrom("users").where("id", "=", input.id).execute();
    }),
});
