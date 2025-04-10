import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { exerciseId, score, accuracy, timeSpent, difficultyLevel } = await request.json()

    if (!exerciseId || score === undefined || accuracy === undefined || timeSpent === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Record the exercise completion
    const { error: historyError } = await supabase.from("exercise_history").insert({
      user_id: user.id,
      exercise_id: exerciseId,
      score,
      accuracy,
      time_spent: timeSpent,
      difficulty_level: difficultyLevel || 1,
      completed_at: new Date().toISOString(),
    })

    if (historyError) {
      throw historyError
    }

    // Update user stats
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("exercises_completed, total_time_spent")
      .eq("id", user.id)
      .single()

    if (userError) {
      throw userError
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        exercises_completed: userData.exercises_completed + 1,
        total_time_spent: userData.total_time_spent + Math.ceil(timeSpent / 60), // Convert seconds to minutes
        last_active: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      throw updateError
    }

    // Update daily streak
    const today = new Date().toISOString().split("T")[0]

    const { data: existingStreak } = await supabase
      .from("daily_streaks")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .single()

    if (existingStreak) {
      // Update existing streak for today
      await supabase
        .from("daily_streaks")
        .update({
          exercises_completed: existingStreak.exercises_completed + 1,
          total_time: existingStreak.total_time + Math.ceil(timeSpent / 60),
        })
        .eq("id", existingStreak.id)
    } else {
      // Create new streak entry for today
      await supabase.from("daily_streaks").insert({
        user_id: user.id,
        date: today,
        exercises_completed: 1,
        total_time: Math.ceil(timeSpent / 60),
      })

      // Update current streak count
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split("T")[0]

      const { data: yesterdayStreak } = await supabase
        .from("daily_streaks")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", yesterdayStr)
        .single()

      if (yesterdayStreak) {
        // User had a streak yesterday, increment it
        await supabase
          .from("users")
          .update({
            current_streak: userData.current_streak + 1,
          })
          .eq("id", user.id)
      } else {
        // User didn't have a streak yesterday, reset to 1
        await supabase
          .from("users")
          .update({
            current_streak: 1,
          })
          .eq("id", user.id)
      }
    }

    // Update cognitive profile based on exercise category
    const { data: exerciseData } = await supabase.from("exercises").select("category").eq("id", exerciseId).single()

    if (exerciseData) {
      const { data: profileData } = await supabase
        .from("cognitive_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileData) {
        const category = exerciseData.category
        const scoreField = `${category}_score`

        if (scoreField in profileData) {
          // Calculate new score (weighted average: 70% old score, 30% new score)
          const oldScore = profileData[scoreField as keyof typeof profileData] as number
          const newScore = Math.round(oldScore * 0.7 + score * 0.3)

          // Update the specific cognitive area
          const updateData: Record<string, any> = {
            [scoreField]: newScore,
            last_updated: new Date().toISOString(),
          }

          await supabase.from("cognitive_profiles").update(updateData).eq("user_id", user.id)

          // Update overall brain health score (average of all cognitive areas)
          const updatedProfile = {
            ...profileData,
            [scoreField]: newScore,
          }

          const cognitiveAreas = [
            "memory_score",
            "focus_score",
            "problem_solving_score",
            "creativity_score",
            "language_score",
          ]
          const brainHealthScore = Math.round(
            cognitiveAreas.reduce(
              (sum, area) => sum + (updatedProfile[area as keyof typeof updatedProfile] as number),
              0,
            ) / cognitiveAreas.length,
          )

          await supabase
            .from("users")
            .update({
              brain_health_score: brainHealthScore,
            })
            .eq("id", user.id)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error completing exercise:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
