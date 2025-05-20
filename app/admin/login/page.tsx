"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { login } from "./actions"

// Определяем начальное состояние формы
const initialState = {
  success: false,
  error: null,
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [state, formAction] = useActionState(login, initialState)
  const router = useRouter()

  // Если вход успешен, перенаправляем на страницу админки
  useEffect(() => {
    if (state?.success) {
      router.push("/admin/dashboard")
    }
  }, [state?.success, router])

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      await formAction(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Вход в панель администрации</CardTitle>
        <CardDescription>Введите свои учетные данные для входа в панель администрации</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent>
          {state?.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
                <Button variant="link" className="h-auto p-0 text-sm" type="button">
                  Забыли пароль?
                </Button>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Для получения доступа к панели администрации обратитесь к администратору системы
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
