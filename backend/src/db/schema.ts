import { integer, pgTable, varchar, timestamp, text, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

// Workout sessions (e.g., "Monday Chest Day", "Tuesday Leg Day")
export const workoutSessionsTable = pgTable("workout_sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id),
  name: varchar({ length: 255 }).notNull(), // e.g., "Chest Day", "Leg Day"
  startedAt: timestamp().notNull().defaultNow(),
  completedAt: timestamp(),
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

// Individual exercises within a workout session
export const exercisesTable = pgTable("exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutSessionId: integer().notNull().references(() => workoutSessionsTable.id),
  name: varchar({ length: 255 }).notNull(), // e.g., "Bench Press", "Squats"
  order: integer().notNull(), // To maintain exercise order within the session
  targetMuscleGroup: varchar({ length: 100 }),
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

// Sets for each exercise
export const exerciseSetsTable = pgTable("exercise_sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  exerciseId: integer().notNull().references(() => exercisesTable.id),
  setNumber: integer().notNull(), // 1, 2, 3, etc.
  reps: integer().notNull(),
  weight: decimal({ precision: 5, scale: 2 }).notNull(), // e.g., 135.50 lbs
  restTimeSeconds: integer(), // Time between this set and the next
  completedAt: timestamp(),
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

// Define relationships
export const usersRelations = relations(usersTable, ({ many }) => ({
  workoutSessions: many(workoutSessionsTable),
}));

export const workoutSessionsRelations = relations(workoutSessionsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [workoutSessionsTable.userId],
    references: [usersTable.id],
  }),
  exercises: many(exercisesTable),
}));

export const exercisesRelations = relations(exercisesTable, ({ one, many }) => ({
  workoutSession: one(workoutSessionsTable, {
    fields: [exercisesTable.workoutSessionId],
    references: [workoutSessionsTable.id],
  }),
  sets: many(exerciseSetsTable),
}));

export const exerciseSetsRelations = relations(exerciseSetsTable, ({ one }) => ({
  exercise: one(exercisesTable, {
    fields: [exerciseSetsTable.exerciseId],
    references: [exercisesTable.id],
  }),
}));

