import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Проверяем, авторизован ли пользователь
  const isAuthenticated = !!session

  // Получаем путь запроса
  const path = request.nextUrl.pathname

  // Если пользователь не авторизован и пытается получить доступ к админке
  if (!isAuthenticated && path.startsWith("/admin") && path !== "/admin-login") {
    return NextResponse.redirect(new URL("/admin-login", request.url))
  }

  // Если пользователь авторизован и пытается получить доступ к странице логина
  if (isAuthenticated && path === "/admin-login") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return res
}

// Указываем, для каких путей должен срабатывать middleware
export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
}
