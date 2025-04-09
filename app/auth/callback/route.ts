import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Check if this is a new user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if user already exists in our users table
      const { data: existingUser } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (!existingUser) {
        // Create new user profile
        await supabase.from("users").insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name || null,
          avatar_url: user.user_metadata.avatar_url || null,
          brain_health_score: 50,
          current_streak: 0,
          exercises_completed: 0,
          total_time_spent: 0,
          last_active: new Date().toISOString(),
        })

        // Create initial cognitive profile
        await supabase.from("cognitive_profiles").insert({
          user_id: user.id,
          memory_score: 50,
          focus_score: 50,
          problem_solving_score: 50,
          creativity_score: 50,
          language_score: 50,
          last_updated: new Date().toISOString(),
        })

        // Create default user preferences
        await supabase.from("user_preferences").insert({
          user_id: user.id,
          preferred_categories: ["memory", "focus", "problem_solving", "creativity", "language"],
          preferred_difficulty: "medium",
          daily_goal_minutes: 15,
          reminder_enabled: true,
          reminder_time: "09:00:00",
          theme: "light",
        })

        // Redirect to onboarding for new users
        return NextResponse.redirect(new URL("/onboarding", requestUrl.origin))
      }

      // Redirect existing users to dashboard
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    }
  }

  // Something went wrong, redirect to login
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
}
