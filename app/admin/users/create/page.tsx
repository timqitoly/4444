"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createUser } from "../actions"

// Определяем начальное состояние формы
const initialState = {
  error: null,
}

export default function CreateUserPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [state, formAction] = useActionState(createUser, initialState)
  const [role, setRole] = useState<string>("moderator")

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      // Добавляем роль в formData
      formData.set("role", role)
      await formAction(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Link href="/admin/users" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к списку пользователей
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Добавление нового пользователя</CardTitle>
          <CardDescription>Создайте нового пользователя с доступом к панели администрации</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" name="password" type="password" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Роль</Label>
                <Select defaultValue="moderator" onValueChange={(value) => setRole(value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="moderator">Модератор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/users">Отмена</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание...
                </>
              ) : (
                "Создать пользователя"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
