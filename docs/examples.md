# Router Examples

## Why the Template Uses Schema-Agnostic Demos

On first boot, TaylorDB regenerates `apps/server/taylordb/types.ts` from **your** base schema (`taylordb.yml` → `taylordb.types`). The tables in that file depend on what you created in TaylorDB — they may not include `users` or `posts`.

If router code calls `ctx.queryBuilder.selectFrom("posts")` when `"posts"` is not in your generated types, TypeScript fails at build time and tRPC return types break on the client too.

The shipped `users` and `posts` routers use **in-memory demo stores** so the template builds on any schema. Do not copy that pattern into production features. When your base has matching tables, replace the demo bodies with TaylorDB query-builder calls like the snippets below.

For the full query-builder reference, read:

- `apps/server/node_modules/@taylordb/query-builder/llm.txt`
- The package docs in `apps/server/node_modules/@taylordb/query-builder/docs/`

## Current Query Builder Notes

- `ctx.queryBuilder` is created per request in `apps/server/trpc.ts` with `createQueryBuilder<TaylorDatabase>()`.
- `execute()` returns an array for list queries.
- `executeTakeFirst()` returns the first result or `null`.
- `insertInto().values()` returns `{ id: number }` by default; use `.returning([...])` when you need additional fields.
- Attachment fields accept an `Attachment[]` from `ctx.queryBuilder.uploadAttachments()`.
- Link fields accept `number[]` on insert.

## TaylorDB implementations

Copy these into `apps/server/routers/posts.ts` / `users.ts` once the tables exist in `apps/server/taylordb/types.ts`.

### Posts router (TaylorDB)

```typescript
export const postsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.queryBuilder
      .selectFrom("posts")
      .select(["id", "title", "content", "published", "createdAt"])
      .orderBy("createdAt", "desc")
      .execute();
  }),

  getById: publicProcedure.input(postIdInput).query(async ({ input, ctx }) => {
    return await ctx.queryBuilder
      .selectFrom("posts")
      .select(["id", "title", "content", "published", "createdAt"])
      .where("id", "=", input.id)
      .executeTakeFirst();
  }),

  create: publicProcedure.input(createPostInput).mutation(async ({ input, ctx }) => {
    return await ctx.queryBuilder
      .insertInto("posts")
      .values({ ...input, published: false })
      .returning(["id", "title", "content", "published", "createdAt"])
      .executeTakeFirst();
  }),

  publish: publicProcedure.input(postIdInput).mutation(async ({ input, ctx }) => {
    return await ctx.queryBuilder.update("posts").set({ published: true }).where("id", "=", input.id).execute();
  }),

  delete: publicProcedure.input(postIdInput).mutation(async ({ input, ctx }) => {
    return await ctx.queryBuilder.deleteFrom("posts").where("id", "=", input.id).execute();
  }),
});
```

### Users router (TaylorDB)

```typescript
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
        .select(["id", "name", "email", "createdAt"])
        .where("id", "=", input.id)
        .executeTakeFirst();
    }),

  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.queryBuilder
        .insertInto("users")
        .values(input)
        .returning(["id", "name", "email", "createdAt"])
        .executeTakeFirst();
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
```

## In-memory reference (current default)

Below is the in-memory implementation shipped in the router files.

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
