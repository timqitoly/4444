import { getNewsById } from "../../actions"
import { notFound } from "next/navigation"
import NewsForm from "../../components/news-form"
import { requireAuth, canEditContent } from "@/lib/auth"

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const user = await requireAuth()

  if (!canEditContent(user.role)) {
    return notFound()
  }

  const news = await getNewsById(params.id)

  if (!news) {
    return notFound()
  }

  return (
    <div className="p-6">
      <NewsForm news={news} id={params.id} />
    </div>
  )
}
