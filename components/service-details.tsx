"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Clock, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface ServiceDetailsProps {
  service: {
    id: number
    name_en: string
    name_sw: string
    description_en: string
    description_sw: string
    price: number
    category: string
    image_url?: string
    duration_minutes: number
    features?: string[]
  }
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  const { addToCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    setTimeout(() => {
      addToCart({
        id: service.id,
        name_en: service.name_en,
        name_sw: service.name_sw,
        price: service.price,
        image_url: service.image_url,
        duration_minutes: service.duration_minutes,
      })
      setIsAdding(false)
      toast({
        title: "Added to cart",
        description: `${service.name_en} has been added to your cart.`,
        variant: "success",
      })
    }, 500)
  }

  const handleBookNow = () => {
    addToCart({
      id: service.id,
      name_en: service.name_en,
      name_sw: service.name_sw,
      price: service.price,
      image_url: service.image_url,
      duration_minutes: service.duration_minutes,
    })
    router.push("/checkout")
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={service.image_url || "/placeholder.svg?height=300&width=500"}
                alt={service.name_en}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <Badge className="mb-2 bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">{service.category}</Badge>
              <h1 className="text-2xl font-bold text-[#212121]">{service.name_en}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"} fill-current`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.0 (24 reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#2E7D32]" />
              <span>{service.duration_minutes} minutes</span>
            </div>

            <div className="text-2xl font-bold text-[#2E7D32]">TSh {service.price.toLocaleString()}</div>

            <p className="text-gray-600">{service.description_en}</p>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">What's Included:</h3>
              <ul className="space-y-2">
                {(
                  service.features || [
                    "Professional service provider",
                    "Quality equipment and supplies",
                    "Satisfaction guarantee",
                    "Free follow-up support",
                  ]
                ).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#2E7D32] mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={handleBookNow} className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20]" size="lg">
                Book Now
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]"
                size="lg"
                disabled={isAdding}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAdding ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
