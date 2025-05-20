import { requireAuth, canEditContent } from "@/lib/auth"
import { notFound } from "next/navigation"
import NewsForm from "../components/news-form"

export default async function CreateNewsPage() {
  const user = await requireAuth()

  if (!canEditContent(user.role)) {
    return notFound()
  }

  return (
    <div className="p-6">
      <NewsForm />
    </div>
  )
}
