"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, DollarSign, Clock } from "lucide-react"
import { useAdminBookings } from "@/lib/bookings"

export function AdminStats() {
  const { getTotalRevenue, getPendingBookingsCount, getCompletedBookingsCount, getAllBookings, loading, error } = useAdminBookings()

  if (loading) {
    return <div>Loading admin stats...</div>
  }
  if (error) {
    return <div className="text-red-500">Error loading stats: {error}</div>
  }

  const totalRevenue = getTotalRevenue()
  const pendingBookings = getPendingBookingsCount()
  const completedBookings = getCompletedBookingsCount()
  const totalBookings = getAllBookings().length

  // Calculate percentage changes (mock data for now)
  const revenueChange = "+12.5%"
  const pendingChange = pendingBookings > 0 ? `+${pendingBookings}` : "0"
  const completedChange = completedBookings > 0 ? `+${completedBookings}` : "0"
  const totalChange = totalBookings > 0 ? `+${totalBookings}` : "0"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">TSh {totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{revenueChange} from last month</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingBookings}</div>
          <p className="text-xs text-muted-foreground">{pendingChange} new pending</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedBookings}</div>
          <p className="text-xs text-muted-foreground">{completedChange} from last month</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">{totalChange} new bookings</p>
        </CardContent>
      </Card>
    </div>
  )
}
