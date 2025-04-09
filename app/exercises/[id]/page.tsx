import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, Clock, Dumbbell, HelpCircle, Lightbulb } from "lucide-react"
import { MemoryExercise } from "@/components/exercises/memory-exercise"

export default function ExercisePage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the exercise data based on the ID
  const exerciseId = Number.parseInt(params.id)

  // Mock exercise data
  const exercise = {
    id: exerciseId,
    title: "Pattern Memory Challenge",
    description:
      "Memorize and recall increasingly complex patterns to improve your visual memory and attention to detail.",
    category: "Memory",
    duration: "5 min",
    difficulty: "Medium",
    instructions:
      "You will be shown a pattern of colored squares for a few seconds. Memorize the pattern, then recreate it by clicking on the correct squares in the grid.",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-600" />
                Exercise Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Category</div>
                <div className="font-medium">{exercise.category}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Duration</div>
                <div className="font-medium flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-gray-500" />
                  {exercise.duration}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Difficulty</div>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    exercise.difficulty === "Easy"
                      ? "bg-green-100 text-green-800"
                      : exercise.difficulty === "Medium"
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
                  <span className="text-sm font-medium">Level 3 of 10</span>
                  <span className="text-sm font-medium text-gray-500">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Score</div>
                <div className="text-2xl font-bold text-purple-600">240</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Accuracy</div>
                <div className="text-2xl font-bold text-green-600">85%</div>
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
            <CardContent className="flex-grow">
              <MemoryExercise />
            </CardContent>
            <CardFooter className="border-t bg-gray-50 flex justify-between">
              <Button variant="outline">Skip</Button>
              <Button className="bg-purple-600 hover:bg-purple-700">Next Level</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
