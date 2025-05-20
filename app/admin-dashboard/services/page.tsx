"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Edit, Loader2, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuthAndLoadServices() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        // Получаем профиль пользователя
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (profileError || !profile) {
          console.error("Error fetching profile:", profileError)
          router.push("/login")
          return
        }

        setUserRole(profile.role)

        // Загружаем услуги
        const { data, error } = await supabase.from("services").select("*").order("title", { ascending: true })

        if (error) {
          console.error("Error loading services:", error)
          return
        }

        setServices(data || [])
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadServices()
  }, [router, supabase])

  const canEdit = userRole === "owner" || userRole === "admin"
  const canDelete = userRole === "owner" || userRole === "admin"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
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
            <h1 className="text-3xl font-bold mb-2">Управление услугами</h1>
            <p className="text-muted-foreground">Управление государственными услугами на портале DavisState</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Поиск услуг..." className="pl-8 w-[250px]" />
            </div>
            {canEdit && (
              <Button asChild>
                <Link href="/admin-dashboard/services/create">
                  <Plus className="mr-2 h-4 w-4" /> Добавить услугу
                </Link>
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Услуги</CardTitle>
            <CardDescription>Список всех государственных услуг на портале</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Департамент</TableHead>
                  <TableHead>Стоимость</TableHead>
                  <TableHead>Срок</TableHead>
                  <TableHead>Просмотры</TableHead>
                  <TableHead>Обновлено</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Услуги не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>{service.department}</TableCell>
                      <TableCell>{service.cost} ₽</TableCell>
                      <TableCell>{service.duration}</TableCell>
                      <TableCell>{service.views}</TableCell>
                      <TableCell>{formatDate(service.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {canEdit && (
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/admin-dashboard/services/edit/${service.id}`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Редактировать</span>
                              </Link>
                            </Button>
                          )}
                          {canDelete && (
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
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
