"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart"
import { useRouter } from "next/navigation"

export function CartButton() {
  const { items } = useCart()
  const router = useRouter()

  const itemCount = items.length
  const displayCount = itemCount > 9 ? "9+" : itemCount

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => router.push("/cart")}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {displayCount}
        </span>
      )}
    </Button>
  )
} 