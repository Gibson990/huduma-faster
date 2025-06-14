"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface BookingSummaryProps {
  bookingId: string
}

interface BookingDetails {
  id: string
  service_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  booking_date: string
  booking_time: string
  total_amount: number
  status: string
}

export function BookingSummary({ bookingId }: BookingSummaryProps) {
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch booking")
        }
        const data = await response.json()
        setBooking(data)
      } catch (error) {
        console.error("Error fetching booking:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">Loading booking details...</div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">The requested booking could not be found.</p>
          <Button onClick={() => router.push("/bookings")}>
            View All Bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Booking Confirmed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Service Details</h3>
              <p className="text-gray-600">{booking.service_name}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {booking.customer_name}</p>
                <p><span className="font-medium">Email:</span> {booking.customer_email}</p>
                <p><span className="font-medium">Phone:</span> {booking.customer_phone}</p>
                <p><span className="font-medium">Address:</span> {booking.address}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Booking Schedule</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {format(new Date(booking.booking_date), "PPP")}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {booking.booking_time}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Payment Details</h3>
              <p className="text-2xl font-bold text-[#2E7D32]">
                TSh {booking.total_amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Status: {booking.status}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => router.push("/bookings")}
              variant="outline"
              className="flex-1"
            >
              View All Bookings
            </Button>
            <Button
              onClick={() => window.print()}
              className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20]"
            >
              Print Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 