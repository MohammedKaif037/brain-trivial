"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Sample logic puzzles
const puzzles = [
  {
    id: 1,
    question: "If all Bloops are Razzies and all Razzies are Lazzies, then which of the following must be true?",
    options: [
      "All Lazzies are Bloops",
      "All Bloops are Lazzies",
      "Some Lazzies are not Bloops",
      "No Lazzies are Bloops",
    ],
    correctAnswer: 1,
    explanation:
      "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops must also be Lazzies. This is a transitive relationship.",
  },
  {
    id: 2,
    question:
      "A farmer needs to cross a river with a fox, a chicken, and a sack of grain. The boat can only carry the farmer and one item at a time. If left alone, the fox will eat the chicken, and the chicken will eat the grain. How many trips across the river will the farmer need to make?",
    options: ["5 trips", "7 trips", "9 trips", "11 trips"],
    correctAnswer: 1,
    explanation:
      "The farmer needs 7 trips: 1) Farmer takes chicken across, 2) Farmer returns alone, 3) Farmer takes fox across, 4) Farmer returns with chicken, 5) Farmer takes grain across, 6) Farmer returns alone, 7) Farmer takes chicken across.",
  },
  {
    id: 3,
    question:
      "If you have 9 coins and one of them is counterfeit (weighs less than the others), how many weighings on a balance scale would you need to identify the counterfeit coin?",
    options: ["1 weighing", "2 weighings", "3 weighings", "4 weighings"],
    correctAnswer: 1,
    explanation:
      "With 2 weighings, you can identify the counterfeit coin. First, divide the coins into 3 groups of 3. Weigh two groups against each other. If they balance, the counterfeit is in the third group. If not, it's in the lighter group. Then weigh 2 coins from the suspect group. If they balance, the third coin is counterfeit. If not, the lighter one is counterfeit.",
  },
]

