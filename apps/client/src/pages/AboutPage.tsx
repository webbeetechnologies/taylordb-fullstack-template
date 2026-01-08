import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">About This Template</h1>
        <p className="text-muted-foreground">
          This is a full-stack template for building modern web applications
          with TaylorDB. It includes React + Vite frontend, Node.js + tRPC
          backend, and shadcn/ui components.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-2">Type-Safe APIs</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Full end-to-end type safety from database to UI using tRPC and
            TypeScript. Auto-generated types from your TaylorDB schema.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/trpc-demo">View Demo</Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-2">Modern UI</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Built with shadcn/ui and Tailwind CSS. Responsive, accessible, and
            customizable components with dark mode support.
          </p>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://ui.shadcn.com/docs"
              target="_blank"
              rel="noreferrer"
            >
              View Components <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Documentation</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            📘 <code className="font-mono">AGENTS.md</code> - AI agent
            instructions and development workflow
          </li>
          <li>
            📗{" "}
            <code className="font-mono">docs/TAYLORDB_QUERY_REFERENCE.md</code>{" "}
            - Complete query builder examples
          </li>
          <li>
            📙{" "}
            <code className="font-mono">docs/SHADCN_COMPONENTS_GUIDE.md</code> -
            UI component patterns for dashboards
          </li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <a
            href="https://www.npmjs.com/package/@taylordb/query-builder"
            target="_blank"
            rel="noreferrer"
          >
            TaylorDB Query Builder <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://trpc.io" target="_blank" rel="noreferrer">
            tRPC Docs <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default AboutPage;
