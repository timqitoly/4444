"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Users, FileText, Briefcase, Newspaper, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        // Получаем профиль пользователя
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (error || !profile) {
          console.error("Error fetching profile:", error)
          router.push("/login")
          return
        }

        // Проверяем роль
        if (!["admin", "moderator", "owner"].includes(profile.role)) {
          router.push("/login")
          return
        }

        setUser({
          id: session.user.id,
          email: session.user.email,
          name: profile.name || session.user.email?.split("@")[0],
          role: profile.role,
        })
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
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
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="font-bold text-2xl">DavisState Админ-панель</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              {user?.name} (
              {user?.role === "owner" ? "Владелец" : user?.role === "admin" ? "Администратор" : "Модератор"})
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Панель управления</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin-dashboard/users">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Пользователи</CardTitle>
                <CardDescription>Управление пользователями системы</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Создание, редактирование и удаление пользователей с различными ролями
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin-dashboard/services">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Услуги</CardTitle>
                <CardDescription>Управление государственными услугами</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Добавление, редактирование и удаление услуг, предоставляемых порталом
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin-dashboard/news">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <Newspaper className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Новости</CardTitle>
                <CardDescription>Управление новостями портала</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Публикация, редактирование и удаление новостей и анонсов
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin-dashboard/jobs">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <Briefcase className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Вакансии</CardTitle>
                <CardDescription>Управление вакансиями</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Размещение, редактирование и удаление вакансий государственных учреждений
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin-dashboard/settings">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <Settings className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Настройки</CardTitle>
                <CardDescription>Настройки портала</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Управление общими настройками портала и системными параметрами
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
