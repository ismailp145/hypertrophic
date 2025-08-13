import { integer, pgTable, varchar, timestamp, text, decimal } from "drizzle-orm/pg-core";
import { or, relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  height: decimal({ precision: 5, scale: 2 }),
  weight: decimal({ precision: 5, scale: 2 }),
  gender: varchar({ length: 10 }),
  activityLevel: varchar({ length: 20 }),
  goal: varchar({ length: 20 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});


// Workout sessions (e.g., "Monday Chest Day", "Tuesday Leg Day")
// CREATE TABLE workout_sessions (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     user_id INT NOT NULL,
//     name VARCHAR(100) DEFAULT 'Untitled Workout',
//     date DATE NOT NULL,
//     start_time TIME,
//     end_time TIME,
//     notes TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// );
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
// CREATE TABLE exercises (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(100) NOT NULL,
//     category VARCHAR(50), -- 'Strength', 'Cardio', 'Flexibility'
//     body_part VARCHAR(50), -- 'Chest', 'Legs', 'Back', 'Arms'
//     equipment VARCHAR(100), -- 'Barbell', 'Dumbbell', 'Bodyweight'
//     instructions TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
export const exercisesTable = pgTable("exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // workoutSessionId: integer().notNull().references(() => workoutSessionsTable.id),
  name: varchar({ length: 255 }).notNull(), // e.g., "Bench Press", "Squats"
  category: varchar({ length: 100 }), // e.g., "Push", "Pull", "Legs", "Core", "Upper Body", "Lower Body"
  muscleGroup: varchar({ length: 50 }), // e.g., "Chest", "Back", "Legs",
  equipment: varchar({ length: 255 }), // e.g., "Barbell", "Dumbbell", "Machine", "Bodyweight", "Other"
  order: integer().notNull(), // To maintain exercise order within the session
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

// WORKOUT_EXERCISES (Junction)
//CREATE TABLE workout_exercises (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     workout_session_id INT NOT NULL,
//     exercise_id INT NOT NULL,
//     order_index INT NOT NULL, -- Order of exercise in workout
//     rest_time INT, -- Rest time between sets in seconds
//     notes TEXT, -- Exercise-specific notes for this workout
//     FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
//     FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
// );

export const workoutExercisesTable = pgTable("workout_exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutSessionId: integer().notNull().references(() => workoutSessionsTable.id),
  exerciseId: integer().notNull().references(() => exercisesTable.id),
  order: integer().notNull(),
  restTimeSeconds: integer(),
  notes: text(),
});

// Sets for each exercise
// CREATE TABLE exercise_sets (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     workout_exercise_id INT NOT NULL,
//     set_number INT NOT NULL, -- 1st set, 2nd set, etc.
//     reps INT, -- Number of repetitions
//     weight DECIMAL(6,2), -- Weight in kg or lbs
//     duration INT, -- Duration in seconds (for time-based exercises)
//     distance DECIMAL(8,2), -- Distance in meters (for cardio)
//     rest_time INT, -- Rest after this set in seconds
//     completed BOOLEAN DEFAULT FALSE,
//     notes TEXT,
//     FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
// );
export const exerciseSetsTable = pgTable("exercise_sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutExerciseId: integer().references(() => workoutExercisesTable.id),
  exerciseId: integer().notNull().references(() => exercisesTable.id),
  setNumber: integer().notNull(), // 1, 2, 3, etc.
  reps: integer().notNull(),
  weight: decimal({ precision: 6, scale: 2 }).notNull(), // e.g., 135.50 lbs
  restTimeSeconds: integer(), // Time between this set and the next
  completedAt: timestamp(),
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
});


// ✅ CORRECT RELATIONS
export const usersRelations = relations(usersTable, ({ many }) => ({
  workoutSessions: many(workoutSessionsTable),
}));

export const workoutSessionsRelations = relations(workoutSessionsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [workoutSessionsTable.userId],
    references: [usersTable.id],
  }),
  // ✅ Fixed: Use junction table instead of direct exercises reference
  workoutExercises: many(workoutExercisesTable),
}));

// ✅ Fixed: Master exercise catalog only relates through junction table
export const exercisesRelations = relations(exercisesTable, ({ many }) => ({
  workoutExercises: many(workoutExercisesTable),
}));

// ✅ Fixed: Complete junction table relations
export const workoutExercisesRelations = relations(workoutExercisesTable, ({ one, many }) => ({
  workoutSession: one(workoutSessionsTable, {
    fields: [workoutExercisesTable.workoutSessionId],
    references: [workoutSessionsTable.id],
  }),
  exercise: one(exercisesTable, {
    fields: [workoutExercisesTable.exerciseId],
    references: [exercisesTable.id],
  }),
  // ✅ Added: Relation to exercise sets
  sets: many(exerciseSetsTable),
}));

// ✅ Fixed: Reference junction table instead of exercises directly
export const exerciseSetsRelations = relations(exerciseSetsTable, ({ one }) => ({
  workoutExercise: one(workoutExercisesTable, {
    fields: [exerciseSetsTable.workoutExerciseId],
    references: [workoutExercisesTable.id],
  }),
}));

