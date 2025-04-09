"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Moon, Sun, Laptop } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export function AppearanceSettings({ user, preferences }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [theme, setTheme] = useState(preferences?.theme || "light")

  const handleSaveAppearance = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Update user preferences
      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .update({
          theme,
        })
        .eq("user_id", user.id)

      if (preferencesError) throw preferencesError

      setSuccess(true)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Failed to update appearance settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveAppearance} className="space-y-6">
            <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <RadioGroupItem value="light" id="light" className="sr-only peer" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                >
                  <Sun className="h-6 w-6 mb-3 text-yellow-500" />
                  <div className="space-y-1 text-center">
                    <p className="font-medium leading-none">Light</p>
                    <p className="text-xs text-gray-500">Use light theme</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="dark" id="dark" className="sr-only peer" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                >
                  <Moon className="h-6 w-6 mb-3 text-blue-700" />
                  <div className="space-y-1 text-center">
                    <p className="font-medium leading-none">Dark</p>
                    <p className="text-xs text-gray-500">Use dark theme</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="system" id="system" className="sr-only peer" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                >
                  <Laptop className="h-6 w-6 mb-3 text-gray-700" />
                  <div className="space-y-1 text-center">
                    <p className="font-medium leading-none">System</p>
                    <p className="text-xs text-gray-500">Follow system theme</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertDescription>Appearance settings updated successfully!</AlertDescription>
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
          <CardTitle>Font Size</CardTitle>
          <CardDescription>Adjust the text size for better readability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup defaultValue="medium" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <RadioGroupItem value="small" id="small" className="sr-only peer" />
                <Label
                  htmlFor="small"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                >
                  <div className="text-sm mb-3">Aa</div>
                  <div className="space-y-1 text-center">
                    <p className="font-medium leading-none">Small</p>
                    <p className="text-xs text-gray-500">Compact text</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="medium" id="medium" className="sr-only peer" />
                <Label
                  htmlFor="medium"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                >
                  <div className="text-base mb-3">Aa</div>
                  <div className="space-y-1 text-center">
                    <p className="font-medium leading-none">Medium</p>
                    <p className="text-xs text-gray-500">Default text size</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="large" id="large" className="sr-only peer" />
                <Label
                  htmlFor="large"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                >
                  <div className="text-lg mb-3">Aa</div>
                  <div className="space-y-1 text-center">
                    <p className="font-medium leading-none">Large</p>
                    <p className="text-xs text-gray-500">Larger text size</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="flex justify-end">
              <Button className="bg-purple-600 hover:bg-purple-700">Save Font Size</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
