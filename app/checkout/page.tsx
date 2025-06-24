"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart, type CartItem } from "@/lib/cart"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"

// Generate time slots from 8 AM to 5 PM
const timeSlots = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor((i + 16) / 2)
  const minute = (i + 16) % 2 === 0 ? "00" : "30"
  return `${hour.toString().padStart(2, "0")}:${minute}`
})

export default function CheckoutPage() {
  const { items: cart, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [phone, setPhone] = useState(user?.phone || "")
  const [address, setAddress] = useState(user?.address || "")

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
      return
    }
    // Only redirect to /services if not submitting a booking
    if (cart.length === 0 && !isSubmitting) {
      router.push("/services")
      return
    }
  }, [user, cart, router, isSubmitting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !date || !time) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      })
      return
    }

    console.log("User object:", user); // DEBUG: Check user object
    console.log("User ID:", user.id); // DEBUG: Check user ID specifically

    setIsSubmitting(true)
    try {
      // Loop through all cart items and create bookings for each
      const bookingIds: string[] = []
      for (const item of cart) {
        const requestBody = {
          serviceId: item.id,
          userId: user.id,
          name: user.name,
          email: user.email,
          phone,
          address,
          date: date.toISOString(),
          time,
          notes,
        };
        
        console.log("Request body being sent:", requestBody); // DEBUG: Check request body
        
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          throw new Error("Failed to create booking")
        }

        const data = await response.json()
        bookingIds.push(data.id)
      }
      clearCart()
      // Redirect to summary or invoice page
      if (bookingIds.length > 1) {
        router.push(`/order-summary?ids=${bookingIds.join(",")}`)
      } else {
        router.push(`/invoice/${bookingIds[0]}`)
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user || cart.length === 0) {
    return null
  }

  const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {language === "sw" ? "Malipo" : "Checkout"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === "sw" ? "Maelezo ya Huduma" : "Service Details"}</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.map((item: CartItem) => (
                <div key={item.id} className="space-y-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={item.image_url || "/placeholder-service.jpg"}
                      alt={language === "sw" ? item.name_sw : item.name_en}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {language === "sw" ? item.name_sw : item.name_en}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{item.duration_minutes} {language === "sw" ? "dakika" : "minutes"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{language === "sw" ? "Mahali pa Huduma" : "Service Location"}</span>
                    </div>
                    <p className="text-gray-600">
                      {language === "sw" ? "Maelezo ya Huduma" : "Service Description"}
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{language === "sw" ? "Bei" : "Price"}</span>
                      <span className="font-bold text-lg">TSh {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === "sw" ? "Jumla ya Malipo" : "Payment Summary"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{language === "sw" ? "Jumla ya Huduma" : "Service Total"}</span>
                  <span>TSh {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{language === "sw" ? "Jumla ya Malipo" : "Total Payment"}</span>
                  <span>TSh {total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "sw" ? "Maelezo ya Mteja" : "Customer Details"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>{language === "sw" ? "Jina" : "Name"}</Label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <Label>{language === "sw" ? "Barua pepe" : "Email"}</Label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <Label>{language === "sw" ? "Simu" : "Phone"}</Label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <Label>{language === "sw" ? "Anwani" : "Address"}</Label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{language === "sw" ? "Tarehe" : "Date"}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>{language === "sw" ? "Muda" : "Time"}</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="notes">{language === "sw" ? "Maelezo ya Ziada" : "Additional Notes"}</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === "sw" ? "Maelezo yoyote ya ziada..." : "Any special instructions or requirements..."}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? language === "sw"
                    ? "Inatuma..."
                    : "Submitting..."
                  : language === "sw"
                  ? "Thibitisha"
                  : "Confirm Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
