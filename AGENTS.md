# AI Agent Instructions — TaylorDB Full-Stack Template

## Architecture Overview

```
HTTP Request (with app_access_token cookie or Authorization bearer fallback)
  ↓
Express + tRPC (apps/server/index.ts, apps/server/trpc.ts)
  ↓
Routers (apps/server/routers/) — tRPC procedures using ctx.queryBuilder directly
  ↓
tRPC Client (apps/client/src/lib/trpc.ts)
  ↓
React Pages (apps/client/src/pages/) — consume via tRPC React Query hooks
```

---

## Critical Files — Read in This Order

1. **[apps/server/taylordb/types.ts](apps/server/taylordb/types.ts)** — Generated `taylorSchema` runtime metadata and `TaylorDatabase` type. Never edit by hand.
2. **[apps/server/trpc.ts](apps/server/trpc.ts)** — Creates the per-request `ctx.queryBuilder` using `createQueryBuilder<TaylorDatabase>()`.
3. **[apps/server/routers/](apps/server/routers/)** — tRPC procedures. Call `ctx.queryBuilder` directly here.
4. **[apps/client/src/lib/trpc.ts](apps/client/src/lib/trpc.ts)** — tRPC client setup. Sends cookies with `credentials: "include"`.

Do NOT read `apps/server/taylordb/query-builder.ts` — it does not exist as a source file. The query builder is an npm package (`@taylordb/query-builder`).

---

## Authentication & Cookies

**TaylorDB login flow sets an `app_access_token` cookie.** This cookie is:
- An `HttpOnly` cookie (safe from XSS)
- Automatically sent on every request because:
  - Server has `credentials: true` in CORS
  - tRPC client has `credentials: "include"` on both links
  - Browser sends cookies on same-site and cross-origin requests

**In `apps/server/trpc.ts`:**
```typescript
const appAccessToken =
  req.cookies?.app_access_token ||
  req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();

if (!appAccessToken) throw new Error("Unauthorized");
// Use token to create per-request queryBuilder
```

The Authorization header fallback supports environments where cookies are blocked in cross-origin iframes.

**You do not add auth guards to individual procedures.** The context factory throws before any procedure runs, so all procedures are automatically protected.

---

## Context (ctx)

Every tRPC request gets a fresh context containing `ctx.queryBuilder`. Use `ctx.queryBuilder` directly within router procedures for database reads, writes, uploads, transactions, and `ctx.queryBuilder.auth.getUser()`.

---

## File Organization — Where to Put What

| What | Where |
|---|---|
| Database read/write endpoint | `apps/server/routers/[domain].ts` — use `ctx.queryBuilder` directly |
| Shared domain helper, if needed | Add a small module near the router, and pass `ctx.queryBuilder` into it |
| Wire new router to app | `apps/server/router.ts` + `apps/server/routers/index.ts` |
| React page (dashboard, form, etc.) | `apps/client/src/pages/[Name]Page.tsx` |
| Reusable UI component | `apps/client/src/components/[name].tsx` |
| shadcn/ui component | Install with `pnpm dlx shadcn@latest add [component]`, auto-placed in `apps/client/src/components/ui/` |
| Design tokens (colors, spacing, etc.) | `apps/client/src/index.css` |
| Database schema (generated) | `apps/server/taylordb/types.ts` — DO NOT EDIT |

---

## Adding a New Domain (Step-by-Step)

### 1. Confirm the Table Exists

Check `apps/server/taylordb/types.ts` for the table and field names before writing queries. The generated file exports `taylorSchema` and:

```typescript
export type TaylorDatabase = InferTaylorDatabase<typeof taylorSchema>;
```

Only query tables that exist in `TaylorDatabase`; otherwise TypeScript will fail the build.

### 2. Create Router File

**File:** `apps/server/routers/projects.ts`

```typescript
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const projectIdInput = z.object({ id: z.number() });

export const projectsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.queryBuilder
      .selectFrom("projects")
      .select(["id", "name", "status"])
      .orderBy("name", "asc")
      .execute();
  }),

  getById: publicProcedure
    .input(projectIdInput)
    .query(({ input, ctx }) => {
      return ctx.queryBuilder
        .selectFrom("projects")
        .select(["id", "name", "status"])
        .where("id", "=", input.id)
        .executeTakeFirst(); // returns the record or null
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), status: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.queryBuilder
        .insertInto("projects")
        .values(input)
        .returning(["id", "name", "status"])
        .executeTakeFirst(); // returns the inserted record or null
    }),

  delete: publicProcedure
    .input(projectIdInput)
    .mutation(({ input, ctx }) => {
      return ctx.queryBuilder
        .deleteFrom("projects")
        .where("id", "=", input.id)
        .execute();
    }),
});
```

### 3. Export from Router Index

**File:** `apps/server/routers/index.ts`

```typescript
export { projectsRouter } from "./projects";
```

### 4. Wire to App Router

**File:** `apps/server/router.ts`

```typescript
import { projectsRouter } from "./routers";

export const appRouter = router({
  // ... existing
  projects: projectsRouter,
});
```

