"use client"

import { Card } from "@/components/ui/card"
import type { CognitiveProfile } from "@/lib/supabase/schema"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

export function SkillsRadarChart({ cognitiveProfile }: { cognitiveProfile?: CognitiveProfile }) {
  // Default data if no profile is provided
  const defaultData = [
    { subject: "Memory", A: 50, fullMark: 100 },
    { subject: "Focus", A: 50, fullMark: 100 },
    { subject: "Problem Solving", A: 50, fullMark: 100 },
    { subject: "Creativity", A: 50, fullMark: 100 },
    { subject: "Language", A: 50, fullMark: 100 },
  ]

  // If we have a profile, use its data
  const data = cognitiveProfile
    ? [
        { subject: "Memory", A: cognitiveProfile.memory_score, fullMark: 100 },
        { subject: "Focus", A: cognitiveProfile.focus_score, fullMark: 100 },
        { subject: "Problem Solving", A: cognitiveProfile.problem_solving_score, fullMark: 100 },
        { subject: "Creativity", A: cognitiveProfile.creativity_score, fullMark: 100 },
        { subject: "Language", A: cognitiveProfile.language_score, fullMark: 100 },
      ]
    : defaultData

  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  )
}