export function ProblemSolvingExercise({ exercise }: { exercise: any }) {
  const router = useRouter()
  const [phase, setPhase] = useState<"intro" | "exercise" | "feedback" | "results">("intro")
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds per puzzle
  const [answers, setAnswers] = useState<{ puzzleId: number; correct: boolean; timeSpent: number }[]>([])
  const [startTime, setStartTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (phase === "exercise") {
      setStartTime(Date.now())

      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleAnswer()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [phase, currentPuzzleIndex])

  const startExercise = () => {
    setPhase("exercise")
    setTimeLeft(60)
  }

  const handleAnswer = () => {
    const timeSpent = Math.min(60, Math.round((Date.now() - startTime) / 1000))
    const currentPuzzle = puzzles[currentPuzzleIndex]
    const isCorrect = selectedAnswer === currentPuzzle.correctAnswer

    // Record the answer
    setAnswers((prev) => [
      ...prev,
      {
        puzzleId: currentPuzzle.id,
        correct: isCorrect,
        timeSpent,
      },
    ])

    // Update score
    if (isCorrect) {
      // Base score + time bonus (faster = more points)
      const timeBonus = Math.max(0, 30 - timeSpent) * 2
      setScore((prev) => prev + 50 + timeBonus)
    }

    // Show feedback
    setPhase("feedback")
  }

  const nextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(60)
      setPhase("exercise")
    } else {
      // All puzzles completed
      setPhase("results")
    }
  }

  const calculateResults = () => {
    const totalAnswers = answers.length
    if (totalAnswers === 0) return { accuracy: 0, avgTime: 0 }

    const correctAnswers = answers.filter((a) => a.correct).length
    const accuracy = correctAnswers / totalAnswers

    const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0)
    const avgTime = totalTime / totalAnswers

    return { accuracy, avgTime }
  }

  const saveResults = async () => {
    setSaving(true)
    setError(null)

    try {
      const { accuracy } = calculateResults()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Calculate total time spent
      const totalTimeSpent = answers.reduce((sum, a) => sum + a.timeSpent, 0)

      // Save exercise results
      const { error: saveError } = await supabase.from("exercise_history").insert({
        user_id: user.id,
        exercise_id: exercise.id,
        score,
        accuracy,
        time_spent: totalTimeSpent,
        difficulty_level: 1, // Default level
        completed_at: new Date().toISOString(),
      })

      if (saveError) throw saveError

      // Call the API to update user stats
      const response = await fetch("/api/complete-exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseId: exercise.id,
          score,
          accuracy,
          timeSpent: totalTimeSpent,
          difficultyLevel: 1,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update stats")
      }

      // Refresh the page to show updated stats
      router.refresh()
    } catch (error: any) {
      console.error("Error saving results:", error)
      setError(error.message || "Failed to save results")
    } finally {
      setSaving(false)
    }
  }

  const restartExercise = () => {
    setPhase("intro")
    setCurrentPuzzleIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setTimeLeft(60)
    setAnswers([])
  }

  const currentPuzzle = puzzles[currentPuzzleIndex]

  return (
    <div className="flex flex-col items-center">
      {phase === "intro" && (
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold">Logic Puzzle Challenge</h2>
          <p className="text-gray-600">
            This exercise tests your logical reasoning and problem-solving abilities. You'll be presented with a series
            of logic puzzles to solve.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-left text-sm space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                Read each puzzle carefully
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                Select the correct answer from the options provided
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                You have 60 seconds for each puzzle
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                Faster answers earn more points
              </li>
            </ul>
          </div>
          <Button onClick={startExercise} className="bg-green-600 hover:bg-green-700">
            Start Exercise
          </Button>
        </div>
      )}

      {phase === "exercise" && (
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Time Left</span>
              <div className="text-xl font-bold">{timeLeft}s</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Score</span>
              <div className="text-xl font-bold text-green-600">{score}</div>
            </div>
          </div>

          <Progress value={(timeLeft / 60) * 100} className="h-2 mb-6" />

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">{currentPuzzle.question}</h3>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
              >
                <div className="space-y-3">
                  {currentPuzzle.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Button
            onClick={handleAnswer}
            className="bg-green-600 hover:bg-green-700 w-full"
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        </div>
      )}

      {phase === "feedback" && (
        <div className="w-full max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Feedback</h3>

              <div className={`p-4 rounded-lg ${answers[answers.length - 1].correct ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-start">
                  {answers[answers.length - 1].correct ? (
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${answers[answers.length - 1].correct ? "text-green-700" : "text-red-700"}`}
                    >
                      {answers[answers.length - 1].correct ? "Correct!" : "Incorrect"}
                    </p>
                    <p className="text-sm mt-1">{currentPuzzle.explanation}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Your answer: {selectedAnswer !== null ? currentPuzzle.options[selectedAnswer] : "None"}</span>
                <span>Correct answer: {currentPuzzle.options[currentPuzzle.correctAnswer]}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Time taken: {answers[answers.length - 1].timeSpent} seconds</span>
                <span>
                  Points earned:{" "}
                  {answers[answers.length - 1].correct
                    ? 50 + Math.max(0, 30 - answers[answers.length - 1].timeSpent) * 2
                    : 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button onClick={nextPuzzle} className="bg-green-600 hover:bg-green-700 w-full">
            {currentPuzzleIndex < puzzles.length - 1 ? "Next Puzzle" : "See Results"}
          </Button>
        </div>
      )}

      {phase === "results" && (
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Exercise Complete!</h2>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">{score}</div>
            <p className="text-gray-600">Your Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-green-600">{Math.round(calculateResults().accuracy * 100)}%</div>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{Math.round(calculateResults().avgTime)}s</div>
              <p className="text-sm text-gray-600">Avg. Time per Puzzle</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button onClick={restartExercise} variant="outline" className="flex-1" disabled={saving}>
              Try Again
            </Button>
            <Button onClick={saveResults} className="bg-green-600 hover:bg-green-700 flex-1" disabled={saving}>
              {saving ? "Saving..." : "Save Results"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
