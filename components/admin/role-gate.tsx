"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface RoleGateProps {
  allowedRoles: UserRole[]
  userRole?: UserRole | null
  children: React.ReactNode
}

export default function RoleGate({ allowedRoles, userRole, children }: RoleGateProps) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (userRole !== undefined) {
      setChecking(false)
      if (!userRole || !allowedRoles.includes(userRole)) {
        router.push("/admin/unauthorized")
      }
    }
  }, [userRole, allowedRoles, router])

  if (checking) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return null
  }

  return <>{children}</>
}
