"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getBookingById } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface PageProps {
  params: {
    bookingId: string
  }
}

export default function InvoicePage({ params }: PageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingData = await getBookingById(params.bookingId)
        setBooking(bookingData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        })
        router.push("/bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [params.bookingId, router, toast])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <Button onClick={() => router.push("/bookings")}>View All Bookings</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Booking Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
              <p>Service: {booking.service_name}</p>
              <p>Date: {format(new Date(booking.booking_date), "PPP")}</p>
              <p>Time: {format(new Date(booking.booking_date), "p")}</p>
              <p>Status: {booking.status}</p>
              <p>Total Amount: TSh {booking.total_amount.toLocaleString()}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
              <p>Name: {booking.customer_name}</p>
              <p>Email: {booking.customer_email}</p>
              <p>Phone: {booking.customer_phone}</p>
              <p>Address: {booking.address}</p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.push("/bookings")}>
                View All Bookings
              </Button>
              <Button onClick={() => window.print()}>Print Invoice</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
