import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const postsRouter = router({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.repositories.posts.getAll()
  ),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) =>
      ctx.repositories.posts.getById(input.id)
    ),

  create: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(({ input, ctx }) =>
      ctx.repositories.posts.create({ ...input, published: false })
    ),
    
  publish: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) =>
      ctx.repositories.posts.update(input.id, { published: true })
    ),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) =>
      ctx.repositories.posts.delete(input.id)
    ),
});
