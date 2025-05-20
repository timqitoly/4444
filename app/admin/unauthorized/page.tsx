import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">Доступ запрещен</CardTitle>
          <CardDescription>У вас недостаточно прав для доступа к этой странице</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>
            Если вы считаете, что это ошибка, свяжитесь с администратором системы для получения необходимого уровня
            доступа.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/admin">Вернуться на главную</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
