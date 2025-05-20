import { getServiceById } from "../../actions"
import { notFound } from "next/navigation"
import ServiceForm from "../../components/service-form"
import { requireAuth, canEditContent } from "@/lib/auth"

interface EditServicePageProps {
  params: {
    id: string
  }
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const user = await requireAuth()

  if (!canEditContent(user.role)) {
    return notFound()
  }

  const service = await getServiceById(params.id)

  if (!service) {
    return notFound()
  }

  return (
    <div className="p-6">
      <ServiceForm service={service} id={params.id} />
    </div>
  )
}
