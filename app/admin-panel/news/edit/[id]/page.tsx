"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase/singleton-client"
import AuthGuard from "@/components/auth-guard"

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = params
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const supabase = getSupabaseClient()

        const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

        if (error) {
          console.error("Error fetching news:", error)
          setError("Новость не найдена")
          return
        }

        setTitle(data.title || "")
        setSummary(data.summary || "")
        setContent(data.content || "")
        setAuthor(data.author || "")
        setCategory(data.category || "Общество")
        setImageUrl(data.image_url || "")
      } catch (error) {
        console.error("Error:", error)
        setError("Произошла ошибка при загрузке новости")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase
        .from("news")
        .update({
          title,
          summary,
          content,
          author,
          category,
          image_url: imageUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        throw error
      }

      router.push("/admin-panel/news")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating news:", error)
      setError(error.message || "Произошла ошибка при обновлении новости")
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

  if (error && !title) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/admin-panel/news" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку новостей
          </Link>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requiredRoles={["owner", "admin"]}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/admin-panel/news" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку новостей
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Редактирование новости</CardTitle>
              <CardDescription>Измените информацию о новости</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Заголовок</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Краткое описание</Label>
                    <Textarea
                      id="summary"
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Содержание</Label>
                    <Textarea
                      id="content"
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Автор</Label>
                      <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <Select value={category} onValueChange={(value) => setCategory(value)}>
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
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/admin-panel/news">Отмена</Link>
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
    </AuthGuard>
  )
}
