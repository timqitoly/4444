"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()

  const isAdminPage = pathname.startsWith("/admin-panel")

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-2xl mr-8">
            DavisState
          </Link>

          {!isAdminPage && (
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/services" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Услуги</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/jobs" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Вакансии</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>О правительстве</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/about"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">О нас</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Информация о правительстве DavisState
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/about/structure"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Структура</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Структура правительства Davis
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/news" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Новости</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/map" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Карта</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Еще</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/important"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Важная информация</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/faq"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Часто задаваемые вопросы</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/contacts"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Контакты</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isAdminPage && (
            <>
              {showSearch ? (
                <div className="relative">
                  <Input type="search" placeholder="Поиск..." className="w-[200px] md:w-[300px]" autoFocus />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowSearch(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </>
          )}

          <ModeToggle />

          {!isAdminPage && (
            <>
              <Button asChild variant="outline" className="hidden md:inline-flex">
                <Link href="/admin-login">Вход для администрации (TEMP)</Link>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="grid gap-4 py-4">
                    <Link href="/services" className="text-sm font-medium hover:underline">
                      Услуги
                    </Link>
                    <Link href="/jobs" className="text-sm font-medium hover:underline">
                      Вакансии
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:underline">
                      О правительстве
                    </Link>
                    <Link href="/news" className="text-sm font-medium hover:underline">
                      Новости
                    </Link>
                    <Link href="/map" className="text-sm font-medium hover:underline">
                      Карта
                    </Link>
                    <Link href="/important" className="text-sm font-medium hover:underline">
                      Важная информация
                    </Link>
                    <Link href="/faq" className="text-sm font-medium hover:underline">
                      Часто задаваемые вопросы
                    </Link>
                    <Link href="/contacts" className="text-sm font-medium hover:underline">
                      Контакты
                    </Link>
                    <Link href="/admin-login" className="text-sm font-medium hover:underline">
                      Вход для администрации
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
