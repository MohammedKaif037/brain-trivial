"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase/client"
import { Award, Brain, Calendar, Clock, Lock, Trophy } from "lucide-react"

// Mock achievements data - in a real app, this would come from the database
const ACHIEVEMENTS = [
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: <Calendar className="h-8 w-8 text-orange-500" />,
    category: "streak",
    requirement: 7,
    xp: 100,
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: <Calendar className="h-8 w-8 text-orange-500" />,
    category: "streak",
    requirement: 30,
    xp: 500,
  },
  {
    id: "exercises-10",
    title: "Getting Started",
    description: "Complete 10 exercises",
    icon: <Brain className="h-8 w-8 text-purple-500" />,
    category: "exercises",
    requirement: 10,
    xp: 50,
  },
  {
    id: "exercises-50",
    title: "Brain Enthusiast",
    description: "Complete 50 exercises",
    icon: <Brain className="h-8 w-8 text-purple-500" />,
    category: "exercises",
    requirement: 50,
    xp: 200,
  },
  {
    id: "exercises-100",
    title: "Century Club",
    description: "Complete 100 exercises",
    icon: <Brain className="h-8 w-8 text-purple-500" />,
    category: "exercises",
    requirement: 100,
    xp: 500,
  },
  {
    id: "time-60",
    title: "Hour of Power",
    description: "Train for a total of 60 minutes",
    icon: <Clock className="h-8 w-8 text-blue-500" />,
    category: "time",
    requirement: 60,
    xp: 100,
  },
  {
    id: "time-300",
    title: "Dedicated Mind",
    description: "Train for a total of 5 hours",
    icon: <Clock className="h-8 w-8 text-blue-500" />,
    category: "time",
    requirement: 300,
    xp: 300,
  },
  {
    id: "score-70",
    title: "Brain Booster",
    description: "Reach a Brain Health Score of 70",
    icon: <Award className="h-8 w-8 text-yellow-500" />,
    category: "score",
    requirement: 70,
    xp: 200,
  },
  {
    id: "score-90",
    title: "Cognitive Champion",
    description: "Reach a Brain Health Score of 90",
    icon: <Trophy className="h-8 w-8 text-yellow-500" />,
    category: "score",
    requirement: 90,
    xp: 500,
  },
]

export function AchievementsList({ userId }: { userId?: string }) {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchUserProfile = async () => {
      setLoading(true)

      const { data } = await supabase.from("users").select("*").eq("id", userId).single()

      if (data) {
        setUserProfile(data)
      }

      setLoading(false)
    }

    fetchUserProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Unable to load achievements. Please try again later.
      </div>
    )
  }

  // Calculate achievement progress
  const getAchievementProgress = (achievement: any) => {
    switch (achievement.category) {
      case "streak":
        return {
          current: userProfile.current_streak || 0,
          isCompleted: (userProfile.current_streak || 0) >= achievement.requirement,
        }
      case "exercises":
        return {
          current: userProfile.exercises_completed || 0,
          isCompleted: (userProfile.exercises_completed || 0) >= achievement.requirement,
        }
      case "time":
        return {
          current: userProfile.total_time_spent || 0,
          isCompleted: (userProfile.total_time_spent || 0) >= achievement.requirement,
        }
      case "score":
        return {
          current: userProfile.brain_health_score || 0,
          isCompleted: (userProfile.brain_health_score || 0) >= achievement.requirement,
        }
      default:
        return { current: 0, isCompleted: false }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map((achievement) => {
          const { current, isCompleted } = getAchievementProgress(achievement)
          const progress = Math.min(100, Math.round((current / achievement.requirement) * 100))

          return (
            <Card key={achievement.id} className={isCompleted ? "border-green-200" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-100" : "bg-gray-100"}`}>
                    {achievement.icon}
                  </div>
                  <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-500" : ""}>
                    {isCompleted ? "Completed" : `${progress}%`}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {current} / {achievement.requirement}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />

                  <div className="flex justify-between text-sm pt-2">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{achievement.xp} XP</span>
                    </div>
                    {!isCompleted && (
                      <div className="flex items-center text-gray-500">
                        <Lock className="h-3 w-3 mr-1" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Progress</CardTitle>
          <CardDescription>Your overall achievement completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm font-medium text-purple-600">
                  {ACHIEVEMENTS.filter((a) => getAchievementProgress(a).isCompleted).length} / {ACHIEVEMENTS.length}
                </span>
              </div>
              <Progress
                value={
                  (ACHIEVEMENTS.filter((a) => getAchievementProgress(a).isCompleted).length / ACHIEVEMENTS.length) * 100
                }
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-orange-800">Streaks</h3>
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-sm text-orange-700">
                  {ACHIEVEMENTS.filter((a) => a.category === "streak" && getAchievementProgress(a).isCompleted).length}{" "}
                  / {ACHIEVEMENTS.filter((a) => a.category === "streak").length} completed
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-purple-800">Exercises</h3>
                  <Brain className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-sm text-purple-700">
                  {
                    ACHIEVEMENTS.filter((a) => a.category === "exercises" && getAchievementProgress(a).isCompleted)
                      .length
                  }{" "}
                  / {ACHIEVEMENTS.filter((a) => a.category === "exercises").length} completed
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-blue-800">Time</h3>
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm text-blue-700">
                  {ACHIEVEMENTS.filter((a) => a.category === "time" && getAchievementProgress(a).isCompleted).length} /{" "}
                  {ACHIEVEMENTS.filter((a) => a.category === "time").length} completed
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-yellow-800">Scores</h3>
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-sm text-yellow-700">
                  {ACHIEVEMENTS.filter((a) => a.category === "score" && getAchievementProgress(a).isCompleted).length} /{" "}
                  {ACHIEVEMENTS.filter((a) => a.category === "score").length} completed
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
