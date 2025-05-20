"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Plus, Search } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase/singleton-client"
import AuthGuard from "@/components/auth-guard"
import DeleteNewsButton from "./components/delete-news-button"

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewsAndUserRole = async () => {
      try {
        const supabase = getSupabaseClient()

        // Получаем текущую сессию
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          return
        }

        // Получаем профиль пользователя
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionData.session.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          return
        }

        setUserRole(profile.role)

        // Загружаем новости
        const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false })

        if (error) {
          console.error("Error loading news:", error)
          return
        }

        setNews(data || [])
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsAndUserRole()
  }, [])

  const canEdit = userRole === "owner" || userRole === "admin"
  const canDelete = userRole === "owner" || userRole === "admin"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/admin-panel" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к панели управления
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Управление новостями</h1>
              <p className="text-muted-foreground">Управление новостями на портале DavisState</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Поиск новостей..." className="pl-8 w-[250px]" />
              </div>
              {canEdit && (
                <Button asChild>
                  <Link href="/admin-panel/news/create">
                    <Plus className="mr-2 h-4 w-4" /> Добавить новость
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Новости</CardTitle>
              <CardDescription>Список всех новостей на портале</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Заголовок</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Дата публикации</TableHead>
                    <TableHead>Обновлено</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Новости не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    news.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.author}</TableCell>
                        <TableCell>{formatDate(item.published_at)}</TableCell>
                        <TableCell>{formatDate(item.updated_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {canEdit && (
                              <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin-panel/news/edit/${item.id}`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Редактировать</span>
                                </Link>
                              </Button>
                            )}
                            {canDelete && <DeleteNewsButton id={item.id} />}
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
