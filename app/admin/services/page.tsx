import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requireAuth, canEditContent, canDeleteContent } from "@/lib/auth"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Edit, Plus, Search } from "lucide-react"
import { getServices } from "./actions"
import DeleteServiceButton from "./components/delete-service-button"

export const metadata: Metadata = {
  title: "Управление услугами - DavisState",
  description: "Управление государственными услугами на портале DavisState",
}

export default async function AdminServicesPage() {
  const user = await requireAuth()
  const services = await getServices()

  const canEdit = canEditContent(user.role)
  const canDelete = canDeleteContent(user.role)

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление услугами</h1>
          <p className="text-muted-foreground">Управление государственными услугами на портале DavisState</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Поиск услуг..." className="pl-8 w-[250px]" />
          </div>
          {canEdit && (
            <Button asChild>
              <Link href="/admin/services/create">
                <Plus className="mr-2 h-4 w-4" /> Добавить услугу
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Департамент</TableHead>
              <TableHead>Стоимость</TableHead>
              <TableHead>Срок</TableHead>
              <TableHead>Просмотры</TableHead>
              <TableHead>Обновлено</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Услуги не найдены
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>{service.department}</TableCell>
                  <TableCell>{service.cost} ₽</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>{service.views}</TableCell>
                  <TableCell>{formatDate(service.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {canEdit && (
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/services/edit/${service.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Редактировать</span>
                          </Link>
                        </Button>
                      )}
                      {canDelete && <DeleteServiceButton id={service.id} />}
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
