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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TRPCDemoPage() {
  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-2">TaylorDB + tRPC Demo</h1>
      <p className="text-muted-foreground mb-8">
        Full-stack CRUD operations with type safety
      </p>

      <Tabs defaultValue="weight" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <WeightTracker />
        </TabsContent>

        <TabsContent value="goals">
          <GoalsManager />
        </TabsContent>

        <TabsContent value="strength">
          <StrengthWorkouts />
        </TabsContent>

        <TabsContent value="cardio">
          <CardioExercises />
        </TabsContent>

        <TabsContent value="calories">
          <CaloriesTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// Weight Tracker Component
// ============================================================================

function WeightTracker() {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: weights, isLoading, refetch } = trpc.weight.getAll.useQuery();
  const { data: stats } = trpc.weight.getStats.useQuery();

  const createMutation = trpc.weight.create.useMutation({
    onSuccess: () => {
      refetch();
      setWeight("");
    },
  });

  const deleteMutation = trpc.weight.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight) {
      createMutation.mutate({
        date,
        weight: parseFloat(weight),
      });
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weight Statistics</CardTitle>
          <CardDescription>Your weight tracking overview</CardDescription>
        </CardHeader>
        <CardContent>
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.count}</p>
                <p className="text-sm text-muted-foreground">Total Entries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {stats.average?.toFixed(1) || "-"}
                </p>
                <p className="text-sm text-muted-foreground">Average (kg)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {stats.min?.toFixed(1) || "-"}
                </p>
                <p className="text-sm text-muted-foreground">Min (kg)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {stats.max?.toFixed(1) || "-"}
                </p>
                <p className="text-sm text-muted-foreground">Max (kg)</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Weight Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="75.5"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Entry"}
            </Button>
            {createMutation.error && (
              <p className="text-sm text-destructive">
                {createMutation.error.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading...</p>}
          {weights && weights.length === 0 && (
            <p className="text-muted-foreground">No entries yet</p>
          )}
          <div className="space-y-2">
            {weights?.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{w.weight} kg</p>
                  <p className="text-sm text-muted-foreground">{w.date}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => w.id && deleteMutation.mutate({ id: w.id })}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Goals Manager Component
// ============================================================================

function GoalsManager() {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  const { data: goals, isLoading, refetch } = trpc.goals.getAll.useQuery();

  const createMutation = trpc.goals.create.useMutation({
    onSuccess: () => {
      refetch();
      setName("");
      setValue("");
      setDescription("");
    },
  });

  const deleteMutation = trpc.goals.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name, value, description });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lose 5kg"
                required
              />
            </div>
            <div>
              <Label htmlFor="goalValue">Target Value</Label>
              <Input
                id="goalValue"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="70kg"
                required
              />
            </div>
            <div>
              <Label htmlFor="goalDescription">Description (optional)</Label>
              <Input
                id="goalDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="By end of Q1"
              />
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Goal"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading...</p>}
          {goals && goals.length === 0 && (
            <p className="text-muted-foreground">No goals yet</p>
          )}
          <div className="space-y-3">
            {goals?.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p className="text-lg text-primary">{goal.value}</p>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      goal.id && deleteMutation.mutate({ id: goal.id })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Strength Workouts Component
// ============================================================================

function StrengthWorkouts() {
  const [exercise, setExercise] = useState("Push-ups");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const {
    data: workouts,
    isLoading,
    refetch,
  } = trpc.strength.getAll.useQuery();

  const createMutation = trpc.strength.create.useMutation({
    onSuccess: () => {
      refetch();
      setReps("");
      setWeight("");
    },
  });

  const deleteMutation = trpc.strength.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      exercise: exercise as any,
      reps: parseInt(reps),
      weight: parseFloat(weight),
      date,
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Strength Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exercise">Exercise</Label>
                <select
                  id="exercise"
                  className="w-full p-2 border rounded-md"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                >
                  <option>Push-ups</option>
                  <option>Pull-ups</option>
                  <option>Squats</option>
                  <option>Bench Press</option>
                  <option>Deadlifts</option>
                </select>
              </div>
              <div>
                <Label htmlFor="workoutDate">Date</Label>
                <Input
                  id="workoutDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="workoutWeight">Weight (kg)</Label>
                <Input
                  id="workoutWeight"
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              Log Workout
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading...</p>}
          <div className="space-y-2">
            {workouts?.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{w.exercise?.[0] || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">
                    {w.reps} reps × {w.weight}kg • {w.date}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => w.id && deleteMutation.mutate({ id: w.id })}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Cardio Exercises Component
// ============================================================================

function CardioExercises() {
  const [exercise, setExercise] = useState("Running");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: exercises, isLoading, refetch } = trpc.cardio.getAll.useQuery();

  const createMutation = trpc.cardio.create.useMutation({
    onSuccess: () => {
      refetch();
      setDuration("");
      setDistance("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      exercise: exercise as any,
      duration: parseFloat(duration),
      distance: parseFloat(distance),
      date,
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Cardio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Exercise</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                >
                  <option>Running</option>
                  <option>Cycling</option>
                  <option>Swimming</option>
                </select>
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit">Log Exercise</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cardio History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading...</p>}
          <div className="space-y-2">
            {exercises?.map((e) => (
              <div key={e.id} className="p-3 border rounded-lg">
                <p className="font-medium">{e.exercise?.[0] || "N/A"}</p>
                <p className="text-sm text-muted-foreground">
                  {e.distance}km in {e.duration}min • {e.speed?.toFixed(1)} km/h
                  • {e.date}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Calories Tracker Component
// ============================================================================

function CaloriesTracker() {
  const [date] = useState(new Date().toISOString().split("T")[0]);

  const { data: totals } = trpc.calories.getTotalForDate.useQuery({ date });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Nutrition</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        {totals && (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold">{totals.totalCalories}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold">{totals.totalProtein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold">{totals.totalCarbs}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-bold">{totals.totalFats}g</p>
              <p className="text-sm text-muted-foreground">Fats</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
