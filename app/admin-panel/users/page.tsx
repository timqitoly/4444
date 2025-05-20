"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Loader2, Plus, UserCog, UserMinus } from "lucide-react"
import Link from "next/link"
import AuthGuard from "@/components/auth-guard"
import { getUsers } from "./actions"
import { getSupabaseClient } from "@/lib/supabase/singleton-client"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get current user from client-side
        const supabase = getSupabaseClient()
        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData.session) {
          setCurrentUser({
            id: sessionData.session.user.id,
          })
        }

        // Get all users from server action
        const usersData = await getUsers()
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

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
    <AuthGuard requiredRoles={["owner"]}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/admin-panel" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к панели управления
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
              <p className="text-muted-foreground">Управление пользователями, имеющими доступ к панели администрации</p>
            </div>
            <Button asChild>
              <Link href="/admin-panel/users/create">
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
                              <Link href={`/admin-panel/users/edit/${user.id}`}>
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
    </AuthGuard>
  )
}
