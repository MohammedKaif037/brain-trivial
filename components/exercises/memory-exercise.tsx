"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

type GridCell = {
  id: number
  active: boolean
  selected: boolean
  correct: boolean | null
}

export function MemoryExercise() {
  const gridSize = 5 // 5x5 grid
  const [phase, setPhase] = useState<"memorize" | "recall" | "feedback">("memorize")
  const [timeLeft, setTimeLeft] = useState(5) // seconds to memorize
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [grid, setGrid] = useState<GridCell[]>([])
  const [activeCount, setActiveCount] = useState(3) // Start with 3 active cells

  // Initialize grid
  useEffect(() => {
    resetGrid()
  }, [level])

  // Timer for memorize phase
  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (phase === "memorize" && timeLeft === 0) {
      setPhase("recall")
      // Hide the active cells for recall phase
      setGrid(grid.map((cell) => ({ ...cell, active: false })))
    }
  }, [phase, timeLeft, grid])

  const resetGrid = () => {
    // Create empty grid
    const newGrid: GridCell[] = Array.from({ length: gridSize * gridSize }, (_, i) => ({
      id: i,
      active: false,
      selected: false,
      correct: null,
    }))

    // Randomly activate cells based on level
    const cellCount = Math.min(3 + level - 1, 15) // Increase active cells with level, max 15
    setActiveCount(cellCount)

    const activeCells = new Set<number>()
    while (activeCells.size < cellCount) {
      activeCells.add(Math.floor(Math.random() * (gridSize * gridSize)))
    }

    activeCells.forEach((i) => {
      newGrid[i].active = true
    })

    setGrid(newGrid)
    setPhase("memorize")
    setTimeLeft(Math.max(3, 7 - Math.floor(level / 2))) // Decrease time with level, min 3 seconds
  }

  const handleCellClick = (id: number) => {
    if (phase !== "recall") return

    setGrid(grid.map((cell) => (cell.id === id ? { ...cell, selected: !cell.selected } : cell)))
  }

  const checkAnswers = () => {
    let correct = 0
    const newGrid = grid.map((cell) => {
      const isCorrect = (cell.active && cell.selected) || (!cell.active && !cell.selected)
      if (isCorrect) correct++
      return { ...cell, correct: isCorrect, active: cell.active } // Show active cells again
    })

    setGrid(newGrid)
    setPhase("feedback")

    // Calculate score: base points * level * accuracy percentage
    const basePoints = 10
    const accuracy = correct / (gridSize * gridSize)
    const levelPoints = Math.round(basePoints * level * accuracy)
    setScore(score + levelPoints)
  }

  const nextLevel = () => {
    // Check if enough cells were correctly identified
    const correctCells = grid.filter((cell) => cell.correct).length
    const accuracy = correctCells / (gridSize * gridSize)

    if (accuracy >= 0.8) {
      // 80% accuracy to advance
      setLevel(level + 1)
    }

    resetGrid()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        {phase === "memorize" && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Memorize the Pattern</h3>
            <div className="text-2xl font-bold">{timeLeft}</div>
            <p className="text-sm text-gray-500">Remember which squares are highlighted</p>
          </div>
        )}

        {phase === "recall" && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recall the Pattern</h3>
            <p className="text-sm text-gray-500">
              Click on the squares that were highlighted. Select {activeCount} squares.
            </p>
          </div>
        )}

        {phase === "feedback" && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Results</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                <span>Correct</span>
              </div>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-1" />
                <span>Incorrect</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="grid gap-2 mb-6"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: "min(100%, 400px)",
        }}
      >
        {grid.map((cell) => (
          <div
            key={cell.id}
            onClick={() => handleCellClick(cell.id)}
            className={`
              aspect-square rounded-md border-2 cursor-pointer flex items-center justify-center transition-all
              ${phase === "memorize" && cell.active ? "bg-purple-500 border-purple-600" : ""}
              ${phase === "recall" && cell.selected ? "bg-blue-200 border-blue-400" : ""}
              ${phase === "feedback" && cell.active && cell.correct ? "bg-green-200 border-green-500" : ""}
              ${phase === "feedback" && cell.active && !cell.correct ? "bg-red-200 border-red-500" : ""}
              ${phase === "feedback" && !cell.active && !cell.correct ? "bg-red-200 border-red-500" : ""}
              ${!cell.active && !cell.selected && phase !== "feedback" ? "bg-gray-100 border-gray-200 hover:bg-gray-200" : ""}
            `}
          >
            {phase === "feedback" && (
              <>
                {cell.correct ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        {phase === "recall" && (
          <Button onClick={checkAnswers} className="bg-purple-600 hover:bg-purple-700">
            Check Answers
          </Button>
        )}

        {phase === "feedback" && (
          <Button onClick={nextLevel} className="bg-purple-600 hover:bg-purple-700">
            {level === 10 ? "Finish Exercise" : "Next Pattern"}
          </Button>
        )}
      </div>
    </div>
  )
}
