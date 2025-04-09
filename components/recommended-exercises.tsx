import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Clock, Dumbbell, Lightbulb, Puzzle, MessageSquare } from "lucide-react"
import type { Exercise } from "@/lib/supabase/schema"

export function RecommendedExercises({ exercises }: { exercises: Exercise[] }) {
  // If no exercises are provided, use default data
  const defaultExercises = [
    {
      id: "1",
      title: "Pattern Memory Challenge",
      description: "Memorize and recall increasingly complex patterns",
      category: "memory",
      difficulty: "medium",
      duration: 5,
      instructions: "Memorize the pattern, then recreate it by clicking on the correct squares.",
      content_json: {},
      created_at: "",
    },
    {
      id: "2",
      title: "Dual N-Back Task",
      description: "Train your working memory and fluid intelligence",
      category: "focus",
      difficulty: "hard",
      duration: 10,
      instructions: "Remember both the position and sound from N steps back in the sequence.",
      content_json: {},
      created_at: "",
    },
    {
      id: "3",
      title: "Logic Grid Puzzle",
      description: "Solve a complex logic puzzle using deductive reasoning",
      category: "problem_solving",
      difficulty: "medium",
      duration: 15,
      instructions: "Use the clues to determine the correct arrangement of items.",
      content_json: {},
      created_at: "",
    },
    {
      id: "4",
      title: "Word Association Challenge",
      description: "Create chains of associated words to improve verbal fluency",
      category: "language",
      difficulty: "easy",
      duration: 7,
      instructions: "Generate words that are associated with the given prompt.",
      content_json: {},
      created_at: "",
    },
  ]

  const displayExercises = exercises.length > 0 ? exercises : defaultExercises

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayExercises.map((exercise) => (
        <div key={exercise.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
          <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
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
      ))}
    </div>
  )
}
