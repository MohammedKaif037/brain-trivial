"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { supabase } from "@/lib/supabase/client"

export function DailyStreakCalendar({ userId }: { userId?: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [completedDays, setCompletedDays] = useState<Date[]>([])

  useEffect(() => {
    if (!userId) return

    const fetchStreakData = async () => {
      const { data } = await supabase
        .from("daily_streaks")
        .select("date")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(30)

      if (data) {
        const dates = data.map((item) => new Date(item.date))
        setCompletedDays(dates)
      }
    }

    fetchStreakData()
  }, [userId])

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      modifiers={{
        completed: completedDays,
      }}
      modifiersClassNames={{
        completed: "bg-purple-100 text-purple-600 font-bold",
      }}
    />
  )
}
