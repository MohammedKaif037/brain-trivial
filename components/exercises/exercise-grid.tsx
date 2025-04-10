import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Clock, Dumbbell, Lightbulb, MessageSquare, Puzzle } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function ExerciseGrid({
  category,
  difficulty,
  query,
}: {
  category?: string
  difficulty?: string
  query?: string
}) {
  const supabase = await createServerSupabaseClient()

  // Build the query
  let supabaseQuery = supabase.from("exercises").select("*")

  if (category && category !== "all") {
    supabaseQuery = supabaseQuery.eq("category", category)
  }

  if (difficulty && difficulty !== "all") {
    supabaseQuery = supabaseQuery.eq("difficulty", difficulty)
  }

  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  // Execute the query
  const { data: exercises } = await supabaseQuery.order("created_at", { ascending: false })

  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No exercises found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "memory":
        return <Brain className="h-5 w-5 text-purple-600" />
      case "focus":
        return <Dumbbell className="h-5 w-5 text-blue-600" />
      case "problem_solving":
        return <Puzzle className="h-5 w-5 text-green-600" />
      case "creativity":
        return <Lightbulb className="h-5 w-5 text-yellow-600" />
      case "language":
        return <MessageSquare className="h-5 w-5 text-red-600" />
      default:
        return <Brain className="h-5 w-5 text-purple-600" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-gray-100 p-2 rounded-md">{getCategoryIcon(exercise.category)}</div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    exercise.difficulty === "easy"
                      ? "bg-green-100 text-green-700"
                      : exercise.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{exercise.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {exercise.duration} min
                </div>
                <Button size="sm" asChild>
                  <Link href={`/exercises/${exercise.id}`}>Start</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
