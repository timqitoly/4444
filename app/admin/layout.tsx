import type React from "react"
import type { Metadata } from "next"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Панель администрации - DavisState",
  description: "Панель администрации портала государственных услуг DavisState",
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()

  // Middleware уже обрабатывает перенаправление,
  // поэтому здесь мы просто отображаем layout
  return (
    <div className="flex min-h-screen flex-col">
      {user && <AdminHeader user={user} />}
      <div className="flex flex-1">
        {user && <AdminSidebar />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
