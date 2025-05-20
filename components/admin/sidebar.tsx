"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  FileText,
  Briefcase,
  Newspaper,
  Users,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin-login")
    router.refresh()
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
          isMobileOpen ? "block" : "hidden",
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full border-r bg-background transition-all duration-300 lg:relative",
          isCollapsed ? "w-[70px]" : "w-[250px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center px-4 border-b">
            <Link href="/admin" className="flex items-center gap-2 font-bold">
              {!isCollapsed && <span>DavisState Admin</span>}
              {isCollapsed && <span>DS</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setIsMobileOpen(false)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive("/admin") &&
                    !isActive("/admin/services") &&
                    !isActive("/admin/jobs") &&
                    !isActive("/admin/news") &&
                    !isActive("/admin/important") &&
                    !isActive("/admin/faq") &&
                    !isActive("/admin/users") &&
                    !isActive("/admin/settings") &&
                    "bg-accent",
                  isCollapsed && "justify-center",
                )}
              >
                <BarChart3 className="h-4 w-4" />
                {!isCollapsed && <span>Панель управления</span>}
              </Link>
              <Link
                href="/admin/services"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive("/admin/services") && "bg-accent",
                  isCollapsed && "justify-center",
                )}
              >
                <FileText className="h-4 w-4" />
                {!isCollapsed && <span>Услуги</span>}
              </Link>
              <Link
                href="/admin/jobs"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive("/admin/jobs") && "bg-accent",
                  isCollapsed && "justify-center",
                )}
              >
                <Briefcase className="h-4 w-4" />
                {!isCollapsed && <span>Вакансии</span>}
              </Link>
              <Link
                href="/admin/news"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive("/admin/news") && "bg-accent",
                  isCollapsed && "justify-center",
                )}
              >
                <Newspaper className="h-4 w-4" />
                {!isCollapsed && <span>Новости</span>}
              </Link>
              <Link
                href="/admin/important"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive("/admin/important") && "bg-accent",
                  isCollapsed && "justify-center",
                )}
              >
                <Bell className="h-4 w-4" />
                {!isCollapsed && <span>Важная информация</span>}
              </Link>
              <Link
                href="/admin/faq"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive("/admin/faq") && "bg-accent",
                  isCollapsed && "justify-center",
                )}
              >
                <HelpCircle className="h-4 w-4" />
                {!isCollapsed && <span>Часто задаваемые вопросы</span>}
              </Link>
              <Link
                href="/admin/users"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive("/admin/users") && "bg-accent",
                  isCollapsed && "justify-center",
                )}
              >
                <Users className="h-4 w-4" />
                {!isCollapsed && <span>Пользователи</span>}
              </Link>
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive("/admin/settings") && "bg-accent",
                  isCollapsed && "justify-center",
                )}
              >
                <Settings className="h-4 w-4" />
                {!isCollapsed && <span>Настройки</span>}
              </Link>
            </nav>
          </ScrollArea>
          <div className="mt-auto p-4 border-t">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", isCollapsed && "justify-center")}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Выйти</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
