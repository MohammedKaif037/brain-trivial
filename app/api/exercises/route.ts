import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const difficulty = searchParams.get("difficulty")
  const limit = searchParams.get("limit") || "10"

  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Build the query
  let query = supabase.from("exercises").select("*")

  if (category) {
    query = query.eq("category", category)
  }

  if (difficulty) {
    query = query.eq("difficulty", difficulty)
  }

  // Get user preferences if no filters are specified
  if (!category && !difficulty) {
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("preferred_categories, preferred_difficulty")
      .eq("user_id", user.id)
      .single()

    if (preferences) {
      if (preferences.preferred_categories.length > 0) {
        query = query.in("category", preferences.preferred_categories)
      }

      query = query.eq("difficulty", preferences.preferred_difficulty)
    }
  }

  // Execute the query
  const { data, error } = await query.limit(Number.parseInt(limit))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ exercises: data })
}
