"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search, Calendar, MessageCircle } from "lucide-react"
import { useCart } from "@/lib/cart"
import Link from "next/link"

export function QuickActions() {
  const { itemCount } = useCart()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <Search className="h-8 w-8 mx-auto mb-3 text-[#2E7D32]" />
          <h3 className="font-medium mb-2">Browse Services</h3>
          <p className="text-sm text-gray-600 mb-4">Tafuta Huduma</p>
          <Button asChild size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Link href="/services">Browse</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-8 w-8 mx-auto mb-3 text-[#2E7D32]" />
          <h3 className="font-medium mb-2">My Cart ({itemCount})</h3>
          <p className="text-sm text-gray-600 mb-4">Kikapu Changu</p>
          <Button asChild size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Link href="/cart">View Cart</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <Calendar className="h-8 w-8 mx-auto mb-3 text-[#2E7D32]" />
          <h3 className="font-medium mb-2">Schedule Service</h3>
          <p className="text-sm text-gray-600 mb-4">Panga Huduma</p>
          <Button asChild size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Link href="/book">Schedule</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-8 w-8 mx-auto mb-3 text-[#2E7D32]" />
          <h3 className="font-medium mb-2">Support</h3>
          <p className="text-sm text-gray-600 mb-4">Msaada</p>
          <Button asChild size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            <Link href="/support">Contact</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