### Optional: Type Reusable Payloads

When payloads cross function boundaries, use the helper types exported by `@taylordb/query-builder`:

```typescript
import type { Insertable, Updatable } from "@taylordb/query-builder";
import type { TaylorDatabase } from "../taylordb/types";

type ProjectInsert = Insertable<TaylorDatabase["projects"]>;
type ProjectUpdate = Updatable<TaylorDatabase["projects"]>;
```

---

## File Uploads (FormData + Multipart)

Attachment uploads are a two-step process: upload files, then write the returned `Attachment[]` to an attachment field.

```typescript
upload: publicProcedure
  .input(z.instanceof(FormData))
  .mutation(async ({ input, ctx }) => {
    const file = input.get("avatar") as File | null;
    const name = input.get("name") as string;

    const attachments = file
      ? await ctx.queryBuilder.uploadAttachments([
          { file, name: file.name }
        ])
      : [];

    return ctx.queryBuilder
      .insertInto("users")
      .values({ name, avatar: attachments })
      .returning(["id", "name"])
      .executeTakeFirst();
  }),
```

Client-side: use `FormData` + the splitLink in `trpc.ts` routes FormData through `httpLink` (no batching).

---

## Client-Side Data Fetching

### Queries (Reads)

```typescript
const { data, isLoading, error } = trpc.projects.getAll.useQuery();

// With input
const { data } = trpc.projects.getById.useQuery({ id: 42 });
```

### Mutations (Writes)

```typescript
const createMutation = trpc.projects.create.useMutation({
  onSuccess: () => {
    // Re-fetch list after create
    utils.projects.getAll.invalidate();
  },
});

createMutation.mutate({ name: "New Project", status: "active" });
```

---

## UI Components

- Use **shadcn/ui only**. No hand-rolled primitives.
- Install: `pnpm dlx shadcn@latest add [component-name]`
- Design tokens in `apps/client/src/index.css` (HSL colors, spacing, typography)

See:
- `docs/SHADCN_COMPONENTS_GUIDE.md` — index of all components
- `docs/SHADCN_INSTALLATION.md` — install commands by category
- `docs/SHADCN_DASHBOARD_PATTERNS.md` — 10 copy-paste patterns (tables, dialogs, forms, etc.)

---

## Database Query Patterns

For detailed query builder reference, you MUST read the documentation provided inside the package:
`apps/server/node_modules/@taylordb/query-builder/llm.txt`

This file is the entrypoint to understanding the query builder. Always consult `apps/server/node_modules/@taylordb/query-builder/llm.txt` and the `docs/` folder next to it when you need to understand how to interact with the database.

**IMPORTANT:** Always check for an `llm.txt` file when interacting with ANY package starting with `@taylordb/`. All `@taylordb/` packages expose an `llm.txt` in their root which acts as the official documentation. You MUST read it before using the package.

Key query-builder rules from the current package:

- Use `Insertable<TaylorDatabase["table"]>` and `Updatable<TaylorDatabase["table"]>` for reusable insert/update payload types.
- `insertInto().values()` returns `{ id: number }` by default; call `.returning([...])` when the caller needs more fields.
- `executeTakeFirst()` returns the first record or `null`.
- Attachment fields expect `Attachment[]` values from `ctx.queryBuilder.uploadAttachments()`.
- Link fields accept `number[]` on insert, and `number[]` or `{ newIds, deletedIds }` on update.
- Date equality filters can use named shorthands such as `"today"` or tuples such as `["exactDay", "YYYY-MM-DD"]`.

---

## Critical Rules

1. **NEVER add new production in-memory stores.** Use `ctx.queryBuilder`; the shipped demo routers are temporary schema-agnostic examples only.
2. **NEVER edit `apps/server/taylordb/types.ts`.** It is auto-generated.
3. **NEVER add per-procedure auth.** Auth is centralized in `createContext`.
4. **NEVER start, stop, or manage the server process manually.** The application is strictly managed by a root `pm2` process. You are operating as an unprivileged `taylordb` user. If you need to restart the server, you MUST use the `dev-server-restart` tool. Do not run `npm start`, `pm2 restart`, `node index.js`, or similar commands.
5. **ALWAYS run `pnpm build`** to verify TypeScript before declaring work done.
6. **ALWAYS use `executeTakeFirst()`** for single-record queries, `execute()` for lists.
7. **ALWAYS use `["exactDay", "YYYY-MM-DD"]`** format for date equality filters.
8. **ALWAYS handle `null`** from `executeTakeFirst()` — it can return null.
9. **ALWAYS use shadcn/ui** for UI components, not hand-rolled HTML.
10. **ALWAYS use `Insertable<TaylorDatabase["table"]>` / `Updatable<TaylorDatabase["table"]>`** for reusable insert/update parameters.

---

## Success Criteria

- `pnpm build` passes with zero TypeScript errors
- `pnpm lint` passes with zero errors
- All tRPC procedures use `ctx.queryBuilder`
- New database-backed features do not add in-memory stores
- UI uses shadcn/ui components with proper loading/error states
