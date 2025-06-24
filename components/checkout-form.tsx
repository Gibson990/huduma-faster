"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Banknote, Clock, Calendar } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CheckoutFormProps {
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

// Generate available time slots from 8 AM to 5 PM
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 8; hour <= 17; hour++) {
    const formattedHour = hour.toString().padStart(2, "0")
    slots.push(`${formattedHour}:00`)
    if (hour < 17) {
      slots.push(`${formattedHour}:30`)
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

export function CheckoutForm({ user }: CheckoutFormProps) {
  const { items, clearCart, total } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)

  // Pre-fill user data
  const [formData, setFormData] = useState({
    firstName: user.name.split(" ")[0] || "",
    lastName: user.name.split(" ").slice(1).join(" ") || "",
    email: user.email,
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "cash",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !time) {
      alert("Please select a date and time for your service")
      return
    }

    setIsSubmitting(true)

    try {
      // Create a booking for each service in the cart by POSTing to the backend
      const bookingIds: string[] = []
      for (const item of items) {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: item.id,
            userId: user.id,
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            date: date.toISOString(),
            time,
            notes: formData.notes,
            paymentMethod: formData.paymentMethod,
            quantity: item.quantity,
          }),
        })
        if (!response.ok) {
          throw new Error("Failed to create booking")
        }
        const data = await response.json()
        bookingIds.push(data.id)
      }
      clearCart()
      // If multiple bookings, go to order summary, otherwise go to invoice
      if (bookingIds.length > 1) {
        router.push(`/order-summary?ids=${bookingIds.join(",")}`)
      } else {
        router.push(`/invoice/${bookingIds[0]}`)
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("There was an error processing your booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Disable past dates
  const disablePastDates = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Schedule Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Service Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={disablePastDates}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Service Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+255 700 000 000"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Service Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Complete Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your complete address in Tanzania..."
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="notes">Service Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions for the service provider..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => handleInputChange("paymentMethod", value)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg border-[#C8E6C9] bg-[#C8E6C9]/20">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Banknote className="h-5 w-5 text-[#2E7D32]" />
                <div>
                  <div className="font-medium text-[#212121]">Cash Payment</div>
                  <div className="text-sm text-gray-600">Pay when service is completed</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
              <RadioGroupItem value="mobile" id="mobile" disabled />
              <Label htmlFor="mobile" className="flex items-center space-x-3 cursor-not-allowed flex-1">
                <div className="h-5 w-5 bg-gray-400 rounded"></div>
                <div>
                  <div className="font-medium text-gray-400">Mobile Money</div>
                  <div className="text-sm text-gray-400 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Coming Soon
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : `Confirm Booking - TSh ${total.toLocaleString()}`}
      </Button>
    </form>
  )
}
