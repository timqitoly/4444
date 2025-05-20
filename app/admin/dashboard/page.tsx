import type { Metadata } from "next"
import { requireAuth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Панель администрации - DavisState",
  description: "Панель администрации портала государственных услуг DavisState",
}

export default async function AdminDashboardPage() {
  const user = await requireAuth()

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Панель администрации</h1>
          <p className="text-muted-foreground">
            Добро пожаловать, {user.name}! Вы вошли как{" "}
            {user.role === "owner" ? "владелец" : user.role === "admin" ? "администратор" : "модератор"}.
          </p>
        </div>
      </div>

      {/* Остальное содержимое страницы остается без изменений */}
      {/* ... */}
    </div>
  )
}
