import pkg from "@taylordb/query-builder";
const { createQueryBuilder } = pkg;
import type {
  StrengthExerciseOptions,
  CaloriesTimeOfDayOptions,
  CardioExerciseOptions,
  CaloriesUnitOptions,
} from "./types.js";
import type { TaylorDatabase } from "./types.js";

export const queryBuilder = createQueryBuilder<TaylorDatabase>({
  baseUrl: process.env.TAYLORDB_BASE_URL!,
  baseId: process.env.TAYLORDB_SERVER_ID!,
  apiKey: process.env.TAYLORDB_API_TOKEN!,
});

/**
 * Sample CRUD Operations for TaylorDB
 * These demonstrate how to interact with the database using the query builder
 */

// ============================================================================
// READ Operations (Queries)
// ============================================================================

/**
 * Get all weight records
 */
export async function getAllWeightRecords() {
  return await queryBuilder
    .selectFrom("weight")
    .select(["id", "date", "weight", "name", "createdAt", "updatedAt"])
    .orderBy("date", "desc")
    .execute();
}

/**
 * Get weight records for a specific date range
 */
export async function getWeightRecordsByDateRange(
  startDate: string,
  endDate: string
) {
  return await queryBuilder
    .selectFrom("weight")
    .where("date", ">=", ["exactDay", startDate])
    .where("date", "<=", ["exactDay", endDate])
    .orderBy("date", "asc")
    .execute();
}

/**
 * Get a single weight record by ID
 */
export async function getWeightRecordById(id: number) {
  return await queryBuilder
    .selectFrom("weight")
    .where("id", "=", id)
    .executeTakeFirst();
}

/**
 * Get all goals
 */
export async function getAllGoals() {
  return await queryBuilder
    .selectFrom("goals")
    .select(["id", "name", "value", "description", "createdAt", "updatedAt"])
    .execute();
}

/**
 * Get strength workout records with optional filtering by exercise
 */
export async function getStrengthWorkouts(
  exercise?: (typeof StrengthExerciseOptions)[number]
) {
  let query = queryBuilder
    .selectFrom("strength")
    .select(["id", "date", "exercise", "reps", "weight", "name"])
    .orderBy("date", "desc");

  if (exercise) {
    query = query.where("exercise", "=", exercise);
  }

  return await query.execute();
}

/**
 * Get cardio exercises
 */
export async function getCardioExercises() {
  return await queryBuilder
    .selectFrom("cardio")
    .select(["id", "date", "exercise", "duration", "distance", "speed", "name"])
    .orderBy("date", "desc")
    .execute();
}

/**
 * Get calories by time of day
 */
export async function getCaloriesByTimeOfDay(
  timeOfDay: (typeof CaloriesTimeOfDayOptions)[number]
) {
  return await queryBuilder
    .selectFrom("calories")
    .select([
      "id",
      "date",
      "timeOfDay",
      "mealName",
      "totalCalories",
      "totalProtein",
      "totalCarbs",
      "totalFats",
    ])
    .where("timeOfDay", "=", timeOfDay)
    .execute();
}

/**
 * Get settings by name
 */
export async function getSettingByName(name: string) {
  return await queryBuilder
    .selectFrom("settings")
    .where("name", "=", name)
    .execute();
}

// ============================================================================
// CREATE Operations (Insert)
// ============================================================================

/**
 * Add a new weight record
 */
export async function createWeightRecord(data: {
  date: string;
  weight: number;
  name?: string;
}) {
  return await queryBuilder
    .insertInto("weight")
    .values({
      date: data.date,
      weight: data.weight,
      name: data.name || "",
    })
    .executeTakeFirst();
}

/**
 * Create a new goal
 */
export async function createGoal(data: {
  name: string;
  value: string;
  description?: string;
}) {
  return await queryBuilder
    .insertInto("goals")
    .values({
      name: data.name,
      value: data.value,
      description: data.description || "",
    })
    .executeTakeFirst();
}

