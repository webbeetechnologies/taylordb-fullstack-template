import { z } from "zod";
import { router, publicProcedure } from "../trpc";

/**
 * Users Router
 *
 * Example sub-router demonstrating CRUD operations.
 * Replace with your actual taylordb implementation.
 */

// In-memory store for demonstration
const users: { id: number; name: string; email: string; createdAt: Date }[] = [
  { id: 1, name: "Alice", email: "alice@example.com", createdAt: new Date() },
  { id: 2, name: "Bob", email: "bob@example.com", createdAt: new Date() },
];
let nextId = 3;

export const usersRouter = router({
  getAll: publicProcedure.query(() => {
    return users;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) throw new Error("User not found");
      return user;
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(({ input }) => {
      const newUser = {
        id: nextId++,
        name: input.name,
        email: input.email,
        createdAt: new Date(),
      };
      users.push(newUser);
      return newUser;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(({ input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) throw new Error("User not found");

      if (input.name) user.name = input.name;
      if (input.email) user.email = input.email;
      return user;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const index = users.findIndex((u) => u.id === input.id);
      if (index === -1) throw new Error("User not found");

      const [deleted] = users.splice(index, 1);
      return deleted;
    }),
});
