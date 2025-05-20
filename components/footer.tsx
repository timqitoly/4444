import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">DavisState</h3>
            <p className="text-muted-foreground">Официальный портал услуг штата Davis</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Услуги</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground">
                  Все услуги
                </Link>
              </li>
              <li>
                <Link href="/services/popular" className="text-muted-foreground hover:text-foreground">
                  Популярные услуги
                </Link>
              </li>
              <li>
                <Link href="/services/new" className="text-muted-foreground hover:text-foreground">
                  Новые услуги
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Информация</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  О правительстве
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground">
                  Новости
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-foreground">
                  Вакансии
                </Link>
              </li>
              <li>
                <Link href="/important" className="text-muted-foreground hover:text-foreground">
                  Важная информация
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Поддержка</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  Часто задаваемые вопросы
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-muted-foreground hover:text-foreground">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-muted-foreground hover:text-foreground">
                  Обратная связь
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} DavisState. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