/**
 * Log a strength workout
 */
export async function createStrengthWorkout(data: {
  exercise: (typeof StrengthExerciseOptions)[number];
  reps: number;
  weight: number;
  date: string;
  name?: string;
}) {
  return await queryBuilder
    .insertInto("strength")
    .values({
      exercise: [data.exercise],
      reps: data.reps,
      weight: data.weight,
      date: data.date,
      name: data.name || "",
    })
    .executeTakeFirst();
}

/**
 * Log a cardio exercise
 */
export async function createCardioExercise(data: {
  exercise: (typeof CardioExerciseOptions)[number];
  duration: number;
  distance: number;
  date: string;
  name?: string;
}) {
  const speed = data.distance / (data.duration / 60); // Calculate speed (km/h)

  return await queryBuilder
    .insertInto("cardio")
    .values({
      exercise: [data.exercise],
      duration: data.duration,
      distance: data.distance,
      speed,
      date: data.date,
      name: data.name || "",
    })
    .executeTakeFirst();
}

/**
 * Log calories/meal
 */
export async function createCalorieEntry(data: {
  date: string;
  timeOfDay: (typeof CaloriesTimeOfDayOptions)[number];
  mealName: string;
  mealIngredient: string;
  quantity: number;
  unit: (typeof CaloriesUnitOptions)[number];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}) {
  return await queryBuilder
    .insertInto("calories")
    .values({
      date: data.date,
      timeOfDay: [data.timeOfDay],
      mealName: data.mealName,
      mealIngredient: data.mealIngredient,
      quantity: data.quantity,
      unit: [data.unit],
      totalCalories: data.totalCalories,
      totalProtein: data.totalProtein,
      totalCarbs: data.totalCarbs,
      totalFats: data.totalFats,
      name: "",
      proteinPer100G: 0,
      carbsPer100G: 0,
      fatsPer100G: 0,
      quantityInGramsmL: 0,
      quantityInFlOzozlb: 0,
    })
    .executeTakeFirst();
}

/**
 * Create or update a setting
 */
export async function createSetting(data: {
  name: string;
  value: string;
  description?: string;
}) {
  return await queryBuilder
    .insertInto("settings")
    .values({
      name: data.name,
      value: data.value,
      description: data.description || "",
    })
    .executeTakeFirst();
}

// ============================================================================
// UPDATE Operations
// ============================================================================

/**
 * Update a weight record
 */
export async function updateWeightRecord(
  id: number,
  data: {
    weight?: number;
    date?: string;
    name?: string;
  }
) {
  return await queryBuilder
    .update("weight")
    .set(data)
    .where("id", "=", id)
    .execute();
}

/**
 * Update a goal
 */
export async function updateGoal(
  id: number,
  data: {
    name?: string;
    value?: string;
    description?: string;
  }
) {
  return await queryBuilder
    .update("goals")
    .set(data)
    .where("id", "=", id)
    .execute();
}

/**
 * Update a strength workout
 */
export async function updateStrengthWorkout(
  id: number,
  data: {
    reps?: number;
    weight?: number;
    exercise?: (typeof StrengthExerciseOptions)[number];
    date?: string;
    name?: string;
  }
) {
  const updateData: Record<string, string | number | string[] | undefined> = {
    ...data,
    exercise: data.exercise ? [data.exercise] : undefined,
  };
  return await queryBuilder
    .update("strength")
    .set(updateData)
    .where("id", "=", id)
    .execute();
}

/**
 * Update a cardio exercise
 */
export async function updateCardioExercise(
  id: number,
  data: {
    duration?: number;
    distance?: number;
    exercise?: (typeof CardioExerciseOptions)[number];
    date?: string;
    name?: string;
  }
) {
  const updateData: Record<string, string | number | string[] | undefined> = {
    ...data,
    exercise: data.exercise ? [data.exercise] : undefined,
  };

  // Recalculate speed if duration or distance changed
  if (data.duration || data.distance) {
    const record = await queryBuilder
      .selectFrom("cardio")
      .select(["duration", "distance"])
      .where("id", "=", id)
      .executeTakeFirst();

    if (record) {
      const newDuration = data.duration ?? record.duration ?? 0;
      const newDistance = data.distance ?? record.distance ?? 0;
      updateData.speed = newDistance / (newDuration / 60);
    }
  }

  return await queryBuilder
    .update("cardio")
    .set(updateData)
    .where("id", "=", id)
    .execute();
}

