import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// ----------------------------------------------------------------------
// In-memory demo — works on any TaylorDB schema without type errors.
// types.ts is regenerated from YOUR base on first boot, so do not query
// table names here unless they exist in your schema.
// TaylorDB implementation: see docs/examples.md
// ----------------------------------------------------------------------

type ExampleUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

let usersMemory: ExampleUser[] = [
  { id: 1, name: "Alice", email: "alice@example.com", createdAt: new Date().toISOString() },
  { id: 2, name: "Bob", email: "bob@example.com", createdAt: new Date().toISOString() },
];
let nextUserId = 3;

export const usersRouter = router({
  getAll: publicProcedure.query(async () => {
    return [...usersMemory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // TaylorDB (uncomment when "users" exists in taylordb/types.ts):
    // return await ctx.queryBuilder
    //   .selectFrom("users")
    //   .select(["id", "name", "email", "createdAt"])
    //   .orderBy("createdAt", "desc")
    //   .execute();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => usersMemory.find((u) => u.id === input.id)),

    // TaylorDB:
    // return await ctx.queryBuilder.selectFrom("users").where("id", "=", input.id).executeTakeFirst();

  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      const newUser: ExampleUser = {
        id: nextUserId++,
        name: input.name,
        email: input.email,
        createdAt: new Date().toISOString(),
      };
      usersMemory.push(newUser);
      return newUser;

      // TaylorDB:
      // return await ctx.queryBuilder.insertInto("users").values(input).executeTakeFirst();
    }),

  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      const index = usersMemory.findIndex((u) => u.id === input.id);
      if (index !== -1) {
        usersMemory[index] = { ...usersMemory[index], name: input.name, email: input.email };
      }
      return usersMemory[index];

      // TaylorDB:
      // return await ctx.queryBuilder.update("users").set({ name: input.name, email: input.email }).where("id", "=", input.id).execute();
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      usersMemory = usersMemory.filter((u) => u.id !== input.id);
      return true;

      // TaylorDB:
      // return await ctx.queryBuilder.deleteFrom("users").where("id", "=", input.id).execute();
    }),
});
