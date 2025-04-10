import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get user's cognitive profile
    const { data: cognitiveProfile, error: profileError } = await supabase
      .from("cognitive_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    // Get user's streak data
    const { data: streakData, error: streakError } = await supabase
      .from("daily_streaks")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(30)

    if (streakError) {
      throw streakError
    }

    // Get exercise history for progress over time
    const { data: exerciseHistory, error: historyError } = await supabase
      .from("exercise_history")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(50)

    if (historyError) {
      throw historyError
    }

    // Calculate average scores by category
    const categoryScores: Record<string, { total: number; count: number }> = {}

    for (const exercise of exerciseHistory) {
      const { data: exerciseData } = await supabase
        .from("exercises")
        .select("category")
        .eq("id", exercise.exercise_id)
        .single()

      if (exerciseData) {
        const category = exerciseData.category

        if (!categoryScores[category]) {
          categoryScores[category] = { total: 0, count: 0 }
        }

        categoryScores[category].total += exercise.score
        categoryScores[category].count += 1
      }
    }

    const averageCategoryScores: Record<string, number> = {}

    for (const [category, data] of Object.entries(categoryScores)) {
      averageCategoryScores[category] = data.total / data.count
    }

    return NextResponse.json({
      cognitiveProfile,
      streakData,
      exerciseHistory,
      categoryScores: averageCategoryScores,
    })
  } catch (error: any) {
    console.error("Error fetching progress data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
