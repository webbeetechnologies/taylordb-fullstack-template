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
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Users,
  FileText,
  Zap,
} from "lucide-react";

export default function TRPCDemoPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto p-8 max-w-4xl">
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Type-safe API Demo
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            tRPC + TaylorDB
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Experience the power of end-to-end type safety with a beautiful,
            modern interface
          </p>
        </div>

        <div className="grid gap-8">
          <HelloExample />
          <UsersExample />
          <PostsExample />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with 💜 using tRPC, React Query & TaylorDB</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Hello Query Example
// ============================================================================

function HelloExample() {
  const [name, setName] = useState("");
  const { data, isLoading, refetch } = trpc.hello.useQuery(
    { name: name || undefined },
    { enabled: false }
  );

  return (
    <Card className="card-hover glass-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Hello Query</CardTitle>
            <CardDescription>
              Simple query to test the connection
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="flex-1"
          />
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin pulse-glow" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
        {data && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-lg" />
            <pre className="relative p-4 rounded-lg text-sm font-mono overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Users CRUD Example
// ============================================================================

function UsersExample() {
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.users.getAll.useQuery();

  const createMutation = trpc.users.create.useMutation({
    onSuccess: () => {
      utils.users.getAll.invalidate();
      setNewName("");
      setNewEmail("");
    },
  });

  const updateMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      utils.users.getAll.invalidate();
      setEditingId(null);
    },
  });

  const deleteMutation = trpc.users.delete.useMutation({
    onSuccess: () => utils.users.getAll.invalidate(),
  });

  const startEditing = (user: { id: number; name: string; email: string }) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  return (
    <Card className="card-hover glass-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10 glow-secondary">
            <Users className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <CardTitle className="text-xl">Users</CardTitle>
            <CardDescription>Full CRUD operations example</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Form */}
        <div className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="flex-1"
          />
          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email"
            className="flex-1"
          />
          <Button
            onClick={() =>
              createMutation.mutate({ name: newName, email: newEmail })
            }
            disabled={!newName || !newEmail || createMutation.isPending}
            size="icon"
            className="shrink-0"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary pulse-glow" />
          </div>
        ) : (
          <div className="space-y-2">
            {users?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No users yet. Create one above!
              </p>
            )}
            {users?.map((user) => (
              <div
                key={user.id}
                className="item-row flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                {editingId === user.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                      onClick={() =>
                        updateMutation.mutate({
                          id: user.id,
                          name: editName,
                          email: editEmail,
                        })
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => startEditing(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate({ id: user.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Posts Example
// ============================================================================

function PostsExample() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("1");

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery();

  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      setTitle("");
      setContent("");
    },
  });

  const publishMutation = trpc.posts.publish.useMutation({
    onSuccess: () => utils.posts.getAll.invalidate(),
  });

  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => utils.posts.getAll.invalidate(),
  });

  return (
    <Card className="card-hover glass-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 glow-accent">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl">Posts</CardTitle>
            <CardDescription>With publish action and filtering</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Form */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="flex-1"
            />
            <div className="w-28">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Author ID
              </Label>
              <Input
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                type="number"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something amazing..."
              className="flex-1"
            />
            <Button
              onClick={() =>
                createMutation.mutate({
                  title,
                  content,
                  authorId: parseInt(authorId),
                  published: false,
                })
              }
              disabled={!title || !content || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-accent pulse-glow" />
          </div>
        ) : (
          <div className="space-y-3">
            {posts?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No posts yet. Create your first post!
              </p>
            )}
            {posts?.map((post) => (
              <div
                key={post.id}
                className="item-row p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{post.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          post.published ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!post.published && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-secondary border-secondary/30 hover:bg-secondary/10"
                        onClick={() => publishMutation.mutate({ id: post.id })}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Publish
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate({ id: post.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
