import type { Metadata } from "next"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllNews } from "@/lib/news"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Search, Tag } from "lucide-react"

export const metadata: Metadata = {
  title: "Новости - DavisState",
  description: "Актуальные новости и события DavisState",
}

export default async function NewsPage() {
  const news = await getAllNews()

  // Group news by category
  const newsByCategory: Record<string, typeof news> = {}

  news.forEach((item) => {
    if (!newsByCategory[item.category]) {
      newsByCategory[item.category] = []
    }

    newsByCategory[item.category].push(item)
  })

  const categories = Object.keys(newsByCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Новости</h1>
          <p className="text-muted-foreground">Актуальные новости и события DavisState</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Поиск новостей..." className="w-full md:w-[300px] pl-8" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 flex flex-wrap h-auto">
          <TabsTrigger value="all">Все новости</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-8">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Image
                      src={item.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover aspect-video"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col p-6">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-md flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {item.category}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pb-4 flex-grow">
                      <p className="text-muted-foreground">{item.summary}</p>
                    </CardContent>
                    <CardFooter className="p-0 pt-2 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Автор: {item.author}</span>
                      <Button asChild variant="ghost" className="gap-1">
                        <Link href={`/news/${item.id}`}>
                          Читать полностью <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 gap-8">
              {newsByCategory[category].map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <Image
                        src={item.imageUrl || "/placeholder.svg?height=300&width=400"}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover aspect-video"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col p-6">
                      <CardHeader className="p-0 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-md flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {item.category}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pb-4 flex-grow">
                        <p className="text-muted-foreground">{item.summary}</p>
                      </CardContent>
                      <CardFooter className="p-0 pt-2 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Автор: {item.author}</span>
                        <Button asChild variant="ghost" className="gap-1">
                          <Link href={`/news/${item.id}`}>
                            Читать полностью <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
