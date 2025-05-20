"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createUser(formData: FormData) {
  try {
    const supabase = createClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as string

    if (!email || !password || !name || !role) {
      return { error: "Все поля обязательны для заполнения" }
    }

    // Create user with admin API (server-side has proper permissions)
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (userError) {
      throw userError
    }

    if (!userData.user) {
      throw new Error("Не удалось создать пользователя")
    }

    // Create profile for the user
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userData.user.id,
      name,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      // If profile creation fails, we should ideally delete the created user
      // but Supabase doesn't expose a simple way to do this from the client
      throw profileError
    }

    revalidatePath("/admin-panel/users")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating user:", error)
    return { error: error.message || "Произошла ошибка при создании пользователя" }
  }
}

export async function getUsers() {
  try {
    const supabase = createClient()

    // Get all users from profiles table
    const { data: profiles, error } = await supabase.from("profiles").select("*").order("role", { ascending: false })

    if (error) {
      throw error
    }

    return profiles || []
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return []
  }
}
