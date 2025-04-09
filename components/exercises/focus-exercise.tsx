"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, X, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function FocusExercise({ exercise }: { exercise: any }) {
  const router = useRouter()
  const [phase, setPhase] = useState<"intro" | "exercise" | "results">("intro")
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds for the exercise
  const [targets, setTargets] = useState<{ id: number; isTarget: boolean; letter: string }[]>([])
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0)
  const [responses, setResponses] = useState<{ correct: boolean; reactionTime: number }[]>([])
  const [showingTarget, setShowingTarget] = useState(false)
  const [targetStartTime, setTargetStartTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const targetTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize the exercise
  useEffect(() => {
    if (phase === "exercise") {
      // Start the timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up, show results
            clearInterval(timerRef.current!)
            setPhase("results")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Generate targets
      generateTargets()

      // Show first target
      showNextTarget()
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (targetTimerRef.current) clearTimeout(targetTimerRef.current)
    }
  }, [phase])

  const generateTargets = () => {
    // Generate a sequence of letters, some are targets (e.g., 'X')
    const targetLetter = "X"
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const newTargets = []

    // Generate 30 items, with 30% being targets
    for (let i = 0; i < 30; i++) {
      const isTarget = Math.random() < 0.3
      const letter = isTarget ? targetLetter : letters[Math.floor(Math.random() * letters.length)]

      newTargets.push({
        id: i,
        isTarget,
        letter,
      })
    }

    setTargets(newTargets)
  }

  const showNextTarget = () => {
    if (currentTargetIndex >= targets.length) {
      // All targets shown, end exercise
      setPhase("results")
      return
    }

    setShowingTarget(true)
    setTargetStartTime(Date.now())

    // Hide the target after a random time (1-3 seconds)
    const displayTime = 1000 + Math.random() * 2000
    targetTimerRef.current = setTimeout(() => {
      setShowingTarget(false)
      // Move to next target after a pause
      setTimeout(showNextTarget, 500 + Math.random() * 1000)
      setCurrentTargetIndex((prev) => prev + 1)
    }, displayTime)
  }

  const handleResponse = (response: boolean) => {
    if (!showingTarget) return

    // Clear the timer for the current target
    if (targetTimerRef.current) clearTimeout(targetTimerRef.current)

    const currentTarget = targets[currentTargetIndex]
    const reactionTime = Date.now() - targetStartTime
    const isCorrect = (response && currentTarget.isTarget) || (!response && !currentTarget.isTarget)

    // Record the response
    setResponses((prev) => [...prev, { correct: isCorrect, reactionTime }])

    // Update score
    if (isCorrect) {
      setScore((prev) => prev + 10)
    }

    // Hide the current target
    setShowingTarget(false)

    // Show the next target after a pause
    setTimeout(() => {
      setCurrentTargetIndex((prev) => prev + 1)
      showNextTarget()
    }, 500)
  }

  const calculateResults = () => {
    const totalResponses = responses.length
    if (totalResponses === 0) return { accuracy: 0, avgReactionTime: 0 }

    const correctResponses = responses.filter((r) => r.correct).length
    const accuracy = correctResponses / totalResponses

    const totalReactionTime = responses.reduce((sum, r) => sum + r.reactionTime, 0)
    const avgReactionTime = totalReactionTime / totalResponses

    return { accuracy, avgReactionTime }
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

      // Save exercise results
      const { error: saveError } = await supabase.from("exercise_history").insert({
        user_id: user.id,
        exercise_id: exercise.id,
        score,
        accuracy,
        time_spent: 60 - timeLeft, // Time spent in seconds
        difficulty_level: level,
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
          timeSpent: 60 - timeLeft,
          difficultyLevel: level,
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

  const startExercise = () => {
    setPhase("exercise")
  }

  const restartExercise = () => {
    setPhase("intro")
    setScore(0)
    setTimeLeft(60)
    setTargets([])
    setCurrentTargetIndex(0)
    setResponses([])
    setShowingTarget(false)
  }

  return (
    <div className="flex flex-col items-center">
      {phase === "intro" && (
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold">Continuous Performance Test</h2>
          <p className="text-gray-600">
            This exercise tests your sustained attention and response inhibition. You'll see a series of letters appear
            on the screen.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-left text-sm space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                Press "Target" when you see the letter "X"
              </li>
              <li className="flex items-start">
                <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                Press "Not Target" for any other letter
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                Respond as quickly and accurately as possible
              </li>
            </ul>
          </div>
          <Button onClick={startExercise} className="bg-purple-600 hover:bg-purple-700">
            Start Exercise
          </Button>
        </div>
      )}

      {phase === "exercise" && (
        <div className="w-full max-w-md mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-500">Time Left</span>
              <div className="text-2xl font-bold">{timeLeft}s</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Score</span>
              <div className="text-2xl font-bold text-purple-600">{score}</div>
            </div>
          </div>

          <Progress value={(timeLeft / 60) * 100} className="h-2 mb-8" />

          <div className="bg-gray-50 rounded-lg p-8 mb-8 h-48 flex items-center justify-center">
            {showingTarget ? (
              <div className="text-6xl font-bold">{targets[currentTargetIndex]?.letter}</div>
            ) : (
              <div className="text-gray-400">+</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleResponse(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={!showingTarget}
            >
              Target (X)
            </Button>
            <Button
              onClick={() => handleResponse(false)}
              className="bg-red-600 hover:bg-red-700"
              disabled={!showingTarget}
            >
              Not Target
            </Button>
          </div>
        </div>
      )}

      {phase === "results" && (
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Exercise Complete!</h2>

          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">{score}</div>
            <p className="text-gray-600">Your Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-green-600">{Math.round(calculateResults().accuracy * 100)}%</div>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{Math.round(calculateResults().avgReactionTime)}ms</div>
              <p className="text-sm text-gray-600">Avg. Reaction Time</p>
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
            <Button onClick={saveResults} className="bg-purple-600 hover:bg-purple-700 flex-1" disabled={saving}>
              {saving ? "Saving..." : "Save Results"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
