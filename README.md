# TaylorDB React Starter

React + Vite starter with Tailwind CSS (v4), React Router v6, and shadcn/ui wired up for building custom UIs on TaylorDB.

## What's included
- React Router layout with sample pages (`/`, `/about`, fallback `*`)
- Tailwind v4 configured for shadcn (design tokens, dark mode, animations)
- shadcn/ui baseline components: `button`, `card`, `input`, `label`, `textarea`, `select`, `tabs`, `alert`
- Path aliases via `@` (`@/components`, `@/lib`, etc.)

## Getting started
```bash
pnpm install
pnpm dev
```

## Using the shadcn CLI
The project is already initialized with `components.json`. Add more components with:
```bash
pnpm dlx shadcn@latest add <component>
```
Examples:
```bash
pnpm dlx shadcn@latest add dialog dropdown-menu table
```
Generated files go into `src/components/ui/` and use the shared Tailwind tokens in `src/index.css`.

### Available components
- Layout/structure: `card`, `tabs`
- Form controls: `input`, `label`, `textarea`, `select`
- Feedback: `alert`
- Buttons: `button`

## TaylorDB integration
Use the generated TaylorDB client and types (expected in `src/lib/taylordb.client.ts` and `src/lib/taylordb.types.ts`) to query data directly. Do not use mock data.

## Scripts
- `pnpm dev` — run Vite dev server (HMR)
- `pnpm build` — type-check + build
- `pnpm lint` — ESLint (strict, no `any`)

## Notes
- Tailwind 4 uses `@tailwindcss/vite`; CSS entry is `@import "tailwindcss";` in `src/index.css`.
- Tailwind config is in `tailwind.config.js`; CSS tokens live in `src/index.css`.
- Components use `@/lib/utils` for the `cn` helper (clsx + tailwind-merge).
