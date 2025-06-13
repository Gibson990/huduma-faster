"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useBookings } from "@/lib/bookings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, ArrowLeft, Calendar, Clock, MapPin, User, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import { use } from 'react'

interface PageProps {
  params: Promise<{
    bookingId: string
  }>
}

export default function InvoicePage({ params }: PageProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { getBookingById } = useBookings()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const unwrappedParams = use(params)
  const booking = getBookingById(unwrappedParams.bookingId)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/invoice/' + unwrappedParams.bookingId)
    }
    setLoading(false)
  }, [isLoading, user, router, unwrappedParams.bookingId])

  const downloadInvoice = () => {
    if (!booking) return

    try {
      generateInvoicePDF(booking)
      toast({
        title: "Invoice Downloaded",
        description: "Your invoice has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Error",
        description: "There was an error downloading the invoice. Please try again.",
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <p className="text-gray-600 mb-4">The requested booking could not be found.</p>
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
          <Button onClick={downloadInvoice} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader className="bg-[#F5F5F5] border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Booking Confirmation</CardTitle>
                <p className="text-gray-600 text-sm">Invoice #{booking.id}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Booking Confirmed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium text-gray-900">Date Issued</h3>
                <p className="text-gray-600">{formatDate(booking.createdAt)}</p>
              </div>
              <div className="text-right">
                <h3 className="font-medium text-gray-900">Payment Status</h3>
                <Badge variant={booking.paymentStatus === "paid" ? "default" : "outline"} className="mt-1">
                  {booking.paymentStatus === "paid" ? "Paid" : "Payment on Completion"}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Customer</h3>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    {booking.customerName}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {booking.customerEmail}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {booking.customerPhone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {booking.serviceAddress}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Service Provider</h3>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    {booking.providerName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    +255 700 001 002
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Service Schedule</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                  <Calendar className="h-4 w-4 text-[#2E7D32]" />
                  {formatDate(booking.scheduledDate)}
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                  <Clock className="h-4 w-4 text-[#2E7D32]" />
                  {booking.scheduledTime}
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                  <MapPin className="h-4 w-4 text-[#2E7D32]" />
                  At your location
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between font-medium">
                <span>Service Details</span>
                <span>Amount</span>
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div className="flex items-center gap-4">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt={booking.serviceName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium">{booking.serviceName}</h4>
                    <p className="text-sm text-gray-600">Provider: {booking.providerName}</p>
                  </div>
                </div>
                <div className="font-medium">TSh {booking.servicePrice.toLocaleString()}</div>
              </div>

              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>TSh {booking.servicePrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2">
                <span>Service Fee</span>
                <span className="text-green-600">Free</span>
              </div>

              <Separator />

              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total</span>
                <span className="text-[#2E7D32]">TSh {booking.servicePrice.toLocaleString()}</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h4 className="font-medium mb-2">Payment Method</h4>
                <p className="text-sm text-gray-600">
                  {booking.paymentMethod === "cash" ? "Cash payment on service completion" : "Mobile Money"}
                </p>
              </div>

              {booking.notes && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">{booking.notes}</p>
                </div>
              )}
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
