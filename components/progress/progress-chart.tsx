"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function ProgressChart({ userId }: { userId?: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchProgressData = async () => {
      setLoading(true)

      // Get exercise history with dates
      const { data: exerciseHistory } = await supabase
        .from("exercise_history")
        .select("completed_at, score")
        .eq("user_id", userId)
        .order("completed_at", { ascending: true })

      if (exerciseHistory) {
        // Group by date and calculate average score
        const groupedByDate = exerciseHistory.reduce((acc: Record<string, any>, item) => {
          const date = new Date(item.completed_at).toISOString().split("T")[0]

          if (!acc[date]) {
            acc[date] = {
              date,
              scores: [],
            }
          }

          acc[date].scores.push(item.score)
          return acc
        }, {})

        // Calculate averages and format for chart
        const chartData = Object.values(groupedByDate).map((item: any) => {
          const avgScore = item.scores.reduce((sum: number, score: number) => sum + score, 0) / item.scores.length

          return {
            date: item.date,
            score: Math.round(avgScore),
          }
        })

        setData(chartData)
      }

      setLoading(false)
    }

    fetchProgressData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No progress data available yet. Complete some exercises to see your progress.
      </div>
    )
  }

  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value) => [`${value}`, "Score"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8b5cf6" activeDot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
