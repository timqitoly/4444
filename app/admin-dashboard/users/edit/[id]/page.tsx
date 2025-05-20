"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuthAndLoadUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        // Получаем профиль текущего пользователя
        const { data: currentProfile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (profileError || !currentProfile) {
          console.error("Error fetching current profile:", profileError)
          router.push("/login")
          return
        }

        // Проверяем, что пользователь - владелец
        if (currentProfile.role !== "owner") {
          router.push("/admin-dashboard")
          return
        }

        // Загружаем данные редактируемого пользователя
        const { data: profile, error: userError } = await supabase.from("profiles").select("*").eq("id", id).single()

        if (userError || !profile) {
          console.error("Error fetching user profile:", userError)
          router.push("/admin-dashboard/users")
          return
        }

        // Получаем email пользователя из auth.users
        const { data: userData, error: authError } = await supabase.auth.admin.getUserById(id)

        if (authError) {
          console.error("Error fetching user auth data:", authError)
        }

        setName(profile.name || "")
        setEmail(userData?.user?.email || "")
        setRole(profile.role || "moderator")
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadUser()
  }, [id, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Обновляем профиль пользователя
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name,
          role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (profileError) {
        throw profileError
      }

      router.push("/admin-dashboard/users")
    } catch (error: any) {
      console.error("Error updating user:", error)
      setError(error.message || "Произошла ошибка при обновлении пользователя")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/admin-dashboard/users"
          className="flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к списку пользователей
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Редактирование пользователя</CardTitle>
            <CardDescription>Измените данные пользователя</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Email нельзя изменить</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Роль</Label>
                  <Select value={role} onValueChange={(value) => setRole(value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Владелец</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="moderator">Модератор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin-dashboard/users">Отмена</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  "Сохранить"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
