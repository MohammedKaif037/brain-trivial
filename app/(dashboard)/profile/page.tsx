import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Brain, Calendar, Clock, Edit, Medal, Trophy, User } from "lucide-react"
import { ProfileForm } from "@/components/profile/profile-form"
import { AchievementsList } from "@/components/profile/achievements-list"

export default async function ProfilePage() {
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

  // Get user preferences
  const { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", user?.id).single()

  // Get exercise history count
  const { count: exerciseCount } = await supabase
    .from("exercise_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-gray-500">Manage your account and view your achievements</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
          <a href="/profile/edit">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-4">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-bold">{userProfile?.full_name || "User"}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    Brain Health: {userProfile?.brain_health_score || 50}
                  </Badge>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    Streak: {userProfile?.current_streak || 0} days
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Member since {new Date(userProfile?.created_at || Date.now()).toLocaleDateString()}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-purple-600">{userProfile?.exercises_completed || 0}</div>
                  <div className="text-sm text-gray-500">Exercises</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-purple-600">{userProfile?.total_time_spent || 0}</div>
                  <div className="text-sm text-gray-500">Minutes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Cognitive Profile
                </CardTitle>
                <CardDescription>Your cognitive strengths and areas for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Memory</span>
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

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Focus</span>
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

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Problem Solving</span>
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

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Creativity</span>
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

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Language</span>
                      <span className="text-sm font-medium text-red-600">
                        {cognitiveProfile?.language_score || 50}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full"
                        style={{ width: `${cognitiveProfile?.language_score || 50}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Stats & Achievements
                </CardTitle>
                <CardDescription>Your brain training statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">Current Streak</span>
                    </div>
                    <span className="font-medium">{userProfile?.current_streak || 0} days</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">Exercises Completed</span>
                    </div>
                    <span className="font-medium">{userProfile?.exercises_completed || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">Total Time</span>
                    </div>
                    <span className="font-medium">{userProfile?.total_time_spent || 0} minutes</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Medal className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">Achievements</span>
                    </div>
                    <span className="font-medium">3 / 20</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">Brain Health Score</span>
                    </div>
                    <span className="font-medium">{userProfile?.brain_health_score || 50}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Preferences
                </CardTitle>
                <CardDescription>Your training preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Preferred Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {preferences?.preferred_categories.map((category: string) => (
                        <Badge key={category} variant="outline">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Preferred Difficulty</h3>
                    <Badge variant="outline" className="capitalize">
                      {preferences?.preferred_difficulty || "Medium"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Daily Goal</h3>
                    <span>{preferences?.daily_goal_minutes || 15} minutes</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Reminders</h3>
                    <span>
                      {preferences?.reminder_enabled
                        ? `Enabled (${preferences.reminder_time?.slice(0, 5) || "09:00"})`
                        : "Disabled"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Theme</h3>
                    <span className="capitalize">{preferences?.theme || "Light"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsList userId={user?.id} />
        </TabsContent>

        <TabsContent value="settings">
          <ProfileForm user={user} userProfile={userProfile} preferences={preferences} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
