"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useBookings } from "@/lib/bookings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, ArrowLeft, Calendar, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { generateInvoicePDF } from "@/lib/pdf-generator"

export default function OrderSummaryPage() {
  const { user, isLoading } = useAuth()
  const { getBookingsByIds } = useBookings()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)

  // Get booking IDs from URL
  const bookingIds = searchParams.get("ids")?.split(",") || []
  const bookings = getBookingsByIds(bookingIds)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const downloadAllInvoices = () => {
    if (bookings.length === 0) return

    try {
      // In a real app, this would generate a combined PDF
      // For now, we'll just download the first one
      generateInvoicePDF(bookings[0])
      toast({
        title: "Invoices Downloaded",
        description: "Your invoices have been downloaded successfully.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Error",
        description: "There was an error downloading the invoices. Please try again.",
      })
    }
  }

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bookings not found</h1>
          <p className="text-gray-600 mb-4">The requested bookings could not be found.</p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Calculate total amount
  const totalAmount = bookings.reduce((sum, booking) => sum + booking.servicePrice, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button onClick={downloadAllInvoices} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Download className="h-4 w-4 mr-2" />
            Download Invoices
          </Button>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader className="bg-[#F5F5F5] border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Order Confirmation</CardTitle>
                <p className="text-gray-600 text-sm">Thank you for your booking!</p>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4" />
                <span>Booking Confirmed</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium text-gray-900">Date</h3>
                <p className="text-gray-600">{formatDate(new Date())}</p>
              </div>
              <div className="text-right">
                <h3 className="font-medium text-gray-900">Customer</h3>
                <p className="text-gray-600">{bookings[0].customerName}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Service Schedule</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                  <Calendar className="h-4 w-4 text-[#2E7D32]" />
                  {formatDate(bookings[0].scheduledDate)}
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                  <Clock className="h-4 w-4 text-[#2E7D32]" />
                  {bookings[0].scheduledTime}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between font-medium">
                <span>Service Details</span>
                <span>Amount</span>
              </div>

              {bookings.map((booking, index) => (
                <div key={`${booking.id}-${index}`} className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-start gap-4">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt={booking.serviceName}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium">{booking.serviceName}</h4>
                      <p className="text-sm text-gray-600">
                        Provider: {booking.providerName} | Quantity: {booking.quantity}
                      </p>
                      <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                    </div>
                  </div>
                  <div className="font-medium">TSh {booking.servicePrice.toLocaleString()}</div>
                </div>
              ))}

              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>TSh {totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2">
                <span>Service Fee</span>
                <span className="text-green-600">Free</span>
              </div>

              <Separator />

              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total</span>
                <span className="text-[#2E7D32]">TSh {totalAmount.toLocaleString()}</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h4 className="font-medium mb-2">Payment Method</h4>
                <p className="text-sm text-gray-600">
                  {bookings[0].paymentMethod === "cash" ? "Cash payment on service completion" : "Mobile Money"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you for booking with Huduma Faster. If you have any questions, please contact our support team.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/dashboard">View My Bookings</Link>
            </Button>
            <Button asChild className="bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Link href="/services">Book Another Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
