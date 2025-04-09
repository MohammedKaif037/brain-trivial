import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  BarChartIcon as ChartBar,
  Clock,
  Dumbbell,
  Flame,
  Lightbulb,
  MessageSquare,
  Trophy,
} from "lucide-react"
import { CognitiveSkillsChart } from "@/components/cognitive-skills-chart"
import { DailyStreakCalendar } from "@/components/daily-streak-calendar"
import { RecommendedExercises } from "@/components/recommended-exercises"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function Dashboard() {
  const supabase = createServerSupabaseClient()

  // Get user data
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

  // Get recommended exercises
  const { data: recommendedExercises } = await supabase.from("exercises").select("*").limit(4)

  // Get daily learning content
  const { data: learningContent } = await supabase
    .from("learning_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Get coach message
  const { data: coachMessages } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", user?.id)
    .eq("role", "assistant")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userProfile?.full_name?.split(" ")[0] || "User"}</h1>
          <p className="text-gray-500">Your brain is ready for today's workout!</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Dumbbell className="mr-2 h-4 w-4" /> Start Today's Workout
        </Button>
      </div>

      {/* Brain Health Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Brain Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-purple-600">{userProfile?.brain_health_score || 50}</div>
              <div className="text-green-500 flex items-center text-sm font-medium">
                +3 <ChartBar className="ml-1 h-4 w-4" />
              </div>
            </div>
            <Progress value={userProfile?.brain_health_score || 50} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-orange-500">{userProfile?.current_streak || 0}</div>
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Keep it going!</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Exercises Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">{userProfile?.exercises_completed || 0}</div>
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Total brain workouts</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Time Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">{userProfile?.total_time_spent || 0}m</div>
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Total training time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Cognitive Skills</CardTitle>
                <CardDescription>Your performance across different cognitive domains</CardDescription>
              </CardHeader>
              <CardContent>
                <CognitiveSkillsChart cognitiveProfile={cognitiveProfile} />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Daily Streak</CardTitle>
                <CardDescription>Your brain workout consistency</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyStreakCalendar userId={user?.id} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Personalized exercises based on your profile and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendedExercises exercises={recommendedExercises || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-2">Progress tracking content will appear here</h3>
            <p className="text-gray-500 mb-4">Detailed charts and analytics of your cognitive improvement</p>
            <Button asChild>
              <a href="/progress">View Full Progress</a>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="exercises">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-2">Exercise library will appear here</h3>
            <p className="text-gray-500 mb-4">Browse and filter all available brain exercises</p>
            <Button asChild>
              <a href="/exercises">Browse Exercises</a>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-2">AI-powered insights will appear here</h3>
            <p className="text-gray-500 mb-4">Personalized recommendations and observations about your brain health</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              Today's Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">{learningContent?.title || "The Neuroplasticity Phenomenon"}</h3>
            <p className="text-gray-600 mb-4">
              {learningContent?.content ||
                "Your brain can physically change and reorganize itself in response to learning and experience, even into old age. This ability is called neuroplasticity."}
            </p>
            <Button variant="outline" size="sm">
              Read More
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-purple-500" />
              AI Coach Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {coachMessages?.content ||
                "I've noticed you excel at memory exercises but could use some practice with problem-solving tasks. I've added some new challenges to help strengthen that area."}
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700" size="sm" asChild>
              <a href="/coach">Chat with Coach</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={i} className="space-y-2">
                <div className="font-medium">{day}</div>
                <div
                  className={`rounded-full w-10 h-10 mx-auto flex items-center justify-center ${i === 1 ? "bg-purple-600 text-white" : "bg-gray-100"}`}
                >
                  {i + 1}
                </div>
                <div className="text-xs text-gray-500">
                  {i === 0 && "Memory"}
                  {i === 1 && "Focus"}
                  {i === 2 && "Logic"}
                  {i === 3 && "Language"}
                  {i === 4 && "Creativity"}
                  {i === 5 && "Mixed"}
                  {i === 6 && "Rest"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
