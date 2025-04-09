"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export function ProfileForm({ user, userProfile, preferences }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState(userProfile?.full_name || "")
  const [username, setUsername] = useState(userProfile?.username || "")
  const [preferredCategories, setPreferredCategories] = useState<string[]>(
    preferences?.preferred_categories || ["memory", "focus", "problem_solving"],
  )
  const [preferredDifficulty, setPreferredDifficulty] = useState(preferences?.preferred_difficulty || "medium")
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(preferences?.daily_goal_minutes || 15)
  const [reminderEnabled, setReminderEnabled] = useState(preferences?.reminder_enabled || false)
  const [reminderTime, setReminderTime] = useState(preferences?.reminder_time?.slice(0, 5) || "09:00")
  const [theme, setTheme] = useState(preferences?.theme || "light")

  const handleCategoryToggle = (category: string) => {
    if (preferredCategories.includes(category)) {
      setPreferredCategories(preferredCategories.filter((c) => c !== category))
    } else {
      setPreferredCategories([...preferredCategories, category])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          username: username,
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // Update user preferences
      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .update({
          preferred_categories: preferredCategories,
          preferred_difficulty: preferredDifficulty,
          daily_goal_minutes: dailyGoalMinutes,
          reminder_enabled: reminderEnabled,
          reminder_time: reminderTime + ":00",
          theme: theme,
        })
        .eq("user_id", user.id)

      if (preferencesError) throw preferencesError

      setSuccess(true)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email} disabled />
              <p className="text-xs text-gray-500">Email cannot be changed. Contact support for assistance.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Preferences</CardTitle>
            <CardDescription>Customize your brain training experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Preferred Categories</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="memory"
                    checked={preferredCategories.includes("memory")}
                    onCheckedChange={() => handleCategoryToggle("memory")}
                  />
                  <Label htmlFor="memory">Memory</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="focus"
                    checked={preferredCategories.includes("focus")}
                    onCheckedChange={() => handleCategoryToggle("focus")}
                  />
                  <Label htmlFor="focus">Focus</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="problem_solving"
                    checked={preferredCategories.includes("problem_solving")}
                    onCheckedChange={() => handleCategoryToggle("problem_solving")}
                  />
                  <Label htmlFor="problem_solving">Problem Solving</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="creativity"
                    checked={preferredCategories.includes("creativity")}
                    onCheckedChange={() => handleCategoryToggle("creativity")}
                  />
                  <Label htmlFor="creativity">Creativity</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="language"
                    checked={preferredCategories.includes("language")}
                    onCheckedChange={() => handleCategoryToggle("language")}
                  />
                  <Label htmlFor="language">Language</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Difficulty</Label>
              <RadioGroup value={preferredDifficulty} onValueChange={setPreferredDifficulty}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyGoal">Daily Goal (minutes)</Label>
              <Select
                value={dailyGoalMinutes.toString()}
                onValueChange={(value) => setDailyGoalMinutes(Number.parseInt(value))}
              >
                <SelectTrigger id="dailyGoal">
                  <SelectValue placeholder="Select daily goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="reminderEnabled">Daily Reminders</Label>
              <Switch id="reminderEnabled" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
            </div>

            {reminderEnabled && (
              <div className="space-y-2">
                <Label htmlFor="reminderTime">Reminder Time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="block">
                  Email Notifications
                </Label>
                <p className="text-xs text-gray-500">Receive updates and tips via email</p>
              </div>
              <Switch id="emailNotifications" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup value={theme} onValueChange={setTheme}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
