import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const usersRouter = router({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.repositories.users.getAll()
  ),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) =>
      ctx.repositories.users.getById(input.id)
    ),

  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(({ input, ctx }) =>
      ctx.repositories.users.create(input)
    ),

  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string(), email: z.string().email() }))
    .mutation(({ input, ctx }) =>
      ctx.repositories.users.update(input.id, { name: input.name, email: input.email })
    ),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) =>
      ctx.repositories.users.delete(input.id)
    ),
});
