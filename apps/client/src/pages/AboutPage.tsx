import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">About this starter</h1>
        <p className="text-muted-foreground">
          This project now ships with React Router v6, Tailwind CSS, and a
          shadcn/ui component baseline so you can focus on building TaylorDB
          experiences instead of wiring up UI plumbing.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-medium">Routing</h2>
          <p className="text-sm text-muted-foreground">
            Use nested routes with layouts via <code>createBrowserRouter</code>{" "}
            and <code>Outlet</code>. Add pages in <code>src/pages</code> and
            register them in the router.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-medium">UI primitives</h2>
          <p className="text-sm text-muted-foreground">
            The shared <code>Button</code> uses shadcn/ui patterns and can be
            extended with more components via the CLI using{" "}
            <code>components.json</code>.
          </p>
        </div>
      </div>

      <Button variant="link" asChild>
        <a
          href="https://www.npmjs.com/package/@taylordb/query-builder"
          target="_blank"
          rel="noreferrer"
        >
          Explore TaylorDB Query Builder <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </section>
  );
};

export default AboutPage;
