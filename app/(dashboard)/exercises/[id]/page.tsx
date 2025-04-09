import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, Clock, Dumbbell, HelpCircle, Lightbulb } from "lucide-react"
import { MemoryExercise } from "@/components/exercises/memory-exercise"
import { FocusExercise } from "@/components/exercises/focus-exercise"
import { ProblemSolvingExercise } from "@/components/exercises/problem-solving-exercise"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function ExercisePage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Get the exercise data
  const { data: exercise, error } = await supabase.from("exercises").select("*").eq("id", params.id).single()

  if (error || !exercise) {
    notFound()
  }

  // Get user's history with this exercise
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: exerciseHistory } = await supabase
    .from("exercise_history")
    .select("*")
    .eq("user_id", user?.id)
    .eq("exercise_id", params.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single()

  // Determine which exercise component to render based on category
  const renderExerciseComponent = () => {
    switch (exercise.category) {
      case "memory":
        return <MemoryExercise exercise={exercise} />
      case "focus":
        return <FocusExercise exercise={exercise} />
      case "problem_solving":
        return <ProblemSolvingExercise exercise={exercise} />
      default:
        return <MemoryExercise exercise={exercise} />
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "memory":
        return <Brain className="mr-2 h-5 w-5 text-purple-600" />
      case "focus":
        return <Dumbbell className="mr-2 h-5 w-5 text-blue-600" />
      case "problem_solving":
        return <Lightbulb className="mr-2 h-5 w-5 text-green-600" />
      default:
        return <Brain className="mr-2 h-5 w-5 text-purple-600" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/exercises" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exercises
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getCategoryIcon(exercise.category)}
                Exercise Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Category</div>
                <div className="font-medium capitalize">{exercise.category}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Duration</div>
                <div className="font-medium flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-gray-500" />
                  {exercise.duration} min
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Difficulty</div>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    exercise.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : exercise.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {exercise.difficulty}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{exercise.instructions}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <HelpCircle className="mr-2 h-4 w-4" />
                Need Help?
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Level {exerciseHistory?.difficulty_level || 1} of 10</span>
                  <span className="text-sm font-medium text-gray-500">
                    {exerciseHistory ? Math.round((exerciseHistory.difficulty_level / 10) * 100) : 10}%
                  </span>
                </div>
                <Progress
                  value={exerciseHistory ? (exerciseHistory.difficulty_level / 10) * 100 : 10}
                  className="h-2"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Best Score</div>
                <div className="text-2xl font-bold text-purple-600">{exerciseHistory?.score || 0}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Best Accuracy</div>
                <div className="text-2xl font-bold text-green-600">
                  {exerciseHistory ? Math.round(exerciseHistory.accuracy * 100) : 0}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{exercise.title}</CardTitle>
              <CardDescription>{exercise.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">{renderExerciseComponent()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
