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
import DeleteJobButton from "./components/delete-job-button"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobsAndUserRole = async () => {
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

        // Загружаем вакансии
        const { data, error } = await supabase.from("jobs").select("*").order("published_at", { ascending: false })

        if (error) {
          console.error("Error loading jobs:", error)
          return
        }

        setJobs(data || [])
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobsAndUserRole()
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
              <h1 className="text-3xl font-bold mb-2">Управление вакансиями</h1>
              <p className="text-muted-foreground">Управление вакансиями на портале DavisState</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Поиск вакансий..." className="pl-8 w-[250px]" />
              </div>
              {canEdit && (
                <Button asChild>
                  <Link href="/admin-panel/jobs/create">
                    <Plus className="mr-2 h-4 w-4" /> Добавить вакансию
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Вакансии</CardTitle>
              <CardDescription>Список всех вакансий на портале</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Департамент</TableHead>
                    <TableHead>Зарплата</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Дедлайн</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Вакансии не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.salary} ₽</TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.type}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(job.deadline)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {canEdit && (
                              <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin-panel/jobs/edit/${job.id}`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Редактировать</span>
                                </Link>
                              </Button>
                            )}
                            {canDelete && <DeleteJobButton id={job.id} />}
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
