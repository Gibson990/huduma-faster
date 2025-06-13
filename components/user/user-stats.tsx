import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, Star } from "lucide-react"

const stats = [
  {
    title: "Total Bookings",
    value: "12",
    icon: Calendar,
    color: "text-[#2E7D32]",
  },
  {
    title: "Pending Services",
    value: "2",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Completed Services",
    value: "8",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Average Rating Given",
    value: "4.6",
    icon: Star,
    color: "text-yellow-600",
  },
]

export function UserStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#212121]">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
