"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/singleton-client"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export default function AuthGuard({ children, requiredRoles = ["owner", "admin", "moderator"] }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseClient()

        // Получаем текущую сессию
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          router.push("/admin-login")
          return
        }

        // Получаем профиль пользователя
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionData.session.user.id)
          .single()

        if (profileError || !profile) {
          console.error("Error fetching profile:", profileError)
          router.push("/admin-login")
          return
        }

        // Проверяем роль
        if (!requiredRoles.includes(profile.role)) {
          router.push("/admin-login")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/admin-login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
