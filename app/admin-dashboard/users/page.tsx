"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Loader2, Plus, UserCog, UserMinus } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuthAndLoadUsers() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        // Получаем профиль текущего пользователя
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError || !profile) {
          console.error("Error fetching profile:", profileError)
          router.push("/login")
          return
        }

        // Проверяем, что пользователь - владелец
        if (profile.role !== "owner") {
          router.push("/admin-dashboard")
          return
        }

        setCurrentUser({
          id: session.user.id,
          role: profile.role,
        })

        // Загружаем всех пользователей
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .order("role", { ascending: false })

        if (error) {
          console.error("Error loading users:", error)
          return
        }

        setUsers(profiles || [])
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadUsers()
  }, [router, supabase])

  function getUserRoleName(role: string) {
    switch (role) {
      case "owner":
        return "Владелец"
      case "admin":
        return "Администратор"
      case "moderator":
        return "Модератор"
      default:
        return "Неизвестно"
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
        <Link href="/admin-dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к панели управления
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
            <p className="text-muted-foreground">Управление пользователями, имеющими доступ к панели администрации</p>
          </div>
          <Button asChild>
            <Link href="/admin-dashboard/users/create">
              <Plus className="mr-2 h-4 w-4" /> Добавить пользователя
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Пользователи системы</CardTitle>
            <CardDescription>Список всех пользователей, имеющих доступ к панели администрации</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Пользователи не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || "—"}</TableCell>
                      <TableCell>{user.email || "—"}</TableCell>
                      <TableCell>{getUserRoleName(user.role)}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin-dashboard/users/edit/${user.id}`}>
                              <UserCog className="h-4 w-4" />
                              <span className="sr-only">Редактировать</span>
                            </Link>
                          </Button>
                          {user.id !== currentUser?.id && (
                            <Button variant="outline" size="icon" className="text-destructive">
                              <UserMinus className="h-4 w-4" />
                              <span className="sr-only">Удалить</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
