import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, FileText, Building, DollarSign, FileCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getServiceById } from "@/lib/services"

interface ServicePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceById(params.id)

  if (!service) {
    return {
      title: "Услуга не найдена - DavisState",
    }
  }

  return {
    title: `${service.title} - DavisState`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getServiceById(params.id)

  if (!service) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/services" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к списку услуг
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-md">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Требования</h3>
                  <p className="text-muted-foreground">{service.requirements}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Процедура получения</h3>
                  <p className="text-muted-foreground">{service.procedure}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Срок оказания</h4>
                      <p className="text-muted-foreground">{service.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Стоимость</h4>
                      <p className="text-muted-foreground">{service.cost} ₽</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Ответственный орган</h4>
                      <p className="text-muted-foreground">{service.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Получить услугу</CardTitle>
              <CardDescription>Выберите удобный способ получения услуги</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">Подать заявление онлайн</Button>
              <Button variant="outline" className="w-full">
                Записаться на прием
              </Button>

              <div className="pt-4">
                <h4 className="font-medium mb-2">Центры оказания услуги</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <FileCheck className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>МФЦ "Центральный", ул. Главная, 10</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileCheck className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>МФЦ "Северный", ул. Северная, 25</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileCheck className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>МФЦ "Южный", ул. Южная, 15</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
