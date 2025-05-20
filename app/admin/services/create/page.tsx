"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createService } from "../actions"

// Определяем начальное состояние формы
const initialState = {
  error: null,
}

export default function CreateServicePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [state, formAction] = useActionState(createService, initialState)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      await formAction(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Link href="/admin/services" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к списку услуг
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Добавление новой услуги</CardTitle>
          <CardDescription>Заполните форму для добавления новой государственной услуги</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {state?.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название услуги</Label>
                <Input id="title" name="title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" name="description" rows={3} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Ответственный департамент</Label>
                  <Input id="department" name="department" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Стоимость (в рублях)</Label>
                  <Input id="cost" name="cost" type="text" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Срок оказания услуги</Label>
                <Input id="duration" name="duration" placeholder="Например: 30 дней" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Требования</Label>
                <Textarea id="requirements" name="requirements" rows={3} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedure">Процедура получения</Label>
                <Textarea id="procedure" name="procedure" rows={3} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/services">Отмена</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
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
  )
}
