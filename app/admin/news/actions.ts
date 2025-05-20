"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

// Получение всех новостей
export async function getNews() {
  const supabase = createClient()

  const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching news:", error)
    throw new Error("Не удалось загрузить новости")
  }

  return data
}

// Получение новости по ID
export async function getNewsById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching news with id ${id}:`, error)
    throw new Error("Новость не найдена")
  }

  return data
}

// Создание новой новости
export async function createNews(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Необходима авторизация")
  }

  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const content = formData.get("content") as string
  const author = formData.get("author") as string
  const category = formData.get("category") as string
  const imageUrl = formData.get("imageUrl") as string

  if (!title || !summary || !content || !author || !category) {
    return { error: "Все обязательные поля должны быть заполнены" }
  }

  const supabase = createClient()

  const { error } = await supabase.from("news").insert({
    title,
    summary,
    content,
    author,
    category,
    image_url: imageUrl || null,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error creating news:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/news")
  redirect("/admin/news")
}

// Обновление новости
export async function updateNews(id: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Необходима авторизация")
  }

  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const content = formData.get("content") as string
  const author = formData.get("author") as string
  const category = formData.get("category") as string
  const imageUrl = formData.get("imageUrl") as string

  if (!title || !summary || !content || !author || !category) {
    return { error: "Все обязательные поля должны быть заполнены" }
  }

  const supabase = createClient()

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
    console.error("Error updating news:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/news")
  redirect("/admin/news")
}

// Удаление новости
export async function deleteNews(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Необходима авторизация")
  }

  const supabase = createClient()

  const { error } = await supabase.from("news").delete().eq("id", id)

  if (error) {
    console.error("Error deleting news:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/news")
  return { success: true }
}
