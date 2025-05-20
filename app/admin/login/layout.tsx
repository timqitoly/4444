import type React from "react"
import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Вход в панель администрации - DavisState",
  description: "Вход в панель администрации портала государственных услуг DavisState",
}

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Проверяем, авторизован ли пользователь
  const user = await getCurrentUser()

  // Если пользователь уже авторизован, перенаправляем на главную страницу админки
  if (user) {
    redirect("/admin/dashboard")
  }

  return <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>
}
