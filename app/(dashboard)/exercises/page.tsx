import type React from "react"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Dumbbell, Lightbulb, MessageSquare, Puzzle, Search } from "lucide-react"
import { ExerciseGrid } from "@/components/exercises/exercise-grid"
import { ExerciseSkeletonGrid } from "@/components/exercises/exercise-skeleton-grid"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: { category?: string; difficulty?: string; q?: string }
}) {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user preferences
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("preferred_categories, preferred_difficulty")
    .eq("user_id", user?.id)
    .single()

  // Get categories for filter
  const { data: categories } = await supabase.from("exercises").select("category").order("category")

  // Remove duplicates
  const uniqueCategories = Array.from(new Set(categories?.map((item) => item.category) || []))

  // Get featured exercises (most popular or staff picks)
  const { data: featuredExercises } = await supabase.from("exercises").select("*").limit(4)

  // Get recently added exercises
  const { data: recentExercises } = await supabase
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4)

  // Get user's recent exercises
  const { data: userRecentExercises } = await supabase
    .from("exercise_history")
    .select("exercise_id, completed_at")
    .eq("user_id", user?.id)
    .order("completed_at", { ascending: false })
    .limit(4)

  // Fetch the actual exercise data for user's recent exercises
  let userRecentExercisesData = []
  if (userRecentExercises && userRecentExercises.length > 0) {
    const exerciseIds = userRecentExercises.map((item) => item.exercise_id)
    const { data } = await supabase.from("exercises").select("*").in("id", exerciseIds)

    userRecentExercisesData = data || []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Exercise Library</h1>
          <p className="text-gray-500">Discover exercises to train different cognitive skills</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Dumbbell className="mr-2 h-4 w-4" /> Start Daily Workout
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search exercises..." className="pl-10" defaultValue={searchParams.q} />
            </div>
            <Select defaultValue={searchParams.category || "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={searchParams.difficulty || "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Exercises</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
          <TabsTrigger value="history">Your History</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Suspense fallback={<ExerciseSkeletonGrid />}>
            <ExerciseGrid
              category={searchParams.category}
              difficulty={searchParams.difficulty}
              query={searchParams.q}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="recommended">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExercises?.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentExercises?.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          {userRecentExercisesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userRecentExercisesData.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No exercise history yet</h3>
              <p className="text-gray-500 mb-4">Complete some exercises to see your history here</p>
              <Button asChild>
                <a href="#all">Browse Exercises</a>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-600" />
              Exercise Categories
            </CardTitle>
            <CardDescription>Train different cognitive skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CategoryCard
                title="Memory"
                description="Improve recall and retention"
                icon={<Brain className="h-6 w-6 text-purple-600" />}
                color="bg-purple-50"
              />
              <CategoryCard
                title="Focus"
                description="Enhance attention and concentration"
                icon={<Dumbbell className="h-6 w-6 text-blue-600" />}
                color="bg-blue-50"
              />
              <CategoryCard
                title="Problem Solving"
                description="Develop logical reasoning skills"
                icon={<Puzzle className="h-6 w-6 text-green-600" />}
                color="bg-green-50"
              />
              <CategoryCard
                title="Language"
                description="Boost verbal fluency and comprehension"
                icon={<MessageSquare className="h-6 w-6 text-red-600" />}
                color="bg-red-50"
              />
              <CategoryCard
                title="Creativity"
                description="Enhance creative thinking"
                icon={<Lightbulb className="h-6 w-6 text-yellow-600" />}
                color="bg-yellow-50"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
              Your Training Stats
            </CardTitle>
            <CardDescription>Your exercise completion statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Memory Exercises</span>
                  <span className="text-sm font-medium text-gray-500">12 completed</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Focus Exercises</span>
                  <span className="text-sm font-medium text-gray-500">8 completed</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Problem Solving</span>
                  <span className="text-sm font-medium text-gray-500">5 completed</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: "15%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Language</span>
                  <span className="text-sm font-medium text-gray-500">3 completed</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Creativity</span>
                  <span className="text-sm font-medium text-gray-500">2 completed</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-600 rounded-full" style={{ width: "5%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ExerciseCard({ exercise }: { exercise: any }) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "memory":
        return <Brain className="h-5 w-5 text-purple-600" />
      case "focus":
        return <Dumbbell className="h-5 w-5 text-blue-600" />
      case "problem_solving":
        return <Puzzle className="h-5 w-5 text-green-600" />
      case "creativity":
        return <Lightbulb className="h-5 w-5 text-yellow-600" />
      case "language":
        return <MessageSquare className="h-5 w-5 text-red-600" />
      default:
        return <Brain className="h-5 w-5 text-purple-600" />
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-gray-100 p-2 rounded-md">{getCategoryIcon(exercise.category)}</div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                exercise.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : exercise.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
          </div>
          <h3 className="font-semibold mb-1">{exercise.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">{exercise.duration} min</div>
            <Button size="sm" asChild>
              <a href={`/exercises/${exercise.id}`}>Start</a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryCard({
  title,
  description,
  icon,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className={`${color} p-4 rounded-lg hover:shadow-sm transition-shadow`}>
      <div className="flex items-start space-x-3">
        <div className="bg-white p-2 rounded-md shadow-sm">{icon}</div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}
