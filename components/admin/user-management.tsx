import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Mail, Phone, MoreHorizontal } from "lucide-react"

const users = [
  {
    id: 2,
    name: "Test User",
    email: "user@faster.com",
    phone: "+255700000001",
    totalBookings: 5,
    status: "active",
    joinDate: "2024-01-10",
  },
  {
    id: 3,
    name: "John Mwangi",
    email: "john@example.com",
    phone: "+255700000002",
    totalBookings: 12,
    status: "active",
    joinDate: "2023-12-15",
  },
  {
    id: 4,
    name: "Fatma Hassan",
    email: "fatma@example.com",
    phone: "+255700000003",
    totalBookings: 8,
    status: "active",
    joinDate: "2024-01-05",
  },
]

export function UserManagement() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#212121] flex items-center">
          <Users className="h-5 w-5 mr-2" />
          User Management / Usimamizi wa Watumiaji
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <img src="/placeholder.svg?height=40&width=40" alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-medium text-[#212121]">{user.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-4">
                    <span className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {user.phone}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user.totalBookings} bookings • Joined {user.joinDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
