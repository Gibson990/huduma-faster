"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language"

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
      return
    }

    if (cart.length === 0) {
      router.push("/services")
      return
    }
  }, [user, cart, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: cart[0].id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          date: new Date().toISOString().split("T")[0],
          time: "09:00",
          notes: "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const data = await response.json()
      clearCart()
      router.push(`/invoice/${data.id}`)
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

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {language === "sw" ? "Malipo" : "Checkout"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === "sw" ? "Maelezo ya Huduma" : "Service Details"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{language === "sw" ? item.name_sw : item.name_en}</h3>
                    <p className="text-sm text-gray-500">{item.duration_minutes} minutes</p>
                  </div>
                  <p className="font-medium">TSh {item.price.toLocaleString()}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>{language === "sw" ? "Jumla" : "Total"}</span>
                  <span>TSh {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === "sw" ? "Maelezo ya Mteja" : "Customer Details"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "sw" ? "Jina" : "Name"}
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "sw" ? "Barua pepe" : "Email"}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "sw" ? "Simu" : "Phone"}
                </label>
                <input
                  type="tel"
                  value={user.phone || ""}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "sw" ? "Anwani" : "Address"}
                </label>
                <input
                  type="text"
                  value={user.address || ""}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-50"
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
