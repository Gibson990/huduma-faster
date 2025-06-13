import { AdminStats } from "@/components/admin/admin-stats"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { ProviderManagement } from "@/components/admin/provider-management"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#212121] mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your service booking platform</p>
      </div>

      <div className="space-y-8">
        <AdminStats />

        <div className="grid lg:grid-cols-2 gap-8">
          <RevenueChart />
          <RecentBookings />
        </div>

        <ProviderManagement />
      </div>
    </div>
  )
}