/**
 * Update a calorie entry
 */
export async function updateCalorieEntry(
  id: number,
  data: {
    totalCalories?: number;
    totalProtein?: number;
    totalCarbs?: number;
    totalFats?: number;
    quantity?: number;
    mealName?: string;
  }
) {
  return await queryBuilder
    .update("calories")
    .set(data)
    .where("id", "=", id)
    .execute();
}

/**
 * Update a setting
 */
export async function updateSetting(
  id: number,
  data: {
    value?: string;
    description?: string;
  }
) {
  return await queryBuilder
    .update("settings")
    .set(data)
    .where("id", "=", id)
    .execute();
}

// ============================================================================
// DELETE Operations
// ============================================================================

/**
 * Delete a weight record
 */
export async function deleteWeightRecord(id: number) {
  return await queryBuilder.deleteFrom("weight").where("id", "=", id).execute();
}

/**
 * Delete multiple weight records by IDs
 */
export async function deleteWeightRecords(ids: number[]) {
  return await queryBuilder
    .deleteFrom("weight")
    .where("id", "hasAnyOf", ids)
    .execute();
}

/**
 * Delete a goal
 */
export async function deleteGoal(id: number) {
  return await queryBuilder.deleteFrom("goals").where("id", "=", id).execute();
}

/**
 * Delete a strength workout
 */
export async function deleteStrengthWorkout(id: number) {
  return await queryBuilder
    .deleteFrom("strength")
    .where("id", "=", id)
    .execute();
}

/**
 * Delete a cardio exercise
 */
export async function deleteCardioExercise(id: number) {
  return await queryBuilder.deleteFrom("cardio").where("id", "=", id).execute();
}

/**
 * Delete a calorie entry
 */
export async function deleteCalorieEntry(id: number) {
  return await queryBuilder
    .deleteFrom("calories")
    .where("id", "=", id)
    .execute();
}

/**
 * Delete a setting
 */
export async function deleteSetting(id: number) {
  return await queryBuilder
    .deleteFrom("settings")
    .where("id", "=", id)
    .execute();
}

// ============================================================================
// AGGREGATION Operations (Advanced)
// ============================================================================

/**
 * Get weight statistics using aggregation
 */
export async function getWeightStats() {
  // Note: TaylorDB aggregation API may differ, this is a placeholder
  // Use the aggregateFrom method if available
  const weights = await queryBuilder
    .selectFrom("weight")
    .select(["weight"])
    .execute();

  if (weights.length === 0) {
    return {
      count: 0,
      average: null,
      min: null,
      max: null,
    };
  }

  const values = weights
    .map((w) => w.weight)
    .filter((w): w is number => w !== undefined);
  return {
    count: values.length,
    average: values.reduce((a, b) => a + b, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

/**
 * Get total calories for a date
 */
export async function getTotalCaloriesForDate(date: string) {
  const entries = await queryBuilder
    .selectFrom("calories")
    .select(["totalCalories", "totalProtein", "totalCarbs", "totalFats"])
    .where("date", "=", ["exactDay", date])
    .execute();

  return {
    totalCalories: entries.reduce((sum, e) => sum + (e.totalCalories ?? 0), 0),
    totalProtein: entries.reduce((sum, e) => sum + (e.totalProtein ?? 0), 0),
    totalCarbs: entries.reduce((sum, e) => sum + (e.totalCarbs ?? 0), 0),
    totalFats: entries.reduce((sum, e) => sum + (e.totalFats ?? 0), 0),
  };
}
