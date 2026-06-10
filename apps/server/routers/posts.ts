import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// ----------------------------------------------------------------------
// In-memory demo — works on any TaylorDB schema without type errors.
// types.ts is regenerated from YOUR base on first boot, so do not query
// table names here unless they exist in your schema.
// TaylorDB implementation: see docs/examples.md
// ----------------------------------------------------------------------

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

    // TaylorDB (uncomment when "posts" exists in taylordb/types.ts):
    // return await ctx.queryBuilder
    //   .selectFrom("posts")
    //   .select(["id", "title", "content", "published", "createdAt"])
    //   .orderBy("createdAt", "desc")
    //   .execute();
  }),

  getById: publicProcedure.input(postIdInput).query(async ({ input }) => {
    return postsMemory.find((p) => p.id === input.id);

    // TaylorDB:
    // return await ctx.queryBuilder.selectFrom("posts").where("id", "=", input.id).executeTakeFirst();
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

    // TaylorDB:
    // return await ctx.queryBuilder.insertInto("posts").values({ ...input, published: false }).executeTakeFirst();
  }),

  publish: publicProcedure.input(postIdInput).mutation(async ({ input }) => {
    const index = postsMemory.findIndex((p) => p.id === input.id);
    if (index !== -1) {
      postsMemory[index] = { ...postsMemory[index], published: true };
    }
    return postsMemory[index];

    // TaylorDB:
    // return await ctx.queryBuilder.update("posts").set({ published: true }).where("id", "=", input.id).execute();
  }),

  delete: publicProcedure.input(postIdInput).mutation(async ({ input }) => {
    postsMemory = postsMemory.filter((p) => p.id !== input.id);
    return true;

    // TaylorDB:
    // return await ctx.queryBuilder.deleteFrom("posts").where("id", "=", input.id).execute();
  }),
});
