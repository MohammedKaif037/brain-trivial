import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/auth/login")
    }

    return (
      <>
        <DashboardNav />
        {children}
      </>
    )
  } catch (error) {
    console.error("Error in dashboard layout:", error)
    redirect("/auth/login")
  }
}
