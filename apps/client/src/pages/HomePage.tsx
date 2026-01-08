import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <section className="grid gap-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Welcome
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Build your TaylorDB UI with React Router + shadcn/ui
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Routing, Tailwind, and shadcn/ui are wired up. Start connecting
          components to your TaylorDB data using the generated client and types.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm animate-in fade-in">
        <p className="text-sm font-medium text-foreground">
          Animation check: this card fades in using{" "}
          <code>animate-in fade-in</code> from <code>tw-animate-css</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          If you see a smooth fade on load, the plugin is wired correctly.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/about">
            Learn more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://ui.shadcn.com/docs" target="_blank" rel="noreferrer">
            shadcn/ui docs
          </a>
        </Button>
        <Button variant="ghost" asChild>
          <a
            href="https://reactrouter.com/en/main"
            target="_blank"
            rel="noreferrer"
          >
            React Router docs
          </a>
        </Button>
      </div>
    </section>
  );
};

export default HomePage;
