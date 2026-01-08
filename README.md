# TaylorDB + tRPC Full-Stack Monorepo

A production-ready pnpm monorepo combining React frontend and Express backend with tRPC for type-safe API communication. Built for AI-assisted development platforms.

## 📦 Monorepo Structure

```
taylordb-clientserver-template/
├── pnpm-workspace.yaml          # Workspace configuration
├── package.json                  # @repo/frontend (root)
├── server/
│   ├── package.json             # @repo/server
│   ├── index.ts                 # Express + tRPC server
│   ├── router.ts                # tRPC procedures
│   ├── trpc.ts                  # tRPC configuration
│   └── taylordb/
│       ├── types.ts             # Auto-generated TaylorDB types
│       └── query-builder.ts     # TaylorDB CRUD operations
├── src/                         # React frontend
└── ...
```

## 🚀 Quick Start

```bash
# Install all workspace dependencies
pnpm install

# Run both frontend and backend
pnpm dev:full

# Or run separately
pnpm dev           # Frontend only (port 5173)
pnpm dev:server    # Backend only (port 3001)
```

Visit:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Demo Page**: http://localhost:5173/trpc-demo

## 📚 Workspaces

### @repo/frontend (Root)

The React + Vite frontend application

**Location**: `/` (root directory)

**Tech Stack**:

- React 19 with TypeScript
- Vite 7 for bundling
- TailwindCSS 4 for styling
- shadcn/ui components
- React Router v6
- tRPC React Query client

**Scripts**:

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm lint             # Run ESLint
```

### @repo/server

The Express + tRPC backend API

**Location**: `/server`

**Tech Stack**:

- Express 5 web server
- tRPC 11 for type-safe APIs
- TaylorDB query builder
- Zod for validation
- TypeScript 5

**Scripts**:

```bash
pnpm --filter @repo/server dev      # Start with hot reload
pnpm --filter @repo/server build    # Build TypeScript
pnpm --filter @repo/server start    # Run production build
```

## 🛠️ Available Scripts

### Root Commands (run from anywhere)

```bash
# Development
pnpm dev:full        # Run both workspaces concurrently
pnpm dev             # Frontend only
pnpm dev:server      # Backend only

# Building
pnpm build           # Build frontend
pnpm build:server    # Build backend
pnpm build:all       # Build both

# Other
pnpm lint            # Lint all code
pnpm generate:schema # Generate TaylorDB types
```

### Workspace-Specific Commands

```bash
# Run command in specific workspace
pnpm --filter @repo/frontend <command>
pnpm --filter @repo/server <command>

# Examples
pnpm --filter @repo/server dev
pnpm --filter @repo/frontend build
```

## 🔧 Configuration Files

### pnpm-workspace.yaml

Defines workspace packages:

```yaml
packages:
  - "server"
  - "."
```

### Package Names

- Frontend: `@repo/frontend`
- Backend: `@repo/server`

All packages are marked as `private: true` (not published to npm)

## 📡 API Communication

### tRPC Router Export

The backend exports its router type from `server/router.ts`:

```typescript
export type AppRouter = typeof appRouter;
```

### Frontend tRPC Client

The frontend imports the type for end-to-end type safety:

```typescript
import type { AppRouter } from "../../server/router";
export const trpc = createTRPCReact<AppRouter>();
```

**Note**: This works because both packages are in the same monorepo, allowing direct TypeScript imports without shared packages.

## 🗄️ TaylorDB Integration

### Setup

1. Copy `.env.example` to `.env`
2. Add your TaylorDB credentials:
   ```bash
   TAYLORDB_BASE_URL=your_base_url
   TAYLORDB_BASE_ID=your_base_id
   TAYLORDB_API_KEY=your_api_key
   ```
3. Generate types: `pnpm generate:schema`

### CRUD Operations

50+ type-safe procedures available:

- **Weight Tracking**: Full CRUD + statistics
- **Goals Management**: Create, read, update, delete
- **Strength Workouts**: Exercise logging
- **Cardio Exercises**: Duration, distance, speed tracking
- **Calories/Nutrition**: Daily totals and aggregations
- **Settings**: Key-value configuration

See [TAYLORDB_INTEGRATION.md](file:///Users/thetaung/Desktop/taylordb-clientserver-template/TAYLORDB_INTEGRATION.md) for detailed examples.

## 🏗️ Monorepo Benefits

### For This Project

✅ **Shared Types**: Frontend and backend share TypeScript types directly  
✅ **Single Repository**: One git repo, one pnpm-lock.yaml  
✅ **Coordinated Builds**: Build both projects together  
✅ **Simplified Setup**: One `pnpm install` for everything  
✅ **Workspace Commands**: Target specific packages easily

### Compared to Separate Repos

- ⚡ Faster development (no publishing to npm for type updates)
- 🔒 Type safety guaranteed at development time
- 📝 Simpler dependency management
- 🔄 Atomic commits across frontend and backend

## 📦 Dependency Management

### Installing Dependencies

**For frontend**:

```bash
# From root
pnpm add <package>

# Or explicitly
pnpm --filter @repo/frontend add <package>
```

**For backend**:

```bash
pnpm --filter @repo/server add <package>
```

**For both**:

```bash
pnpm add <package> -w  # Add to root workspace
```

### Workspace Dependencies

Workspaces can depend on each other using `workspace:*`:

```json
{
  "dependencies": {
    "@repo/shared": "workspace:*"
  }
}
```

## 🚢 Deployment

### Option 1: Deploy Separately

- Frontend → Vercel/Netlify (static site from `dist/`)
- Backend → Railway/Render/Fly.io (Node.js app)

Build commands:

```bash
pnpm build           # Frontend
pnpm build:server    # Backend
```

### Option 2: Deploy Together

Serve frontend from backend:

```bash
pnpm build:all       # Build both
# Configure Express to serve frontend static files
```

### Environment Variables

Set these in your deployment platform:

- `TAYLORDB_BASE_URL`
- `TAYLORDB_BASE_ID`
- `TAYLORDB_API_KEY`
- `FRONTEND_URL` (for CORS)
- `VITE_TRPC_URL` (frontend)

## 🎯 Next Steps

1. **Add Shared Package** (optional):

   ```bash
   mkdir packages/shared
   # Create package.json for shared utilities/types
   ```

2. **Add Tests**:

   ```bash
   pnpm --filter @repo/server add -D vitest
   pnpm --filter @repo/frontend add -D vitest
   ```

3. **CI/CD**:
   - Use `pnpm install --frozen-lockfile` in CI
   - Run `pnpm build:all` for deployment
   - Cache `node_modules` and `.pnpm-store`

## 📚 Learn More

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [tRPC Documentation](https://trpc.io)
- [TaylorDB](https://taylordb.io)
- [Monorepo Handbook](https://monorepo.tools)

## 📄 License

MIT - Use freely for any project!

---

**Built with ❤️ for AI-assisted development platforms**
