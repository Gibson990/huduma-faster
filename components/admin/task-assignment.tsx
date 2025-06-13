"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCheck, Clock, MapPin } from "lucide-react"
import { useBookings } from "@/lib/bookings"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Available service providers with their specializations
const availableProviders = [
  { id: 1, name: "Juma Mwalimu", specialization: "Electrical Services", location: "Dar es Salaam", status: "active" },
  { id: 2, name: "Amina Salehe", specialization: "Plumbing Services", location: "Arusha", status: "active" },
  { id: 3, name: "Hassan Mwangi", specialization: "Cleaning Services", location: "Mwanza", status: "active" },
  { id: 4, name: "Grace Kimani", specialization: "Carpentry", location: "Dodoma", status: "active" },
  { id: 5, name: "Mohamed Ali", specialization: "Painting", location: "Mbeya", status: "active" },
  { id: 6, name: "Fatma Hassan", specialization: "Furniture", location: "Moshi", status: "inactive" },
]

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Helper function to determine urgency based on date
const determineUrgency = (date: Date): string => {
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) return "high"
  if (diffDays <= 3) return "medium"
  return "low"
}

// Helper function to get providers by service category
const getProvidersByCategory = (category: string): typeof availableProviders => {
  return availableProviders.filter((provider) => provider.specialization === category && provider.status === "active")
}

export function TaskAssignment() {
  const { getAllBookings, updateBooking } = useBookings()
  const { toast } = useToast()
  const [pendingBookings, setPendingBookings] = useState<any[]>([])
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filteredProviders, setFilteredProviders] = useState<typeof availableProviders>([])

  // Get all pending bookings
  useEffect(() => {
    const allBookings = getAllBookings()
    const pending = allBookings
      .filter((booking) => booking.status === "pending")
      .map((booking) => ({
        ...booking,
        urgency: determineUrgency(booking.scheduledDate),
        category: getCategoryFromServiceName(booking.serviceName),
      }))
      .sort((a, b) => {
        // Sort by urgency first (high > medium > low)
        const urgencyOrder = { high: 0, medium: 1, low: 2 }
        const urgencyDiff =
          urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder]
        if (urgencyDiff !== 0) return urgencyDiff

        // Then sort by date
        return a.scheduledDate.getTime() - b.scheduledDate.getTime()
      })

    setPendingBookings(pending)
  }, [getAllBookings])

  // Helper function to extract category from service name
  function getCategoryFromServiceName(serviceName: string): string {
    // Map of service names to categories
    const serviceCategories: Record<string, string> = {
      "Electrical Wiring": "Electrical Services",
      "Light Installation": "Electrical Services",
      "Pipe Repair": "Plumbing Services",
      "House Cleaning": "Cleaning Services",
      "Furniture Assembly": "Carpentry",
      "Interior Painting": "Painting",
    }

    return serviceCategories[serviceName] || "Other Services"
  }

  const handleAssignProvider = () => {
    if (selectedBooking && selectedProvider) {
      const provider = availableProviders.find((p) => p.id.toString() === selectedProvider)
      if (provider) {
        updateBooking(selectedBooking.id, {
          providerName: provider.name,
          status: "confirmed",
        })

        toast({
          title: "Provider Assigned",
          description: `${provider.name} has been assigned to booking #${selectedBooking.id}`,
          variant: "success",
        })

        // Update the local state to remove the assigned booking
        setPendingBookings((prev) => prev.filter((booking) => booking.id !== selectedBooking.id))

        // Close dialog and reset selection
        setIsDialogOpen(false)
        setSelectedBooking(null)
        setSelectedProvider("")
      }
    }
  }

  const openAssignDialog = (booking: any) => {
    setSelectedBooking(booking)
    setSelectedProvider("")

    // Filter providers by service category
    const matchingProviders = getProvidersByCategory(booking.category)
    setFilteredProviders(matchingProviders)

    setIsDialogOpen(true)
  }

  if (pendingBookings.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Task Assignment / Mgao wa Kazi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserCheck className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending tasks</h3>
            <p className="text-gray-600">All bookings have been assigned to providers.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#212121] flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Task Assignment / Mgao wa Kazi ({pendingBookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingBookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-[#212121]">{booking.customerName}</h4>
                    <Badge className={getUrgencyColor(booking.urgency)}>{booking.urgency} priority</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {booking.serviceName}
                    <span className="text-xs text-gray-500 ml-2">({booking.category})</span>
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {booking.serviceAddress}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {booking.scheduledDate.toLocaleDateString()} at {booking.scheduledTime}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-[#2E7D32]">TSh {booking.servicePrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">ID: {booking.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={() => openAssignDialog(booking)} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
                  Assign Provider / Teua Mtoa Huduma
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Service Provider</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Booking ID: {selectedBooking.id}</Label>
                  <p className="text-sm text-gray-500">Service: {selectedBooking.serviceName}</p>
                  <p className="text-sm text-gray-500">Category: {selectedBooking.category}</p>
                  <p className="text-sm text-gray-500">
                    Date: {selectedBooking.scheduledDate.toLocaleDateString()} at {selectedBooking.scheduledTime}
                  </p>
                  <p className="text-sm text-gray-500">Customer: {selectedBooking.customerName}</p>
                  <p className="text-sm text-gray-500">Address: {selectedBooking.serviceAddress}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Select Provider for {selectedBooking.category}</Label>
                  {filteredProviders.length > 0 ? (
                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id.toString()}>
                            {provider.name} - {provider.specialization} ({provider.location})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm text-red-500">
                      No providers available for {selectedBooking.category}. Please add providers first.
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleAssignProvider}
                  className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]"
                  disabled={!selectedProvider || filteredProviders.length === 0}
                >
                  Assign Provider
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
