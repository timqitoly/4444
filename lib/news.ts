import type { News } from "@/types/news"
import { createClient } from "@/lib/supabase/client"

export async function getLatestNews(limit = 5): Promise<News[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching latest news:", error)
      return getMockLatestNews(limit)
    }

    // Преобразуем snake_case из БД в camelCase для нашего приложения
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      author: item.author,
      publishedAt: new Date(item.published_at),
      updatedAt: new Date(item.updated_at),
      imageUrl: item.image_url,
      category: item.category,
    })) as News[]
  } catch (error) {
    console.error("Error fetching latest news:", error)
    return getMockLatestNews(limit)
  }
}

export async function getNewsById(id: string): Promise<News | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching news with id ${id}:`, error)
      return null
    }

    // Преобразуем snake_case из БД в camelCase
    return {
      id: data.id,
      title: data.title,
      summary: data.summary,
      content: data.content,
      author: data.author,
      publishedAt: new Date(data.published_at),
      updatedAt: new Date(data.updated_at),
      imageUrl: data.image_url,
      category: data.category,
    } as News
  } catch (error) {
    console.error(`Error fetching news with id ${id}:`, error)
    return null
  }
}

export async function getAllNews(): Promise<News[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching all news:", error)
      return getMockNews()
    }

    // Преобразуем snake_case из БД в camelCase
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      author: item.author,
      publishedAt: new Date(item.published_at),
      updatedAt: new Date(item.updated_at),
      imageUrl: item.image_url,
      category: item.category,
    })) as News[]
  } catch (error) {
    console.error("Error fetching all news:", error)
    return getMockNews()
  }
}

// Mock data for development or fallback
function getMockLatestNews(limit: number): News[] {
  return getMockNews().slice(0, limit)
}

function getMockNews(): News[] {
  return [
    {
      id: "1",
      title: "Открытие нового центра государственных услуг",
      summary: "В центре города открылся новый многофункциональный центр государственных услуг DavisState.",
      content:
        "Сегодня состоялось торжественное открытие нового многофункционального центра государственных услуг DavisState в центре города. Центр оснащен современным оборудованием и предоставляет более 100 различных государственных услуг. Жители города теперь могут получить необходимые услуги в комфортных условиях без очередей.",
      author: "Администрация DavisState",
      publishedAt: new Date("2023-11-15"),
      updatedAt: new Date("2023-11-15"),
      imageUrl: "/placeholder.svg?height=300&width=600",
      category: "Общество",
    },
    // остальные мок-данные оставляем без изменений...
    {
      id: "2",
      title: "Новые электронные услуги на портале DavisState",
      summary: "На портале государственных услуг DavisState появились новые электронные сервисы.",
      content:
        "Портал государственных услуг DavisState расширил список доступных электронных сервисов. Теперь граждане могут подать заявление на получение паспорта, зарегистрировать автомобиль и оформить пособие на ребенка онлайн. Новые сервисы значительно упрощают процесс получения государственных услуг и экономят время граждан.",
      author: "Департамент цифрового развития",
      publishedAt: new Date("2023-11-10"),
      updatedAt: new Date("2023-11-12"),
      imageUrl: "/placeholder.svg?height=300&width=600",
      category: "Технологии",
    },
    {
      id: "3",
      title: "Изменения в процедуре регистрации бизнеса",
      summary: "С 1 декабря вступают в силу изменения в процедуре регистрации бизнеса в DavisState.",
      content:
        "Правительство DavisState утвердило изменения в процедуре регистрации бизнеса, которые вступают в силу с 1 декабря. Теперь для регистрации юридического лица или индивидуального предпринимателя потребуется меньше документов, а срок рассмотрения заявления сократится до 3 рабочих дней. Эти изменения направлены на поддержку предпринимательства и улучшение бизнес-климата в регионе.",
      author: "Департамент экономического развития",
      publishedAt: new Date("2023-11-05"),
      updatedAt: new Date("2023-11-07"),
      imageUrl: "/placeholder.svg?height=300&width=600",
      category: "Бизнес",
    },
    {
      id: "4",
      title: "Запуск программы поддержки молодых специалистов",
      summary: "В DavisState стартовала программа поддержки молодых специалистов в государственных учреждениях.",
      content:
        "Правительство DavisState запустило программу поддержки молодых специалистов в государственных учреждениях. Программа предусматривает субсидии на аренду жилья, дополнительные выплаты и возможности для профессионального развития. Молодые специалисты, работающие в государственных учреждениях, могут подать заявку на участие в программе через портал государственных услуг.",
      author: "Департамент труда и социальной защиты",
      publishedAt: new Date("2023-10-25"),
      updatedAt: new Date("2023-10-27"),
      imageUrl: "/placeholder.svg?height=300&width=600",
      category: "Общество",
    },
    {
      id: "5",
      title: "Обновление портала государственных услуг",
      summary: "Портал государственных услуг DavisState обновился и стал удобнее для пользователей.",
      content:
        "Портал государственных услуг DavisState прошел масштабное обновление. Новый дизайн и улучшенная навигация делают использование портала более удобным и интуитивно понятным. Также добавлены новые функции, такие как чат с виртуальным помощником и возможность отслеживания статуса заявлений в режиме реального времени.",
      author: "Департамент цифрового развития",
      publishedAt: new Date("2023-10-20"),
      updatedAt: new Date("2023-10-22"),
      imageUrl: "/placeholder.svg?height=300&width=600",
      category: "Технологии",
    },
  ]
}
