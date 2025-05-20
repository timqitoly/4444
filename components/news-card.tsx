import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import type { News } from "@/types/news"
import { formatDate } from "@/lib/utils"

interface NewsCardProps {
  news: News
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{news.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{formatDate(news.publishedAt)}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <CardDescription className="line-clamp-3">{news.summary}</CardDescription>
      </CardContent>
      <CardFooter className="mt-auto pt-2">
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link href={`/news/${news.id}`}>
            Читать полностью <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
