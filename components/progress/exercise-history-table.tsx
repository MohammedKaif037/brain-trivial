"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import type { ExerciseHistory } from "@/lib/supabase/schema"

export function ExerciseHistoryTable({
  exerciseHistory,
}: {
  exerciseHistory: ExerciseHistory[]
}) {
  const [history, setHistory] = useState<(ExerciseHistory & { exercise_title?: string; exercise_category?: string })[]>(
    [],
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!exerciseHistory.length) {
      setLoading(false)
      return
    }

    const fetchExerciseDetails = async () => {
      setLoading(true)

      const exerciseIds = exerciseHistory.map((item) => item.exercise_id)

      // Get exercise details
      const { data: exercises } = await supabase.from("exercises").select("id, title, category").in("id", exerciseIds)

      if (exercises) {
        // Create a map of exercise details
        const exerciseMap = new Map()
        exercises.forEach((exercise) => {
          exerciseMap.set(exercise.id, {
            title: exercise.title,
            category: exercise.category,
          })
        })

        // Add exercise details to history items
        const historyWithDetails = exerciseHistory.map((item) => {
          const exerciseDetails = exerciseMap.get(item.exercise_id)
          return {
            ...item,
            exercise_title: exerciseDetails?.title || "Unknown Exercise",
            exercise_category: exerciseDetails?.category || "unknown",
          }
        })

        setHistory(historyWithDetails)
      } else {
        setHistory(exerciseHistory)
      }

      setLoading(false)
    }

    fetchExerciseDetails()
  }, [exerciseHistory])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No exercise history available yet. Complete some exercises to see your history.
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "memory":
        return "bg-purple-100 text-purple-800"
      case "focus":
        return "bg-blue-100 text-blue-800"
      case "problem_solving":
        return "bg-green-100 text-green-800"
      case "creativity":
        return "bg-yellow-100 text-yellow-800"
      case "language":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exercise</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Time Spent</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.exercise_title}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getCategoryColor(item.exercise_category || "")}>
                  {item.exercise_category?.charAt(0).toUpperCase() + (item.exercise_category?.slice(1) || "")}
                </Badge>
              </TableCell>
              <TableCell>{item.score}</TableCell>
              <TableCell>{Math.round(item.accuracy * 100)}%</TableCell>
              <TableCell>{Math.round(item.time_spent / 60)} min</TableCell>
              <TableCell>{new Date(item.completed_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
