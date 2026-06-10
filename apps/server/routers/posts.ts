import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// In-memory demo implementation: see docs/examples.md

const postIdInput = z.object({ id: z.number() });
const createPostInput = z.object({ title: z.string(), content: z.string() });

export const postsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.queryBuilder
      .selectFrom("posts")
      .select(["id", "title", "content", "published", "createdAt"])
      .orderBy("createdAt", "desc")
      .execute();
  }),

  getById: publicProcedure
    .input(postIdInput)
    .query(async ({ input, ctx }) => {
      return await ctx.queryBuilder
        .selectFrom("posts")
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),

  create: publicProcedure
    .input(createPostInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.queryBuilder
        .insertInto("posts")
        .values({ ...input, published: false })
        .executeTakeFirst();
    }),

  publish: publicProcedure
    .input(postIdInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.queryBuilder
        .update("posts")
        .set({ published: true })
        .where("id", "=", input.id)
        .execute();
    }),

  delete: publicProcedure
    .input(postIdInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.queryBuilder
        .deleteFrom("posts")
        .where("id", "=", input.id)
        .execute();
    }),
});
