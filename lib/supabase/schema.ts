// This file defines the database schema types that match our Supabase tables

export type User = {
  id: string
  email: string
  created_at: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  brain_health_score: number
  current_streak: number
  exercises_completed: number
  total_time_spent: number // in minutes
  last_active: string
}

export type CognitiveProfile = {
  id: string
  user_id: string
  memory_score: number
  focus_score: number
  problem_solving_score: number
  creativity_score: number
  language_score: number
  last_updated: string
}

export type Exercise = {
  id: string
  title: string
  description: string
  category: "memory" | "focus" | "problem_solving" | "creativity" | "language" | "mixed"
  difficulty: "easy" | "medium" | "hard"
  duration: number // in minutes
  instructions: string
  content_json: any // JSON structure containing exercise data
  created_at: string
}

export type ExerciseHistory = {
  id: string
  user_id: string
  exercise_id: string
  score: number
  accuracy: number
  time_spent: number // in seconds
  completed_at: string
  difficulty_level: number
}

export type DailyStreak = {
  id: string
  user_id: string
  date: string
  exercises_completed: number
  total_time: number // in minutes
}

export type LearningContent = {
  id: string
  title: string
  content: string
  category: string
  reading_time: number // in minutes
  created_at: string
}

export type UserLearning = {
  id: string
  user_id: string
  learning_content_id: string
  completed: boolean
  completed_at: string | null
}

export type ChatMessage = {
  id: string
  user_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export type UserGoal = {
  id: string
  user_id: string
  title: string
  description: string | null
  target_value: number
  current_value: number
  goal_type: "streak" | "score" | "exercises" | "time"
  start_date: string
  end_date: string | null
  completed: boolean
  completed_at: string | null
}

export type UserPreference = {
  id: string
  user_id: string
  preferred_categories: string[] // Array of exercise categories
  preferred_difficulty: "easy" | "medium" | "hard"
  daily_goal_minutes: number
  reminder_enabled: boolean
  reminder_time: string | null
  theme: "light" | "dark" | "system"
}
