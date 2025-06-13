"use client"
import { AdminStats } from "./admin-stats"
import { RecentBookings } from "./recent-bookings"
import { RevenueChart } from "./revenue-chart"
import { ProviderManagement } from "./provider-management"
import { UserManagement } from "./user-management"
import { TaskAssignment } from "./task-assignment"
import { ServiceManagement } from "./service-management"
import { CategoryManagement } from "./category-management"
import { useLanguage } from "@/lib/language"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Users, UserCheck, Settings, Package, FolderOpen, BarChart3, Calendar } from "lucide-react"

export function AdminDashboard() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm md:text-base">Manage your service booking platform</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
          <TabsTrigger value="overview" className="flex flex-col gap-1 p-2 md:p-3">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex flex-col gap-1 p-2 md:p-3">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex flex-col gap-1 p-2 md:p-3">
            <Package className="h-4 w-4" />
            <span className="text-xs">Services</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex flex-col gap-1 p-2 md:p-3">
            <FolderOpen className="h-4 w-4" />
            <span className="text-xs">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex flex-col gap-1 p-2 md:p-3">
            <UserCheck className="h-4 w-4" />
            <span className="text-xs">Providers</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex flex-col gap-1 p-2 md:p-3">
            <Users className="h-4 w-4" />
            <span className="text-xs">Users</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex flex-col gap-1 p-2 md:p-3">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col gap-1 p-2 md:p-3">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminStats />
          <div className="grid lg:grid-cols-2 gap-6">
            <RevenueChart />
            <RecentBookings />
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <RecentBookings showAll />
        </TabsContent>

        <TabsContent value="services">
          <ServiceManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="providers">
          <ProviderManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskAssignment />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            <RevenueChart />
            <AdminStats />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
