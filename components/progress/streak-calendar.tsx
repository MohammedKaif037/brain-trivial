"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import type { DailyStreak } from "@/lib/supabase/schema"

export function StreakCalendar({
  userId,
  streakData,
}: {
  userId?: string
  streakData?: DailyStreak[]
}) {
  const [data, setData] = useState<DailyStreak[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (streakData) {
      setData(streakData)
      setLoading(false)
      return
    }

    if (!userId) return

    const fetchStreakData = async () => {
      setLoading(true)

      const { data } = await supabase
        .from("daily_streaks")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(30)

      if (data) {
        setData(data)
      }

      setLoading(false)
    }

    fetchStreakData()
  }, [userId, streakData])

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
        No streak data available yet. Complete exercises daily to build your streak.
      </div>
    )
  }

  // Get the current month and year
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Create an array of days for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Create a map of dates with streak data
  const streakMap = new Map()
  data.forEach((streak) => {
    const date = new Date(streak.date)
    const day = date.getDate()
    streakMap.set(day, streak)
  })

  return (
    <Card className="p-4">
      <div className="text-center mb-4">
        <h3 className="font-medium">
          {now.toLocaleString("default", { month: "long" })} {currentYear}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Add empty cells for days before the 1st of the month */}
        {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }, (_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}

        {days.map((day) => {
          const streak = streakMap.get(day)
          const isToday = day === now.getDate()

          return (
            <div
              key={day}
              className={`
                h-10 flex items-center justify-center rounded-md text-sm
                ${isToday ? "border border-purple-300" : ""}
                ${streak ? "bg-purple-100 text-purple-800 font-medium" : "hover:bg-gray-50"}
              `}
              title={streak ? `${streak.exercises_completed} exercises, ${streak.total_time} minutes` : ""}
            >
              {day}
              {streak && <div className="w-1.5 h-1.5 bg-purple-600 rounded-full absolute mt-6"></div>}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
