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
import { createNews, updateNews } from "../actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Определяем начальное состояние формы
const initialState = {
  error: null,
}

interface NewsFormProps {
  news?: any
  id?: string
}

export default function NewsForm({ news, id }: NewsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [category, setCategory] = useState(news?.category || "Общество")

  const [state, formAction] = useActionState(async (formData: FormData) => {
    // Добавляем категорию в formData
    formData.set("category", category)

    if (id) {
      return updateNews(id, formData)
    } else {
      return createNews(formData)
    }
  }, initialState)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      await formAction(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = !!news

  return (
    <>
      <Link href="/admin/news" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к списку новостей
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Редактирование новости" : "Добавление новой новости"}</CardTitle>
          <CardDescription>
            {isEditing ? "Измените информацию о новости" : "Заполните форму для добавления новой новости"}
          </CardDescription>
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
                <Label htmlFor="title">Заголовок</Label>
                <Input id="title" name="title" defaultValue={news?.title} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Краткое описание</Label>
                <Textarea id="summary" name="summary" rows={2} defaultValue={news?.summary} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Содержание</Label>
                <Textarea id="content" name="content" rows={10} defaultValue={news?.content} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Автор</Label>
                  <Input id="author" name="author" defaultValue={news?.author} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select defaultValue={news?.category || "Общество"} onValueChange={(value) => setCategory(value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Общество">Общество</SelectItem>
                      <SelectItem value="Технологии">Технологии</SelectItem>
                      <SelectItem value="Бизнес">Бизнес</SelectItem>
                      <SelectItem value="Культура">Культура</SelectItem>
                      <SelectItem value="Спорт">Спорт</SelectItem>
                      <SelectItem value="Политика">Политика</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL изображения (необязательно)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  defaultValue={news?.image_url}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/news">Отмена</Link>
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
    </>
  )
}
