"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, type User, createUser as authCreateUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getUsers(): Promise<User[]> {
  const supabase = createClient()

  // Получаем текущего пользователя
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role !== "owner") {
    return []
  }

  try {
    // Получаем пользователей из auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error("Error fetching auth users:", authError)
      return []
    }

    // Получаем профили пользователей
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*")

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return []
    }

    // Сопоставляем данные
    return authUsers.users.map((authUser) => {
      const profile = profiles.find((p) => p.id === authUser.id) || {}

      return {
        id: authUser.id,
        email: authUser.email || "",
        role: profile.role || "moderator",
        name: profile.name || authUser.email?.split("@")[0] || "",
        createdAt: new Date(authUser.created_at || Date.now()),
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function createUser(formData: FormData) {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role !== "owner") {
    throw new Error("Unauthorized")
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as "admin" | "moderator"

  if (!email || !password || !name || !role) {
    return { error: "Все поля обязательны для заполнения" }
  }

  try {
    await authCreateUser(email, password, name, role)
    revalidatePath("/admin/users")
    redirect("/admin/users")
  } catch (error: any) {
    return { error: error.message || "Ошибка при создании пользователя" }
  }
}
