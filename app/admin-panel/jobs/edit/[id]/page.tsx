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

interface EditJobPageProps {
  params: {
    id: string
  }
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const { id } = params
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [salary, setSalary] = useState("")
  const [type, setType] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const supabase = getSupabaseClient()

        const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single()

        if (error) {
          console.error("Error fetching job:", error)
          setError("Вакансия не найдена")
          return
        }

        setTitle(data.title || "")
        setDepartment(data.department || "")
        setLocation(data.location || "")
        setDescription(data.description || "")
        setRequirements(data.requirements || "")
        setSalary(data.salary || "")
        setType(data.type || "Полная занятость")


      } catch (error) {
        console.error("Error:", error)
        setError("Произошла ошибка при загрузке вакансии")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      const { error } = await supabase
        .from("jobs")
        .update({
          title,
          department,
          location,
          description,
          requirements,
          salary,
          type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        throw error
      }

      router.push("/admin-panel/jobs")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating job:", error)
      setError(error.message || "Произошла ошибка при обновлении вакансии")
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
          <Link href="/admin-panel/jobs" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку вакансий
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
          <Link href="/admin-panel/jobs" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку вакансий
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Редактирование вакансии</CardTitle>
              <CardDescription>Измените информацию о вакансии</CardDescription>
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
                    <Label htmlFor="title">Название вакансии</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Департамент</Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Местоположение</Label>
                      <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Требования</Label>
                    <Textarea
                      id="requirements"
                      rows={4}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Зарплата</Label>
                      <Input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Тип занятости</Label>
                      <Select value={type} onValueChange={(value) => setType(value)}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Выберите тип занятости" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Полная занятость">Полная занятость</SelectItem>
                          <SelectItem value="Частичная занятость">Частичная занятость</SelectItem>
                          <SelectItem value="Удаленная работа">Удаленная работа</SelectItem>
                          <SelectItem value="Стажировка">Стажировка</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/admin-panel/jobs">Отмена</Link>
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
