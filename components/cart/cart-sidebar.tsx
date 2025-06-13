"use client"

import { useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useLanguage } from "@/lib/language"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export function CartSidebar() {
  const { items, updateQuantity, removeFromCart, total, isCartOpen, setIsCartOpen } = useCart()
  const { t, language } = useLanguage()
  const router = useRouter()
  const { user } = useAuth()

  // Close cart when navigating to checkout
  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout")
      return
    }
    setIsCartOpen(false)
    router.push("/checkout")
  }

  // Close cart when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [setIsCartOpen])

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("cart.title")} ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t("cart.empty")}</h3>
            <p className="text-gray-600 mb-6 text-center">Add some services to your cart to get started.</p>
            <Button
              onClick={() => {
                setIsCartOpen(false)
                router.push("/services")
              }}
            >
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col h-[calc(100vh-10rem)]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-3 border-b">
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url || "/placeholder.svg?height=64&width=64"}
                      alt={language === "sw" ? item.name_sw : item.name_en}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                      {language === "sw" ? item.name_sw : item.name_en}
                    </h4>
                    <div className="text-sm text-gray-500 mt-1">
                      {t("common.currency")} {item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-l-md p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-r-md p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-4">
                <span>{t("cart.total")}</span>
                <span className="text-[#2E7D32]">
                  {t("common.currency")} {total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <Button onClick={handleCheckout} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
                  {t("cart.checkout")}
                </Button>
                <Button variant="outline" onClick={() => setIsCartOpen(false)} className="w-full">
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
