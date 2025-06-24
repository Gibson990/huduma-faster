"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"

export function UserNav() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  if (!user) {
    return (
      <Button variant="ghost" onClick={() => router.push("/login")}>
        {t("Login")}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={() => router.push("/dashboard")}>
        <User className="h-4 w-4 mr-2" />
        {user.name}
      </Button>
      <Button variant="ghost" onClick={logout}>
        {t("Logout")}
      </Button>
    </div>
  )
} 