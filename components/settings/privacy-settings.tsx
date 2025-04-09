"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Check, Shield, Download, Trash } from "lucide-react"

export function PrivacySettings({ user }: any) {
  const [success, setSuccess] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>Manage your data privacy preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dataCollection" className="block">
                  Data Collection
                </Label>
                <p className="text-xs text-gray-500">Allow us to collect anonymous usage data to improve the app</p>
              </div>
              <Switch id="dataCollection" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="personalizedContent" className="block">
                  Personalized Content
                </Label>
                <p className="text-xs text-gray-500">
                  Receive personalized exercise recommendations based on your performance
                </p>
              </div>
              <Switch id="personalizedContent" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="thirdPartySharing" className="block">
                  Third-Party Data Sharing
                </Label>
                <p className="text-xs text-gray-500">Allow sharing anonymized data with research partners</p>
              </div>
              <Switch id="thirdPartySharing" />
            </div>
          </div>

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>Privacy settings updated successfully!</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setSuccess(true)}>
              Save Privacy Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your personal data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Export Your Data</h3>
              <p className="text-sm text-gray-500 mb-4">
                Download a copy of all your personal data including profile information, exercise history, and progress
                metrics.
              </p>
              <Button variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium text-red-600">Delete Your Data</h3>
              <p className="text-sm text-gray-500 mb-4">
                Permanently delete all your personal data from our servers. This action cannot be undone.
              </p>
              <Button variant="destructive" className="flex items-center">
                <Trash className="mr-2 h-4 w-4" />
                Delete All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
