"use client"

import type * as React from "react"

type ChartProps = {
  dataKey: string
  categories: string[]
  colors: string[]
  valueFormatter: (value: number) => string
  startAngle: number
  endAngle: number
  children: React.ReactNode
  data: any[]
}

export const Chart = ({ children, dataKey, categories, colors, valueFormatter, startAngle, endAngle }: ChartProps) => {
  return <svg>{children}</svg>
}

export const ChartContainer = ({
  children,
  className,
  data,
}: { children: React.ReactNode; className?: string; data: any[] }) => {
  return <div className={className}>{children}</div>
}

export const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartLegendItem = ({ name, color }: { name: string; color: string }) => {
  return <div>{name}</div>
}

export const ChartRadar = ({ children }: { children: React.ReactNode }) => {
  return <g>{children}</g>
}

export const ChartRadarPoint = () => {
  return <circle />
}

export const ChartRadarPolygon = () => {
  return <polygon />
}

export const ChartTooltip = () => {
  return <div></div>
}
