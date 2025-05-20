import type { Service } from "@/types/service"
import { createClient } from "@/lib/supabase/client"

export async function getPopularServices(): Promise<Service[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("services").select("*").order("views", { ascending: false }).limit(4)

    if (error) {
      console.error("Error fetching popular services:", error)
      return getMockPopularServices()
    }

    return data as Service[]
  } catch (error) {
    console.error("Error fetching popular services:", error)
    return getMockPopularServices()
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("services").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching service with id ${id}:`, error)
      return null
    }

    return data as Service
  } catch (error) {
    console.error(`Error fetching service with id ${id}:`, error)
    return null
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("services").select("*").order("title", { ascending: true })

    if (error) {
      console.error("Error fetching all services:", error)
      return getMockServices()
    }

    return data as Service[]
  } catch (error) {
    console.error("Error fetching all services:", error)
    return getMockServices()
  }
}

// Mock data for development or fallback
function getMockPopularServices(): Service[] {
  return [
    {
      id: "1",
      title: "Получение паспорта",
      description: "Оформление и получение паспорта гражданина DavisState",
      duration: "30 дней",
      requirements: "Заявление, фотография, документ, удостоверяющий личность",
      procedure: "Подача заявления, оплата госпошлины, получение паспорта",
      department: "Департамент внутренних дел",
      cost: "1000",
      views: 1500,
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-06-20"),
    },
    {
      id: "2",
      title: "Регистрация бизнеса",
      description: "Регистрация юридического лица или индивидуального предпринимателя",
      duration: "5 рабочих дней",
      requirements: "Заявление, устав, документы учредителей",
      procedure: "Подача документов, оплата госпошлины, получение свидетельства",
      department: "Департамент экономического развития",
      cost: "5000",
      views: 1200,
      createdAt: new Date("2023-02-10"),
      updatedAt: new Date("2023-07-15"),
    },
    {
      id: "3",
      title: "Получение водительского удостоверения",
      description: "Оформление и получение водительского удостоверения",
      duration: "10 рабочих дней",
      requirements: "Заявление, медицинская справка, документ об обучении",
      procedure: "Сдача экзаменов, оплата госпошлины, получение удостоверения",
      department: "Департамент транспорта",
      cost: "2000",
      views: 1000,
      createdAt: new Date("2023-03-05"),
      updatedAt: new Date("2023-08-10"),
    },
    {
      id: "4",
      title: "Регистрация недвижимости",
      description: "Регистрация права собственности на недвижимое имущество",
      duration: "7 рабочих дней",
      requirements: "Заявление, документы на недвижимость, документ, удостоверяющий личность",
      procedure: "Подача документов, оплата госпошлины, получение свидетельства",
      department: "Департамент имущественных отношений",
      cost: "3000",
      views: 900,
      createdAt: new Date("2023-04-20"),
      updatedAt: new Date("2023-09-05"),
    },
  ]
}

function getMockServices(): Service[] {
  return [
    ...getMockPopularServices(),
    {
      id: "5",
      title: "Получение разрешения на строительство",
      description: "Оформление разрешения на строительство объекта",
      duration: "30 рабочих дней",
      requirements: "Заявление, проектная документация, правоустанавливающие документы",
      procedure: "Подача документов, рассмотрение, получение разрешения",
      department: "Департамент строительства",
      cost: "10000",
      views: 800,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-10-01"),
    },
    {
      id: "6",
      title: "Регистрация брака",
      description: "Государственная регистрация заключения брака",
      duration: "1 месяц",
      requirements: "Заявление, документы, удостоверяющие личность",
      procedure: "Подача заявления, оплата госпошлины, регистрация брака",
      department: "Департамент ЗАГС",
      cost: "500",
      views: 700,
      createdAt: new Date("2023-06-10"),
      updatedAt: new Date("2023-11-05"),
    },
  ]
}
