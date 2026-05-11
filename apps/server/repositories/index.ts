import { createQueryBuilder } from "@taylordb/query-builder";
import type {
  TaylorDatabase,
  TableInserts,
  TableUpdates,
} from "../taylordb/types";

type QB = ReturnType<typeof createQueryBuilder<TaylorDatabase>>;

export function createUsersRepository(qb: QB) {
  return {
    getAll: () =>
      qb
        .selectFrom("users")
        .select(["id", "name", "email", "createdAt"])
        .orderBy("createdAt", "desc")
        .execute(),

    getById: (id: number) =>
      qb.selectFrom("users").where("id", "=", id).executeTakeFirst(),

    create: (data: Partial<TableInserts<"users">>) =>
      qb.insertInto("users").values(data).executeTakeFirst(),

    update: (id: number, data: Partial<TableUpdates<"users">>) =>
      qb.update("users").set(data).where("id", "=", id).execute(),

    delete: (id: number) =>
      qb.deleteFrom("users").where("id", "=", id).execute(),
  };
}

export function createPostsRepository(qb: QB) {
  return {
    getAll: () =>
      qb
        .selectFrom("posts")
        .select(["id", "title", "content", "published", "createdAt"])
        .orderBy("createdAt", "desc")
        .execute(),

    getById: (id: number) =>
      qb.selectFrom("posts").where("id", "=", id).executeTakeFirst(),

    create: (data: Partial<TableInserts<"posts">>) =>
      qb.insertInto("posts").values(data).executeTakeFirst(),

    update: (id: number, data: Partial<TableUpdates<"posts">>) =>
      qb.update("posts").set(data).where("id", "=", id).execute(),

    delete: (id: number) =>
      qb.deleteFrom("posts").where("id", "=", id).execute(),
  };
}

export function createRepositories(qb: QB) {
  return {
    users: createUsersRepository(qb),
    posts: createPostsRepository(qb),
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
