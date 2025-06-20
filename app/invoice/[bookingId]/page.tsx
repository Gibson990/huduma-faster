"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import { CheckCircle } from "lucide-react"

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
        const res = await fetch(`/api/bookings/${params.bookingId}`)
        if (!res.ok) throw new Error("Failed to fetch booking")
        const bookingData = await res.json()
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
    <div className="container py-10 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-xl shadow-lg border-0">
        <CardHeader className="flex flex-col items-center bg-[#F5F5F5] rounded-t-lg">
          <CheckCircle className="h-12 w-12 text-[#2E7D32] mb-2" />
          <CardTitle className="text-2xl mb-1">Booking Confirmed</CardTitle>
          <p className="text-gray-600 text-center">Thank you for your booking! Your invoice is below.</p>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="space-y-4 border-b pb-6">
            <h2 className="text-lg font-semibold text-[#2E7D32] mb-2">Service Details</h2>
            <div className="flex justify-between text-gray-700">
              <span>Service:</span>
              <span className="font-medium">{booking.service_name}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Date:</span>
              <span>{format(new Date(booking.booking_date), "PPP")}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Time:</span>
              <span>{format(new Date(booking.booking_date), "p")}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Status:</span>
              <span className="capitalize">{booking.status}</span>
            </div>
          </div>

          <div className="space-y-4 border-b pb-6">
            <h2 className="text-lg font-semibold text-[#2E7D32] mb-2">Customer Details</h2>
            <div className="flex justify-between text-gray-700">
              <span>Name:</span>
              <span>{booking.customer_name}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Email:</span>
              <span>{booking.customer_email}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Phone:</span>
              <span>{booking.customer_phone}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Address:</span>
              <span>{booking.address}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xl font-bold text-[#2E7D32] pt-4">
            <span>Total Amount</span>
            <span>TSh {booking.total_amount.toLocaleString()}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 pt-6">
            <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white flex-1 md:flex-none" onClick={() => generateInvoicePDF(booking)}>
              Download PDF Invoice
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none" onClick={() => router.push("/dashboard")}> 
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
