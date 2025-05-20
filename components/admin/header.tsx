"use client"

import { Button } from "@/components/ui/button"
import { logout } from "@/app/admin-login/actions"
import type { User } from "@/lib/auth"
import { ModeToggle } from "@/components/mode-toggle"
import { useRouter } from "next/navigation"
import { LogOut, UserIcon } from "lucide-react"

interface AdminHeaderProps {
  user: User
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/admin-login")
  }

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span>{user.name}</span>
              <span className="text-xs text-muted-foreground">
                ({user.role === "owner" ? "Владелец" : user.role === "admin" ? "Администратор" : "Модератор"})
              </span>
            </div>
            <Button variant="ghost" size="icon" type="button" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Выйти</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
