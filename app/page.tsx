import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowRight, FileText, Briefcase, HelpCircle, MapPin, Bell, Building2, Newspaper } from "lucide-react"
import ChatBot from "@/components/chat-bot"
import ServiceCard from "@/components/service-card"
import NewsCard from "@/components/news-card"
import { getPopularServices } from "@/lib/services"
import { getLatestNews } from "@/lib/news"

export default async function Home() {
  const popularServices = await getPopularServices()
  const latestNews = await getLatestNews(3)

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-6">Добро пожаловать на портал услуг штата Davis</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Всё нужное теперь на одном портале
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link href="/services">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <FileText className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-medium">Услуги</h3>
                </CardContent>
              </Card>
            </Link>
            <Link href="/jobs">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Briefcase className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-medium">Вакансии</h3>
                </CardContent>
              </Card>
            </Link>
            <Link href="/faq">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <HelpCircle className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-medium">Часто задаваемые вопросы</h3>
                </CardContent>
              </Card>
            </Link>
            <Link href="/map">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <MapPin className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-medium">Карта</h3>
                </CardContent>
              </Card>
            </Link>
            <Link href="/important">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Bell className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-medium">Важная информация</h3>
                </CardContent>
              </Card>
            </Link>
            <Link href="/about">
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Building2 className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-medium">О правительстве</h3>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Tabs defaultValue="services" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="services">Популярные услуги</TabsTrigger>
              <TabsTrigger value="news">Последние новости</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link href="/services">
                    Все услуги <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="news">
              <div className="grid grid-cols-1 gap-6">
                {latestNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button asChild variant="outline">
                  <Link href="/news">
                    Все новости <Newspaper className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <ChatBot />
        </div>
      </section>
    </div>
  )
}
