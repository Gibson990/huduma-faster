"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal, Calendar, Check, X, Clock, AlertCircle } from "lucide-react"
import { useBookings } from "@/lib/bookings"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "confirmed":
      return "bg-purple-100 text-purple-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const providers = [
  { id: 1, name: "Juma Mwalimu" },
  { id: 2, name: "Amina Salehe" },
  { id: 3, name: "Hassan Mwangi" },
  { id: 4, name: "Grace Kimani" },
  { id: 5, name: "Mohamed Ali" },
  { id: 6, name: "Fatma Hassan" },
]

export function RecentBookings({ showAll = false }: { showAll?: boolean }) {
  const { getAllBookings, updateBooking } = useBookings()
  const { toast } = useToast()
  const allBookings = getAllBookings()
  const displayBookings = showAll ? allBookings : allBookings.slice(0, 5)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [selectedProvider, setSelectedProvider] = useState<string>("")

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBooking(bookingId, { status: newStatus as any })
    toast({
      title: "Status Updated",
      description: `Booking status has been updated to ${newStatus.replace("_", " ")}.`,
      variant: "success",
    })
  }

  const handleAssignProvider = () => {
    if (selectedBooking && selectedProvider) {
      const provider = providers.find((p) => p.id.toString() === selectedProvider)
      if (provider) {
        updateBooking(selectedBooking.id, {
          providerName: provider.name,
          status: "confirmed",
        })
        toast({
          title: "Provider Assigned",
          description: `${provider.name} has been assigned to this booking.`,
          variant: "success",
        })
        setSelectedBooking(null)
        setSelectedProvider("")
      }
    }
  }

  if (allBookings.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {showAll ? "All Bookings" : "Recent Bookings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">No bookings have been made yet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#212121] flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {showAll ? "All Bookings" : "Recent Bookings"} ({allBookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h4 className="font-medium text-[#212121] truncate">{booking.customerName}</h4>
                  <Badge className={getStatusColor(booking.status)}>{booking.status.replace("_", " ")}</Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="line-clamp-1">
                    {booking.serviceName} {booking.quantity > 1 ? `(x${booking.quantity})` : ""}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span>
                      {booking.scheduledDate.toLocaleDateString()} • {booking.providerName}
                    </span>
                    <span className="font-medium text-[#2E7D32]">TSh {booking.servicePrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/invoice/${booking.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>

                {booking.status === "pending" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Service Provider</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Booking ID: {booking.id}</Label>
                          <p className="text-sm text-gray-500">Service: {booking.serviceName}</p>
                          <p className="text-sm text-gray-500">
                            Date: {booking.scheduledDate.toLocaleDateString()} at {booking.scheduledTime}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="provider">Select Provider</Label>
                          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {providers.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id.toString()}>
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          onClick={handleAssignProvider}
                          className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]"
                          disabled={!selectedProvider}
                        >
                          Assign Provider
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {booking.status === "pending" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "confirmed")}>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Confirm Booking
                      </DropdownMenuItem>
                    )}
                    {booking.status === "confirmed" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "in_progress")}>
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        Mark In Progress
                      </DropdownMenuItem>
                    )}
                    {booking.status === "in_progress" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "completed")}>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Mark Completed
                      </DropdownMenuItem>
                    )}
                    {booking.status !== "cancelled" && booking.status !== "completed" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "cancelled")}>
                        <X className="h-4 w-4 mr-2 text-red-600" />
                        Cancel Booking
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
