"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"
import { useLanguage } from "@/lib/language"
import { Service } from "@/lib/services"
import { useRouter } from "next/navigation"

interface ServiceCardProps {
  service: Service
  onAddToCart?: () => void
  onBookNow?: () => void
  isBooking?: boolean
}

export function ServiceCard({ service, onAddToCart, onBookNow, isBooking = false }: ServiceCardProps) {
  const { t, language } = useLanguage()
  const router = useRouter()

  // Safely format the rating
  const formattedRating = typeof service.rating === 'number' 
    ? service.rating.toFixed(1)
    : Number(service.rating || 0).toFixed(1)

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={service.image_url}
          alt={language === "sw" ? service.name_sw : service.name_en}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 right-2 bg-[#2E7D32]">
          {service.category_en}
        </Badge>
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold">
          {language === "sw" ? service.name_sw : service.name_en}
        </h3>
        <p className="text-sm text-gray-500">
          {language === "sw" ? service.description_sw : service.description_en}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{formattedRating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{service.duration_minutes} min</span>
          </div>
          <div className="font-semibold text-[#2E7D32]">
            TSh {service.base_price.toLocaleString()}
          </div>
        </div>
      </CardContent>
      {!isBooking && (
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onAddToCart}
          >
            {t("Add to Cart")}
          </Button>
          <Button
            className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20]"
            onClick={onBookNow}
          >
            {t("Book Now")}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
} 