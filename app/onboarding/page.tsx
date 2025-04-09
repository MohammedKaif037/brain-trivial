"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Brain, ChevronRight, Clock, Dumbbell, Lightbulb, Puzzle, MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // User preferences
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["memory", "focus", "problem_solving"])
  const [difficulty, setDifficulty] = useState("medium")
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("09:00")

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleComplete = async () => {
    setLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not found")
      }

      // Update user preferences
      const { error } = await supabase
        .from("user_preferences")
        .update({
          preferred_categories: selectedCategories,
          preferred_difficulty: difficulty,
          daily_goal_minutes: dailyGoalMinutes,
          reminder_enabled: reminderEnabled,
          reminder_time: reminderTime + ":00",
        })
        .eq("user_id", user.id)

      if (error) {
        throw error
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Welcome to Brain Gym</h1>
          <p className="text-gray-600 mt-2">Let's personalize your brain training experience</p>

          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i === step ? "bg-purple-600" : i < step ? "bg-purple-300" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>What would you like to improve?</CardTitle>
              <CardDescription>Select the cognitive areas you want to focus on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="memory"
                    checked={selectedCategories.includes("memory")}
                    onCheckedChange={() => handleCategoryToggle("memory")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="memory" className="font-medium flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-purple-600" />
                      Memory
                    </Label>
                    <p className="text-sm text-gray-500">Improve recall and retention</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="focus"
                    checked={selectedCategories.includes("focus")}
                    onCheckedChange={() => handleCategoryToggle("focus")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="focus" className="font-medium flex items-center">
                      <Dumbbell className="h-4 w-4 mr-2 text-blue-600" />
                      Focus
                    </Label>
                    <p className="text-sm text-gray-500">Enhance attention and concentration</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="problem_solving"
                    checked={selectedCategories.includes("problem_solving")}
                    onCheckedChange={() => handleCategoryToggle("problem_solving")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="problem_solving" className="font-medium flex items-center">
                      <Puzzle className="h-4 w-4 mr-2 text-green-600" />
                      Problem Solving
                    </Label>
                    <p className="text-sm text-gray-500">Develop logical reasoning skills</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="creativity"
                    checked={selectedCategories.includes("creativity")}
                    onCheckedChange={() => handleCategoryToggle("creativity")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="creativity" className="font-medium flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                      Creativity
                    </Label>
                    <p className="text-sm text-gray-500">Boost creative thinking</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="language"
                    checked={selectedCategories.includes("language")}
                    onCheckedChange={() => handleCategoryToggle("language")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="language" className="font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-red-600" />
                      Language
                    </Label>
                    <p className="text-sm text-gray-500">Enhance verbal fluency and comprehension</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>How challenging do you want your exercises?</CardTitle>
              <CardDescription>Select your preferred difficulty level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy - Gentle exercises to build confidence</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium - Balanced challenge for steady improvement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard - Intense workouts for maximum cognitive gains</Label>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Daily goal (minutes)</Label>
                  <span className="font-medium">{dailyGoalMinutes} min</span>
                </div>
                <Slider
                  value={[dailyGoalMinutes]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={(value) => setDailyGoalMinutes(value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
              <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Would you like daily reminders?</CardTitle>
              <CardDescription>We can remind you to train your brain every day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reminder"
                  checked={reminderEnabled}
                  onCheckedChange={(checked) => setReminderEnabled(checked === true)}
                />
                <Label htmlFor="reminder">Enable daily reminders</Label>
              </div>

              {reminderEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Reminder time</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <input
                      id="reminderTime"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="border rounded-md p-2"
                    />
                  </div>
                </div>
              )}

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">You're all set!</h3>
                <p className="text-purple-700 text-sm">
                  Based on your preferences, we'll create a personalized brain training program for you. You can always
                  adjust these settings later.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
              <Button onClick={handleComplete} className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? "Saving..." : "Start Training"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
