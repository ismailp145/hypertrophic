"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseSetsRelations = exports.workoutExercisesRelations = exports.exercisesRelations = exports.workoutSessionsRelations = exports.usersRelations = exports.exerciseSetsTable = exports.workoutExercisesTable = exports.exercisesTable = exports.workoutSessionsTable = exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    age: (0, pg_core_1.integer)(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    height: (0, pg_core_1.decimal)({ precision: 5, scale: 2 }),
    weight: (0, pg_core_1.decimal)({ precision: 5, scale: 2 }),
    gender: (0, pg_core_1.varchar)({ length: 10 }),
    activityLevel: (0, pg_core_1.varchar)({ length: 20 }),
    goal: (0, pg_core_1.varchar)({ length: 20 }),
    createdAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
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
exports.workoutSessionsTable = (0, pg_core_1.pgTable)("workout_sessions", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    userId: (0, pg_core_1.integer)().notNull().references(() => exports.usersTable.id),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(), // e.g., "Chest Day", "Leg Day"
    startedAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
    completedAt: (0, pg_core_1.timestamp)(),
    notes: (0, pg_core_1.text)(),
    createdAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
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
exports.exercisesTable = (0, pg_core_1.pgTable)("exercises", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    // workoutSessionId: integer().notNull().references(() => workoutSessionsTable.id),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(), // e.g., "Bench Press", "Squats"
    category: (0, pg_core_1.varchar)({ length: 100 }), // e.g., "Push", "Pull", "Legs", "Core", "Upper Body", "Lower Body"
    muscleGroup: (0, pg_core_1.varchar)({ length: 50 }), // e.g., "Chest", "Back", "Legs",
    equipment: (0, pg_core_1.varchar)({ length: 255 }), // e.g., "Barbell", "Dumbbell", "Machine", "Bodyweight", "Other"
    order: (0, pg_core_1.integer)().notNull(), // To maintain exercise order within the session
    notes: (0, pg_core_1.text)(),
    createdAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
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
exports.workoutExercisesTable = (0, pg_core_1.pgTable)("workout_exercises", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    workoutSessionId: (0, pg_core_1.integer)().notNull().references(() => exports.workoutSessionsTable.id, { onDelete: "cascade" }),
    exerciseId: (0, pg_core_1.integer)().notNull().references(() => exports.exercisesTable.id, { onDelete: "restrict" }),
    order: (0, pg_core_1.integer)().notNull(),
    restTimeSeconds: (0, pg_core_1.integer)(),
    notes: (0, pg_core_1.text)(),
    createdAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
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
exports.exerciseSetsTable = (0, pg_core_1.pgTable)("exercise_sets", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    workoutExerciseId: (0, pg_core_1.integer)().notNull().references(() => exports.workoutExercisesTable.id),
    setNumber: (0, pg_core_1.integer)().notNull(), // 1, 2, 3, etc.
    reps: (0, pg_core_1.integer)().notNull(),
    weight: (0, pg_core_1.decimal)({ precision: 6, scale: 2 }).notNull(), // e.g., 135.50 lbs
    restTimeSeconds: (0, pg_core_1.integer)(), // Time between this set and the next
    completedAt: (0, pg_core_1.timestamp)(),
    notes: (0, pg_core_1.text)(),
    createdAt: (0, pg_core_1.timestamp)().notNull().defaultNow(),
});
// ✅ CORRECT RELATIONS
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.usersTable, ({ many }) => ({
    workoutSessions: many(exports.workoutSessionsTable),
}));
exports.workoutSessionsRelations = (0, drizzle_orm_1.relations)(exports.workoutSessionsTable, ({ one, many }) => ({
    user: one(exports.usersTable, {
        fields: [exports.workoutSessionsTable.userId],
        references: [exports.usersTable.id],
    }),
    // ✅ Fixed: Use junction table instead of direct exercises reference
    workoutExercises: many(exports.workoutExercisesTable),
}));
// ✅ Fixed: Master exercise catalog only relates through junction table
exports.exercisesRelations = (0, drizzle_orm_1.relations)(exports.exercisesTable, ({ many }) => ({
    workoutExercises: many(exports.workoutExercisesTable),
}));
// ✅ Fixed: Complete junction table relations
exports.workoutExercisesRelations = (0, drizzle_orm_1.relations)(exports.workoutExercisesTable, ({ one, many }) => ({
    workoutSession: one(exports.workoutSessionsTable, {
        fields: [exports.workoutExercisesTable.workoutSessionId],
        references: [exports.workoutSessionsTable.id],
    }),
    exercise: one(exports.exercisesTable, {
        fields: [exports.workoutExercisesTable.exerciseId],
        references: [exports.exercisesTable.id],
    }),
    // ✅ Added: Relation to exercise sets
    sets: many(exports.exerciseSetsTable),
}));
// ✅ Fixed: Reference junction table instead of exercises directly
exports.exerciseSetsRelations = (0, drizzle_orm_1.relations)(exports.exerciseSetsTable, ({ one }) => ({
    workoutExercise: one(exports.workoutExercisesTable, {
        fields: [exports.exerciseSetsTable.workoutExerciseId],
        references: [exports.workoutExercisesTable.id],
    }),
}));
