import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user?.id).single()

  // Get user preferences
  const { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", user?.id).single()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings user={user} userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings user={user} preferences={preferences} />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings user={user} preferences={preferences} />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
