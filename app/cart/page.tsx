"use client"

import { useCart } from "@/lib/cart"
import { useLanguage } from "@/lib/language"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart()
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/cart")
      return
    }
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-[#212121] mb-4">{t("cart.empty")}</h1>
          <p className="text-gray-600 mb-6">Add some services to your cart to get started.</p>
          <Button asChild className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Link href="/services">Browse Services</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#212121] mb-8">{t("cart.title")}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image_url || "/placeholder.svg?height=100&width=100"}
                    alt={language === "sw" ? item.name_sw : item.name_en}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#212121] text-lg">
                      {language === "sw" ? item.name_sw : item.name_en}
                    </h3>
                    <p className="text-gray-600 text-sm">Duration: {item.duration_minutes} minutes</p>
                    <div className="text-xl font-bold text-[#2E7D32] mt-2">
                      {t("common.currency")} {item.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#212121]">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>
                    {t("common.currency")} {total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Free
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span className="text-[#2E7D32]">
                    {t("common.currency")} {total.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button onClick={handleCheckout} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]" size="lg">
                {t("cart.checkout")}
              </Button>
              <Button variant="outline" onClick={clearCart} className="w-full">
                Clear Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
