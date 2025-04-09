import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Save user message to database
    const { error: messageError } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: message,
    })

    if (messageError) {
      throw messageError
    }

    // Get user's cognitive profile and exercise history for context
    const { data: cognitiveProfile } = await supabase
      .from("cognitive_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    const { data: exerciseHistory } = await supabase
      .from("exercise_history")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(5)

    // Create context for the AI
    const userContext = {
      cognitiveProfile,
      recentExercises: exerciseHistory,
    }

    // Use the chatanywhere API directly
    const response = await fetch("https://api.chatanywhere.tech/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHATANYWHERE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful and supportive AI brain coach. Your goal is to help users improve their cognitive abilities through personalized advice, motivation, and brain exercise recommendations. 
            
            Here is information about the user:
            ${JSON.stringify(userContext)}
            
            Be friendly, encouraging, and knowledgeable about neuroscience and cognitive training. Provide specific advice based on the user's cognitive profile and recent exercise history when relevant.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const text = data.choices[0].message.content

    // Save AI response to database
    const { error: responseError } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "assistant",
      content: text,
    })

    if (responseError) {
      throw responseError
    }

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error("Error in coach API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

