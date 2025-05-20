import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, UserCog, UserMinus } from "lucide-react"
import Link from "next/link"
import { requireRole } from "@/lib/auth"
import { getUsers } from "./actions"

export const metadata = {
  title: "Управление пользователями - DavisState",
  description: "Управление пользователями системы DavisState",
}

export default async function UsersPage() {
  // Проверка, что пользователь имеет роль owner
  const currentUser = await requireRole(["owner"])
  const users = await getUsers()

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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
          <p className="text-muted-foreground">Управление пользователями, имеющими доступ к панели администрации</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getUserRoleName(user.role)}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/users/edit/${user.id}`}>
                          <UserCog className="h-4 w-4" />
                          <span className="sr-only">Редактировать</span>
                        </Link>
                      </Button>
                      {user.id !== currentUser.id && (
                        <Button variant="outline" size="icon" className="text-destructive">
                          <UserMinus className="h-4 w-4" />
                          <span className="sr-only">Удалить</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
