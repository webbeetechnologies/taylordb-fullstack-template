import type { Repositories } from "../repositories/index";

export function createUsersService(repos: Repositories) {
  return {
    getAll: () => repos.users.getAll(),
    create: (data: Parameters<Repositories["users"]["create"]>[0]) =>
      repos.users.create(data),
    delete: (id: number) => repos.users.delete(id),
  };
}

export function createServices(repos: Repositories) {
  return {
    users: createUsersService(repos),
  };
}

export type Services = ReturnType<typeof createServices>;
