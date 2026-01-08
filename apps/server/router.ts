import { z } from "zod";
import { router, publicProcedure } from "./trpc";
import * as db from "./taylordb/query-builder";
import {
  StrengthExerciseOptions,
  CaloriesTimeOfDayOptions,
  CardioExerciseOptions,
  CaloriesUnitOptions,
} from "./taylordb/types";

/**
 * Main tRPC router with TaylorDB integration
 * All procedures are type-safe and use the TaylorDB query builder
 */
export const appRouter = router({
  // ============================================================================
  // Example / Test Procedures
  // ============================================================================

  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query(({ input }) => {
      return {
        message: `Hello ${input?.name || "from tRPC"}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }),

  // ============================================================================
  // Weight Tracking
  // ============================================================================

  weight: {
    getAll: publicProcedure.query(async () => {
      return await db.getAllWeightRecords();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getWeightRecordById(input.id);
      }),

    getByDateRange: publicProcedure
      .input(
        z.object({
          startDate: z.string(),
          endDate: z.string(),
        })
      )
      .query(async ({ input }) => {
        return await db.getWeightRecordsByDateRange(
          input.startDate,
          input.endDate
        );
      }),

    create: publicProcedure
      .input(
        z.object({
          date: z.string(),
          weight: z.number().positive(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createWeightRecord(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          weight: z.number().positive().optional(),
          date: z.string().optional(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateWeightRecord(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteWeightRecord(input.id);
      }),

    deleteMultiple: publicProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .mutation(async ({ input }) => {
        return await db.deleteWeightRecords(input.ids);
      }),

    getStats: publicProcedure.query(async () => {
      return await db.getWeightStats();
    }),
  },

  // ============================================================================
  // Goals Management
  // ============================================================================

  goals: {
    getAll: publicProcedure.query(async () => {
      return await db.getAllGoals();
    }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          value: z.string().min(1),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createGoal(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          value: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateGoal(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteGoal(input.id);
      }),
  },

  // ============================================================================
  // Strength Training
  // ============================================================================

  strength: {
    getAll: publicProcedure
      .input(
        z
          .object({ exercise: z.enum(StrengthExerciseOptions).optional() })
          .optional()
      )
      .query(async ({ input }) => {
        return await db.getStrengthWorkouts(input?.exercise);
      }),

    create: publicProcedure
      .input(
        z.object({
          exercise: z.enum(StrengthExerciseOptions),
          reps: z.number().positive(),
          weight: z.number().positive(),
          date: z.string(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createStrengthWorkout(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          exercise: z.enum(StrengthExerciseOptions).optional(),
          reps: z.number().positive().optional(),
          weight: z.number().positive().optional(),
          date: z.string().optional(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateStrengthWorkout(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteStrengthWorkout(input.id);
      }),
  },

  // ============================================================================
  // Cardio Exercise
  // ============================================================================

  cardio: {
    getAll: publicProcedure.query(async () => {
      return await db.getCardioExercises();
    }),

    create: publicProcedure
      .input(
        z.object({
          exercise: z.enum(CardioExerciseOptions),
          duration: z.number().positive(),
          distance: z.number().positive(),
          date: z.string(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createCardioExercise(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          exercise: z.enum(CardioExerciseOptions).optional(),
          duration: z.number().positive().optional(),
          distance: z.number().positive().optional(),
          date: z.string().optional(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateCardioExercise(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteCardioExercise(input.id);
      }),
  },

  // ============================================================================
  // Calories/Nutrition Tracking
  // ============================================================================

  calories: {
    getByTimeOfDay: publicProcedure
      .input(z.object({ timeOfDay: z.enum(CaloriesTimeOfDayOptions) }))
      .query(async ({ input }) => {
        return await db.getCaloriesByTimeOfDay(input.timeOfDay);
      }),

    create: publicProcedure
      .input(
        z.object({
          date: z.string(),
          timeOfDay: z.enum(CaloriesTimeOfDayOptions),
          mealName: z.string(),
          mealIngredient: z.string(),
          quantity: z.number().positive(),
          unit: z.enum(CaloriesUnitOptions),
          totalCalories: z.number(),
          totalProtein: z.number(),
          totalCarbs: z.number(),
          totalFats: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createCalorieEntry(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          totalCalories: z.number().optional(),
          totalProtein: z.number().optional(),
          totalCarbs: z.number().optional(),
          totalFats: z.number().optional(),
          quantity: z.number().positive().optional(),
          mealName: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateCalorieEntry(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteCalorieEntry(input.id);
      }),

    getTotalForDate: publicProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ input }) => {
        return await db.getTotalCaloriesForDate(input.date);
      }),
  },

  // ============================================================================
  // Settings
  // ============================================================================

  settings: {
    getByName: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input }) => {
        return await db.getSettingByName(input.name);
      }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          value: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await db.createSetting(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          value: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateSetting(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteSetting(input.id);
      }),
  },
});

// Export type definition of API
export type AppRouter = typeof appRouter;
