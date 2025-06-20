"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Eye, Star, Download, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { generateInvoicePDF } from "@/lib/pdf-generator"

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

export function UserBookings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState("")
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)
  const [userBookings, setUserBookings] = useState<any[]>([])

  useEffect(() => {
    if (!user) return;
    fetch(`/api/bookings?userId=${user.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        console.log('Fetched bookings:', data);
        setUserBookings(
          data.map((b: any) => ({
            ...b,
            serviceName: b.service_name,
            providerName: b.provider_name || 'Assigned Provider',
            scheduledDate: b.booking_date ? new Date(b.booking_date) : null,
            scheduledTime: b.booking_time,
            servicePrice: b.total_amount,
            customerName: b.customer_name,
            quantity: b.quantity || 1,
          }))
        )
      })
  }, [user])

  const handleRatingSubmit = () => {
    if (selectedBooking) {
      // Here you would send the rating to the backend if needed
      toast({
        title: "Rating Submitted!",
        description: "Thank you for your feedback.",
        variant: "success",
      })
      setIsRatingDialogOpen(false)
      setSelectedBooking(null)
      setRating(5)
      setReview("")
    }
  }

  const downloadInvoice = (bookingId: string) => {
    const booking = userBookings.find((b) => b.id === bookingId)
    if (!booking) return

    try {
      generateInvoicePDF(booking)
      toast({
        title: "Download Started",
        description: "Your invoice is being downloaded.",
        variant: "success",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Error",
        description: "There was a problem downloading your invoice.",
        variant: "destructive",
      })
    }
  }

  const openRatingDialog = (booking: any) => {
    setSelectedBooking(booking)
    setRating(booking.rating || 5)
    setReview(booking.review || "")
    setIsRatingDialogOpen(true)
  }

  if (userBookings.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-4">You haven't made any service bookings yet.</p>
            <Button asChild className="bg-[#2E7D32] hover:bg-[#1B5E20]">
              <Link href="/services">Book Your First Service</Link>
            </Button>
            <div className="mt-4 text-xs text-gray-400">(If you just booked, try refreshing. Check the browser console for debug info.)</div>
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
          My Bookings ({userBookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h4 className="font-medium text-[#212121] truncate">
                    {booking.serviceName} {booking.quantity > 1 ? `(x${booking.quantity})` : ""}
                  </h4>
                  <Badge className={getStatusColor(booking.status)}>{booking.status.replace("_", " ")}</Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Provider: {booking.providerName}</div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span>
                      {booking.scheduledDate?.toLocaleDateString()} at {booking.scheduledTime} • {booking.id}
                    </span>
                    <span className="font-medium text-[#2E7D32]">TSh {booking.servicePrice.toLocaleString()}</span>
                  </div>
                  {booking.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs">Your rating:</span>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < booking.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/invoice/${booking.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => downloadInvoice(booking.id)}>
                  <Download className="h-4 w-4" />
                </Button>
                {booking.status === "completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-yellow-600"
                    onClick={() => openRatingDialog(booking)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rating Dialog */}
        <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate Your Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                      <Star
                        className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review">Review (Optional)</Label>
                <Textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                />
              </div>
              <Button onClick={handleRatingSubmit} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
                Submit Rating
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
