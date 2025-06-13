"use client"

import { UserStats } from "./user-stats"
import { UserBookings } from "./user-bookings"
import { QuickActions } from "./quick-actions"
import { useLanguage } from "@/lib/language"
import { useAuth } from "@/components/auth/auth-provider"

export function UserDashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#212121] mb-2">Karibu, {user?.name}!</h1>
        <p className="text-gray-600">Track your services and manage your bookings</p>
      </div>

      <div className="space-y-8">
        <QuickActions />
        <UserStats />
        <UserBookings />
      </div>
    </div>
  )
}
