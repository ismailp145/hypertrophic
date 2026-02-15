ALTER TABLE "exercise_sets" DROP CONSTRAINT "exercise_sets_exerciseId_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_exercises" DROP CONSTRAINT "workout_exercises_workoutSessionId_workout_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_exercises" DROP CONSTRAINT "workout_exercises_exerciseId_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "exercise_sets" ALTER COLUMN "workoutExerciseId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workoutSessionId_workout_sessions_id_fk" FOREIGN KEY ("workoutSessionId") REFERENCES "public"."workout_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exerciseId_exercises_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "public"."exercises"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_sets" DROP COLUMN "exerciseId";