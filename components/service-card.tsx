import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, FileText } from "lucide-react"
import Link from "next/link"
import type { Service } from "@/types/service"

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <div className="p-2 bg-primary/10 rounded-md">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="grid gap-1">
          <CardTitle className="text-lg">{service.title}</CardTitle>
          <CardDescription className="line-clamp-2">{service.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>Срок: {service.duration}</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-2">
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link href={`/services/${service.id}`}>
            Подробнее <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
