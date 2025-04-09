"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function CategoryBreakdown({ userId }: { userId?: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchCategoryData = async () => {
      setLoading(true)

      // Get exercise history
      const { data: exerciseHistory } = await supabase
        .from("exercise_history")
        .select("exercise_id")
        .eq("user_id", userId)

      if (exerciseHistory && exerciseHistory.length > 0) {
        const exerciseIds = exerciseHistory.map((item) => item.exercise_id)

        // Get exercise details
        const { data: exercises } = await supabase.from("exercises").select("id, category").in("id", exerciseIds)

        if (exercises) {
          // Count exercises by category
          const categoryCounts: Record<string, number> = {}

          exercises.forEach((exercise) => {
            const category = exercise.category
            categoryCounts[category] = (categoryCounts[category] || 0) + 1
          })

          // Format for chart
          const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))

          setData(chartData)
        }
      }

      setLoading(false)
    }

    fetchCategoryData()
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
        No category data available yet. Complete some exercises to see your breakdown.
      </div>
    )
  }

  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} exercises`, "Completed"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
