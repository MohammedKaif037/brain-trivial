import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProgressChart } from "@/components/progress/progress-chart"
import { SkillsRadarChart } from "@/components/progress/skills-radar-chart"
import { StreakCalendar } from "@/components/progress/streak-calendar"
import { ExerciseHistoryTable } from "@/components/progress/exercise-history-table"
import { CategoryBreakdown } from "@/components/progress/category-breakdown"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Brain, Calendar, ChevronUp, Clock, LineChart, ListChecks, Target, Trophy } from "lucide-react"

export default async function ProgressPage() {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user?.id).single()

  // Get cognitive profile
  const { data: cognitiveProfile } = await supabase
    .from("cognitive_profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  // Get exercise history
  const { data: exerciseHistory } = await supabase
    .from("exercise_history")
    .select("*")
    .eq("user_id", user?.id)
    .order("completed_at", { ascending: false })
    .limit(10)

  // Get streak data
  const { data: streakData } = await supabase
    .from("daily_streaks")
    .select("*")
    .eq("user_id", user?.id)
    .order("date", { ascending: false })
    .limit(30)

  // Get user goals
  const { data: userGoals } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", user?.id)
    .order("end_date", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-gray-500">Track your cognitive improvement over time</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
          <a href="/progress/goals">
            <Target className="mr-2 h-4 w-4" /> Set New Goal
          </a>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Brain Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-purple-600">{userProfile?.brain_health_score || 50}</div>
              <div className="text-green-500 flex items-center text-sm font-medium">
                +3 <ChevronUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Overall cognitive health</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-orange-500">{userProfile?.current_streak || 0}</div>
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Consecutive days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Exercises Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">{userProfile?.exercises_completed || 0}</div>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Total exercises</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Time Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">{userProfile?.total_time_spent || 0}m</div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Total training time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Cognitive Skills</TabsTrigger>
          <TabsTrigger value="history">Exercise History</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Progress Over Time
                </CardTitle>
                <CardDescription>Your brain health score progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressChart userId={user?.id} />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Cognitive Skills
                </CardTitle>
                <CardDescription>Your performance by area</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsRadarChart cognitiveProfile={cognitiveProfile} />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Activity Calendar
                </CardTitle>
                <CardDescription>Your training consistency</CardDescription>
              </CardHeader>
              <CardContent>
                <StreakCalendar userId={user?.id} streakData={streakData} />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListChecks className="mr-2 h-5 w-5" />
                  Category Breakdown
                </CardTitle>
                <CardDescription>Exercises by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown userId={user?.id} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Memory</CardTitle>
                <CardDescription>Your ability to recall and retain information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Current Score</span>
                      <span className="text-sm font-medium text-purple-600">
                        {cognitiveProfile?.memory_score || 50}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${cognitiveProfile?.memory_score || 50}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Recommended Exercises</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                        Pattern Memory Challenge
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                        Sequence Recall
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                        Visual Memory Test
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Focus</CardTitle>
                <CardDescription>Your ability to concentrate and maintain attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Current Score</span>
                      <span className="text-sm font-medium text-blue-600">
                        {cognitiveProfile?.focus_score || 50}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${cognitiveProfile?.focus_score || 50}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Recommended Exercises</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        Dual N-Back Task
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        Sustained Attention
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        Distraction Resistance
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Problem Solving</CardTitle>
                <CardDescription>Your ability to analyze and solve complex problems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Current Score</span>
                      <span className="text-sm font-medium text-green-600">
                        {cognitiveProfile?.problem_solving_score || 50}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${cognitiveProfile?.problem_solving_score || 50}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Recommended Exercises</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        Logic Grid Puzzles
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        Pattern Recognition
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        Strategic Planning
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creativity</CardTitle>
                <CardDescription>Your ability to think creatively and generate new ideas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Current Score</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {cognitiveProfile?.creativity_score || 50}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-600 rounded-full"
                        style={{ width: `${cognitiveProfile?.creativity_score || 50}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Recommended Exercises</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                        Alternative Uses Task
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                        Creative Visualization
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                        Divergent Thinking
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListChecks className="mr-2 h-5 w-5" />
                Exercise History
              </CardTitle>
              <CardDescription>Your recent exercise completions</CardDescription>
            </CardHeader>
            <CardContent>
              <ExerciseHistoryTable exerciseHistory={exerciseHistory || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userGoals && userGoals.length > 0 ? (
              userGoals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <CardTitle>{goal.title}</CardTitle>
                    <CardDescription>{goal.description || "No description provided"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium text-purple-600">
                            {goal.current_value} / {goal.target_value}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${(goal.current_value / goal.target_value) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-500">Goal Type:</span>{" "}
                          <span className="font-medium">
                            {goal.goal_type.charAt(0).toUpperCase() + goal.goal_type.slice(1)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">End Date:</span>{" "}
                          <span className="font-medium">
                            {goal.end_date ? new Date(goal.end_date).toLocaleDateString() : "Ongoing"}
                          </span>
                        </div>
                      </div>

                      {goal.completed ? (
                        <div className="bg-green-50 text-green-700 p-2 rounded-md text-sm">
                          Completed on {new Date(goal.completed_at!).toLocaleDateString()}
                        </div>
                      ) : (
                        <Button size="sm" className="w-full">
                          Update Progress
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No goals set yet</h3>
                <p className="text-gray-500 mb-4">Set goals to track your progress and stay motivated</p>
                <Button asChild>
                  <a href="/progress/goals">Set Your First Goal</a>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
