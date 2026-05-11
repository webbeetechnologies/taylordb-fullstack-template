import { createQueryBuilder } from "@taylordb/query-builder";
import type {
  TaylorDatabase,
  TableInserts,
  TableUpdates,
} from "../taylordb/types";

type QB = ReturnType<typeof createQueryBuilder<TaylorDatabase>>;

// ----------------------------------------------------------------------
// In-Memory Data Store (For template demo purposes)
// Once you connect a real TaylorDB, you can remove this and uncomment
// the actual query builder methods below.
// ----------------------------------------------------------------------
let usersMemory = [
  { id: 1, name: "Alice", email: "alice@example.com", createdAt: new Date().toISOString() },
  { id: 2, name: "Bob", email: "bob@example.com", createdAt: new Date().toISOString() }
];

let postsMemory = [
  { id: 1, title: "Hello World", content: "This is my first post!", published: true, createdAt: new Date().toISOString() },
  { id: 2, title: "Draft Post", content: "Still working on this...", published: false, createdAt: new Date().toISOString() }
];
let nextUserId = 3;
let nextPostId = 3;
// ----------------------------------------------------------------------

export function createUsersRepository(_qb: QB) {
  return {
    getAll: async () => {
      return [...usersMemory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Actual implementation:
      // return qb
      //   .selectFrom("users")
      //   .select(["id", "name", "email", "createdAt"])
      //   .orderBy("createdAt", "desc")
      //   .execute();
    },

    getById: async (id: number) => {
      return usersMemory.find(u => u.id === id);
      
      // Actual implementation:
      // return qb.selectFrom("users").where("id", "=", id).executeTakeFirst();
    },

    create: async (data: Partial<TableInserts<"users">>) => {
      const newUser = { 
        id: nextUserId++, 
        name: data.name || "", 
        email: data.email || "", 
        createdAt: new Date().toISOString() 
      };
      usersMemory.push(newUser);
      return newUser;
      
      // Actual implementation:
      // return qb.insertInto("users").values(data).executeTakeFirst();
    },

    update: async (id: number, data: Partial<TableUpdates<"users">>) => {
      const index = usersMemory.findIndex(u => u.id === id);
      if (index !== -1) {
        usersMemory[index] = { ...usersMemory[index], ...data } as any;
      }
      return usersMemory[index];
      
      // Actual implementation:
      // return qb.update("users").set(data).where("id", "=", id).execute();
    },

    delete: async (id: number) => {
      usersMemory = usersMemory.filter(u => u.id !== id);
      return true;
      
      // Actual implementation:
      // return qb.deleteFrom("users").where("id", "=", id).execute();
    },
  };
}

export function createPostsRepository(_qb: QB) {
  return {
    getAll: async () => {
      return [...postsMemory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Actual implementation:
      // return qb
      //   .selectFrom("posts")
      //   .select(["id", "title", "content", "published", "createdAt"])
      //   .orderBy("createdAt", "desc")
      //   .execute();
    },

    getById: async (id: number) => {
      return postsMemory.find(p => p.id === id);
      
      // Actual implementation:
      // return qb.selectFrom("posts").where("id", "=", id).executeTakeFirst();
    },

    create: async (data: Partial<TableInserts<"posts">>) => {
      const newPost = { 
        id: nextPostId++, 
        title: data.title || "", 
        content: data.content || "", 
        published: !!data.published,
        createdAt: new Date().toISOString() 
      };
      postsMemory.push(newPost);
      return newPost;
      
      // Actual implementation:
      // return qb.insertInto("posts").values(data).executeTakeFirst();
    },

    update: async (id: number, data: Partial<TableUpdates<"posts">>) => {
      const index = postsMemory.findIndex(p => p.id === id);
      if (index !== -1) {
        postsMemory[index] = { ...postsMemory[index], ...data } as any;
      }
      return postsMemory[index];
      
      // Actual implementation:
      // return qb.update("posts").set(data).where("id", "=", id).execute();
    },

    delete: async (id: number) => {
      postsMemory = postsMemory.filter(p => p.id !== id);
      return true;
      
      // Actual implementation:
      // return qb.deleteFrom("posts").where("id", "=", id).execute();
    },
  };
}

export function createRepositories(qb: QB) {
  return {
    users: createUsersRepository(qb),
    posts: createPostsRepository(qb),
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
