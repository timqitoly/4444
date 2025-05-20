"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

// Получение всех услуг
export async function getServices() {
  const supabase = createClient()

  const { data, error } = await supabase.from("services").select("*").order("title", { ascending: true })

  if (error) {
    console.error("Error fetching services:", error)
    throw new Error("Не удалось загрузить услуги")
  }

  return data
}

// Получение услуги по ID
export async function getServiceById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("services").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching service with id ${id}:`, error)
    throw new Error("Услуга не найдена")
  }

  return data
}

// Создание новой услуги
export async function createService(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Необходима авторизация")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const duration = formData.get("duration") as string
  const requirements = formData.get("requirements") as string
  const procedure = formData.get("procedure") as string
  const department = formData.get("department") as string
  const cost = formData.get("cost") as string

  if (!title || !description || !duration || !requirements || !procedure || !department || !cost) {
    return { error: "Все поля обязательны для заполнения" }
  }

  const supabase = createClient()

  const { error } = await supabase.from("services").insert({
    title,
    description,
    duration,
    requirements,
    procedure,
    department,
    cost,
    views: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error creating service:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/services")
  redirect("/admin/services")
}

// Обновление услуги
export async function updateService(id: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Необходима авторизация")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const duration = formData.get("duration") as string
  const requirements = formData.get("requirements") as string
  const procedure = formData.get("procedure") as string
  const department = formData.get("department") as string
  const cost = formData.get("cost") as string

  if (!title || !description || !duration || !requirements || !procedure || !department || !cost) {
    return { error: "Все поля обязательны для заполнения" }
  }

  const supabase = createClient()

  const { error } = await supabase
    .from("services")
    .update({
      title,
      description,
      duration,
      requirements,
      procedure,
      department,
      cost,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating service:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/services")
  redirect("/admin/services")
}

// Удаление услуги
export async function deleteService(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Необходима авторизация")
  }

  const supabase = createClient()

  const { error } = await supabase.from("services").delete().eq("id", id)

  if (error) {
    console.error("Error deleting service:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/services")
  return { success: true }
}
