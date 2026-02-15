// ===== BASE WORKOUT TYPES =====

export interface BaseWorkoutSession {
  id: number;
  userId: number;
  name: string;
  startedAt: Date;
  completedAt: Date | null;
  notes: string | null;
  createdAt: Date;
}

export interface BaseExercise {
  id: number;
  name: string;
  category: string | null;
  muscleGroup: string | null;
  equipment: string | null;
  notes: string | null;
  createdAt: Date;
}

export interface BaseWorkoutExercise {
  id: number;
  workoutSessionId: number;
  exerciseId: number;
  restTimeSeconds: number | null;
  notes: string | null;
  createdAt: Date;
}

export interface BaseExerciseSet {
  id: number;
  workoutExerciseId: number;
  setNumber: number;
  reps: number;
  weight: string; // Decimal stored as string in TypeScript
  restTimeSeconds: number | null;
  completedAt: Date | null;
  notes: string | null;
  createdAt: Date;
}

// ===== CREATION/UPDATE TYPES =====

export interface CreateWorkoutSessionData {
  userId: number;
  name: string;
  notes?: string;
}

export interface UpdateWorkoutSessionData {
  name?: string;
  notes?: string;
}

export interface CreateExerciseData {
  name: string;
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  notes?: string;
}

export interface UpdateExerciseData {
  name?: string;
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  notes?: string;
}

export interface CreateWorkoutExerciseData {
  workoutSessionId: number;
  exerciseId: number;
  restTimeSeconds?: number;
  notes?: string;
}

export interface AddExerciseToWorkoutData {
  workoutSessionId: number;
  exerciseId: number;
  restTimeSeconds?: number;
  notes?: string;
}

export interface UpdateWorkoutExerciseData {
  restTimeSeconds?: number;
  notes?: string;
}

export interface CreateExerciseSetData {
  workoutExerciseId: number;
  setNumber: number;
  reps: number;
  weight: string;
  restTimeSeconds?: number;
  notes?: string;
}

export interface AddSetToExerciseData {
  workoutExerciseId: number;
  setNumber: number;
  reps: number;
  weight: string;
  restTimeSeconds?: number;
  notes?: string;
}

export interface UpdateExerciseSetData {
  setNumber?: number;
  reps?: number;
  weight?: string;
  restTimeSeconds?: number;
  notes?: string;
}

// ===== RELATIONSHIP TYPES =====

export interface ExerciseWithDetails extends BaseExercise {
  // Additional fields that might be computed or joined
  totalSets?: number;
  totalReps?: number;
  totalWeight?: string;
}

export interface WorkoutExerciseWithDetails extends BaseWorkoutExercise {
  exercise: BaseExercise;
  sets: BaseExerciseSet[];
  // Computed fields
  totalSets: number;
  totalReps: number;
  totalWeight: string;
}

export interface WorkoutSessionWithExercises extends BaseWorkoutSession {
  exercises: Array<{
    id: number;
    workoutSessionId: number;
    exerciseId: number;
    restTimeSeconds: number | null;
    notes: string | null;
    createdAt: Date;
    sets: Array<{
      id: number;
      workoutExerciseId: number;
      setNumber: number;
      reps: number;
      weight: string;
      restTimeSeconds: number | null;
      completedAt: Date | null;
      notes: string | null;
      createdAt: Date;
    }>;
  }>;
}

// ===== RESPONSE TYPES =====

export interface WorkoutSessionResponse {
  success: boolean;
  message: string;
  data: BaseWorkoutSession;
}

export interface WorkoutSessionsResponse {
  success: boolean;
  message: string;
  data: BaseWorkoutSession[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface WorkoutSessionWithExercisesResponse {
  success: boolean;
  message: string;
  data: WorkoutSessionWithExercises;
}

export interface ExerciseResponse {
  success: boolean;
  message: string;
  data: BaseExercise;
}

export interface ExercisesResponse {
  success: boolean;
  message: string;
  data: BaseExercise[];
}

export interface WorkoutExerciseResponse {
  success: boolean;
  message: string;
  data: BaseWorkoutExercise;
}

export interface ExerciseSetResponse {
  success: boolean;
  message: string;
  data: BaseExerciseSet;
}

// ===== ENUM TYPES =====

export enum ExerciseCategory {
  PUSH = 'Push',
  PULL = 'Pull',
  LEGS = 'Legs',
  CORE = 'Core',
  UPPER_BODY = 'Upper Body',
  LOWER_BODY = 'Lower Body',
  CARDIO = 'Cardio',
  FLEXIBILITY = 'Flexibility',
  STRENGTH = 'Strength',
  ENDURANCE = 'Endurance'
}

export enum MuscleGroup {
  CHEST = 'Chest',
  BACK = 'Back',
  SHOULDERS = 'Shoulders',
  BICEPS = 'Biceps',
  TRICEPS = 'Triceps',
  FOREARMS = 'Forearms',
  QUADRICEPS = 'Quadriceps',
  HAMSTRINGS = 'Hamstrings',
  CALVES = 'Calves',
  GLUTES = 'Glutes',
  ABS = 'Abs',
  OBLIQUES = 'Obliques',
  TRAPS = 'Traps',
  LATS = 'Lats',
  DELTOIDS = 'Deltoids'
}

export enum Equipment {
  BARBELL = 'Barbell',
  DUMBBELL = 'Dumbbell',
  KETTLEBELL = 'Kettlebell',
  MACHINE = 'Machine',
  CABLE = 'Cable',
  BODYWEIGHT = 'Bodyweight',
  RESISTANCE_BAND = 'Resistance Band',
  MEDICINE_BALL = 'Medicine Ball',
  STABILITY_BALL = 'Stability Ball',
  FOAM_ROLLER = 'Foam Roller',
  OTHER = 'Other'
}

// ===== UTILITY TYPES =====

export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalReps: number;
  totalWeight: string;
  averageWorkoutDuration: number; // in minutes
  mostUsedExercises: Array<{
    exerciseId: number;
    exerciseName: string;
    count: number;
  }>;
  workoutFrequency: Array<{
    date: string;
    count: number;
  }>;
}

export interface WorkoutFilters {
  dateFrom?: Date;
  dateTo?: Date;
  completed?: boolean;
  exerciseIds?: number[];
  muscleGroups?: MuscleGroup[];
  equipment?: Equipment[];
  limit?: number;
  offset?: number;
}

export interface WorkoutSearchParams {
  query?: string;
  category?: ExerciseCategory;
  muscleGroup?: MuscleGroup;
  equipment?: Equipment;
  limit?: number;
  offset?: number;
}

// ===== VALIDATION TYPES =====

export interface WorkoutValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface WorkoutValidationResult {
  isValid: boolean;
  errors: WorkoutValidationError[];
}

// All types are automatically exported above
