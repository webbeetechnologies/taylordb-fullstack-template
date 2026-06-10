# Router Examples (In-Memory Demo)

The demo UI components under `apps/client/src/components/demo/examples/` were originally backed by in-memory stores in the router files. Production routers should use `ctx.queryBuilder` instead.

Below is the reference implementation if you want a local-only demo without TaylorDB.

## Posts Router (in-memory)

```typescript
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

type ExamplePost = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
};

let postsMemory: ExamplePost[] = [
  { id: 1, title: "Hello World", content: "This is my first post!", published: true, createdAt: new Date().toISOString() },
  { id: 2, title: "Draft Post", content: "Still working on this...", published: false, createdAt: new Date().toISOString() },
];
let nextPostId = 3;

const postIdInput = z.object({ id: z.number() });
const createPostInput = z.object({ title: z.string(), content: z.string() });

export const postsRouter = router({
  getAll: publicProcedure.query(async () => {
    return [...postsMemory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }),

  getById: publicProcedure.input(postIdInput).query(async ({ input }) => {
    return postsMemory.find((p) => p.id === input.id);
  }),

  create: publicProcedure.input(createPostInput).mutation(async ({ input }) => {
    const newPost: ExamplePost = {
      id: nextPostId++,
      title: input.title,
      content: input.content,
      published: false,
      createdAt: new Date().toISOString(),
    };
    postsMemory.push(newPost);
    return newPost;
  }),

  publish: publicProcedure.input(postIdInput).mutation(async ({ input }) => {
    const index = postsMemory.findIndex((p) => p.id === input.id);
    if (index !== -1) {
      postsMemory[index] = { ...postsMemory[index], published: true };
    }
    return postsMemory[index];
  }),

  delete: publicProcedure.input(postIdInput).mutation(async ({ input }) => {
    postsMemory = postsMemory.filter((p) => p.id !== input.id);
    return true;
  }),
});
```

## Users Router (in-memory)

```typescript
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

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
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => usersMemory.find((u) => u.id === input.id)),

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
    }),

  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      const index = usersMemory.findIndex((u) => u.id === input.id);
      if (index !== -1) {
        usersMemory[index] = { ...usersMemory[index], name: input.name, email: input.email };
      }
      return usersMemory[index];
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      usersMemory = usersMemory.filter((u) => u.id !== input.id);
      return true;
    }),
});
```
