import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requireAuth, canEditContent, canDeleteContent } from "@/lib/auth"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Edit, Plus, Search } from "lucide-react"
import { getNews } from "./actions"
import DeleteNewsButton from "./components/delete-news-button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Управление новостями - DavisState",
  description: "Управление новостями на портале DavisState",
}

export default async function AdminNewsPage() {
  const user = await requireAuth()
  const news = await getNews()

  const canEdit = canEditContent(user.role)
  const canDelete = canDeleteContent(user.role)

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление новостями</h1>
          <p className="text-muted-foreground">Управление новостями на портале DavisState</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Поиск новостей..." className="pl-8 w-[250px]" />
          </div>
          {canEdit && (
            <Button asChild>
              <Link href="/admin/news/create">
                <Plus className="mr-2 h-4 w-4" /> Добавить новость
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заголовок</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Автор</TableHead>
              <TableHead>Дата публикации</TableHead>
              <TableHead>Обновлено</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Новости не найдены
                </TableCell>
              </TableRow>
            ) : (
              news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{formatDate(item.published_at)}</TableCell>
                  <TableCell>{formatDate(item.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {canEdit && (
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/news/edit/${item.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Редактировать</span>
                          </Link>
                        </Button>
                      )}
                      {canDelete && <DeleteNewsButton id={item.id} />}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
