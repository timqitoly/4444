import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export type UserRole = "owner" | "admin" | "moderator"

export type User = {
  id: string
  email: string
  role: UserRole
  name: string
  createdAt: Date
}

// Получение текущего пользователя
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    if (error || !data) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return {
      id: data.id,
      email: session.user.email!,
      role: (data.role as UserRole) || "moderator",
      name: data.name || session.user.email!.split("@")[0],
      createdAt: new Date(data.created_at),
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Проверка аутентификации и перенаправление на страницу входа, если пользователь не аутентифицирован
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  return user
}

// Проверка роли пользователя и перенаправление на страницу ошибки, если роль не соответствует
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    redirect("/admin/unauthorized")
  }

  return user
}

// Проверки прав пользователей в зависимости от роли
export function canCreateUsers(role: UserRole): boolean {
  return role === "owner"
}

export function canEditContent(role: UserRole): boolean {
  return role === "owner" || role === "admin"
}

export function canDeleteContent(role: UserRole): boolean {
  return role === "owner" || role === "admin"
}

export function canPublishContent(role: UserRole): boolean {
  return role === "owner" || role === "admin" || role === "moderator"
}

// Регистрация нового пользователя (доступно только для владельца)
export async function createUser(email: string, password: string, name: string, role: UserRole) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  })

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error("Failed to create user")
  }

  // Создаем запись в таблице profiles
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    name,
    role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (profileError) {
    throw profileError
  }

  return data.user
}

// Логирование действий администраторов
export async function logAdminAction(
  userId: string,
  actionType: string,
  entityType: string,
  entityId: string,
  details?: Record<string, any>,
) {
  const supabase = createClient()

  const { error } = await supabase.from("admin_actions").insert({
    user_id: userId,
    action_type: actionType,
    entity_type: entityType,
    entity_id: entityId,
    details,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error logging admin action:", error)
  }
}
