"use client"

import { Card } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartRadar,
  ChartRadarPoint,
  ChartRadarPolygon,
  ChartTooltip,
} from "@/components/ui/chart"
import type { CognitiveProfile } from "@/lib/supabase/schema"

export function CognitiveSkillsChart({ cognitiveProfile }: { cognitiveProfile?: CognitiveProfile }) {
  // Default data if no profile is provided
  const defaultData = [
    {
      name: "Memory",
      value: 50,
      color: "hsl(259, 59%, 59%)",
    },
    {
      name: "Focus",
      value: 50,
      color: "hsl(259, 59%, 59%)",
    },
    {
      name: "Problem Solving",
      value: 50,
      color: "hsl(259, 59%, 59%)",
    },
    {
      name: "Creativity",
      value: 50,
      color: "hsl(259, 59%, 59%)",
    },
    {
      name: "Language",
      value: 50,
      color: "hsl(259, 59%, 59%)",
    },
  ]

  // If we have a profile, use its data
  const data = cognitiveProfile
    ? [
        {
          name: "Memory",
          value: cognitiveProfile.memory_score,
          color: "hsl(259, 59%, 59%)",
        },
        {
          name: "Focus",
          value: cognitiveProfile.focus_score,
          color: "hsl(259, 59%, 59%)",
        },
        {
          name: "Problem Solving",
          value: cognitiveProfile.problem_solving_score,
          color: "hsl(259, 59%, 59%)",
        },
        {
          name: "Creativity",
          value: cognitiveProfile.creativity_score,
          color: "hsl(259, 59%, 59%)",
        },
        {
          name: "Language",
          value: cognitiveProfile.language_score,
          color: "hsl(259, 59%, 59%)",
        },
      ]
    : defaultData

  return (
    <Card className="w-full p-4">
      <ChartContainer className="aspect-[4/3] w-full" data={data}>
        <Chart
          dataKey="value"
          categories={["Memory", "Focus", "Problem Solving", "Creativity", "Language"]}
          colors={["hsl(259, 59%, 59%)"]}
          valueFormatter={(value) => `${value}%`}
          startAngle={0}
          endAngle={360}
        >
          <ChartRadar className="fill-purple-400/20 stroke-purple-600 stroke-2">
            <ChartRadarPolygon />
            <ChartRadarPoint />
          </ChartRadar>
          <ChartTooltip />
        </Chart>
      </ChartContainer>
      <div className="mt-4">
        <ChartLegend>
          {data.map((item) => (
            <ChartLegendItem key={item.name} name={item.name} color={item.color} />
          ))}
        </ChartLegend>
      </div>
    </Card>
  )
}
