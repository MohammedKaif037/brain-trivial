"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Check, Bell } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export function NotificationSettings({ user, preferences }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [reminderEnabled, setReminderEnabled] = useState(preferences?.reminder_enabled || false)
  const [reminderTime, setReminderTime] = useState(preferences?.reminder_time?.slice(0, 5) || "09:00")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [achievementNotifications, setAchievementNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [tipsAndTricks, setTipsAndTricks] = useState(true)

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Update user preferences
      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .update({
          reminder_enabled: reminderEnabled,
          reminder_time: reminderTime + ":00",
        })
        .eq("user_id", user.id)

      if (preferencesError) throw preferencesError

      setSuccess(true)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Failed to update notification settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            App Notifications
          </CardTitle>
          <CardDescription>Configure in-app notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveNotifications} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminderEnabled" className="block">
                    Daily Reminders
                  </Label>
                  <p className="text-xs text-gray-500">Receive daily reminders to complete your brain training</p>
                </div>
                <Switch id="reminderEnabled" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
              </div>

              {reminderEnabled && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-32"
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="achievementNotifications" className="block">
                    Achievement Notifications
                  </Label>
                  <p className="text-xs text-gray-500">Get notified when you earn achievements</p>
                </div>
                <Switch
                  id="achievementNotifications"
                  checked={achievementNotifications}
                  onCheckedChange={setAchievementNotifications}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertDescription>Notification settings updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage email notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="block">
                  Email Notifications
                </Label>
                <p className="text-xs text-gray-500">Receive notifications via email</p>
              </div>
              <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            {emailNotifications && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports" className="block">
                      Weekly Progress Reports
                    </Label>
                    <p className="text-xs text-gray-500">Receive weekly summaries of your brain training progress</p>
                  </div>
                  <Switch id="weeklyReports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tipsAndTricks" className="block">
                      Tips & Tricks
                    </Label>
                    <p className="text-xs text-gray-500">Receive occasional tips to improve your cognitive training</p>
                  </div>
                  <Switch id="tipsAndTricks" checked={tipsAndTricks} onCheckedChange={setTipsAndTricks} />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end">
            <Button className="bg-purple-600 hover:bg-purple-700">Save Email Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
