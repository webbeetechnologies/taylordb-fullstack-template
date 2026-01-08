import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";

export default function TRPCDemoPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">tRPC + TaylorDB Demo</h1>
        <p className="text-muted-foreground">
          Example of type-safe API calls with tRPC
        </p>
      </div>

      <div className="grid gap-6">
        {/* Info Alert */}
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Template Example</AlertTitle>
          <AlertDescription>
            This page demonstrates a simple tRPC query. Replace this with your
            own queries based on your TaylorDB schema. See{" "}
            <code className="font-mono text-sm">apps/server/router.ts</code> to
            add more procedures.
          </AlertDescription>
        </Alert>

        {/* Example: Hello Query */}
        <HelloExample />
      </div>
    </div>
  );
}

// ============================================================================
// Example Component: Simple Query
// ============================================================================

function HelloExample() {
  const [name, setName] = useState("");
  const { data, isLoading, refetch } = trpc.hello.useQuery(
    { name: name || undefined },
    { enabled: false } // Only run when user clicks button
  );

  const handleQuery = () => {
    refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Example: Hello Query</CardTitle>
        <CardDescription>
          A simple tRPC query to test the connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
          />
        </div>

        <Button onClick={handleQuery} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Send Query"
          )}
        </Button>

        {data && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <p className="font-medium text-sm mb-2">Response:</p>
            <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * ============================================================================
 * Add Your Own Components Here
 * ============================================================================
 *
 * Follow this pattern to create your own tRPC queries and mutations:
 *
 * 1. Create procedures in apps/server/router.ts
 * 2. Use trpc.<procedure>.useQuery() for queries (reading data)
 * 3. Use trpc.<procedure>.useMutation() for mutations (writing data)
 * 4. Handle loading and error states
 * 5. Refetch queries after mutations to update the UI
 *
 * Example Query:
 * const { data, isLoading, error } = trpc.items.getAll.useQuery();
 *
 * Example Mutation:
 * const createMutation = trpc.items.create.useMutation({
 *   onSuccess: () => {
 *     // Refetch or invalidate queries
 *   },
 * });
 *
 * For comprehensive examples, see:
 * - docs/SHADCN_COMPONENTS_GUIDE.md - UI component patterns
 * - AGENTS.md - Complete development workflow
 */
