"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/lib/language"
import { useCart } from "@/lib/cart"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Service } from "@/lib/services"

interface ServiceGridProps {
  initialServices: Service[]
  filters?: {
    search?: string
    categories?: string[]
    priceRange?: [number, number]
    duration?: string[]
    rating?: string[]
  }
}

export function ServiceGrid({ initialServices, filters = {} }: ServiceGridProps) {
  const { t, language } = useLanguage()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Ensure filters has default values to prevent undefined errors
  const safeFilters = {
    search: filters.search || "",
    categories: filters.categories || [],
    priceRange: filters.priceRange || [0, 500000],
    duration: filters.duration || [],
    rating: filters.rating || [],
  }

  const filteredServices = useMemo(() => {
    return initialServices.filter((service) => {
      // Search filter
      if (safeFilters.search) {
        const searchLower = safeFilters.search.toLowerCase()
        const nameMatch =
          service.name_en.toLowerCase().includes(searchLower) || service.name_sw.toLowerCase().includes(searchLower)
        const descMatch =
          service.description_en.toLowerCase().includes(searchLower) ||
          service.description_sw.toLowerCase().includes(searchLower)
        const categoryMatch =
          service.category_en.toLowerCase().includes(searchLower) ||
          service.category_sw.toLowerCase().includes(searchLower)

        if (!nameMatch && !descMatch && !categoryMatch) return false
      }

      // Category filter
      if (safeFilters.categories.length > 0) {
        if (!safeFilters.categories.includes(service.category_en)) return false
      }

      // Price filter
      if (service.price < safeFilters.priceRange[0] || service.price > safeFilters.priceRange[1]) {
        return false
      }

      // Duration filter
      if (safeFilters.duration.length > 0) {
        const serviceDurationHours = service.duration_minutes / 60
        let matchesDuration = false

        safeFilters.duration.forEach((duration) => {
          if (duration === "Under 1 hour" && serviceDurationHours < 1) matchesDuration = true
          if (duration === "1-2 hours" && serviceDurationHours >= 1 && serviceDurationHours <= 2) matchesDuration = true
          if (duration === "2-4 hours" && serviceDurationHours > 2 && serviceDurationHours <= 4) matchesDuration = true
          if (duration === "4+ hours" && serviceDurationHours > 4) matchesDuration = true
        })

        if (!matchesDuration) return false
      }

      // Rating filter
      if (safeFilters.rating.length > 0) {
        let matchesRating = false

        safeFilters.rating.forEach((rating) => {
          const minRating = Number.parseFloat(rating.split("+")[0])
          if (service.rating >= minRating) matchesRating = true
        })

        if (!matchesRating) return false
      }

      return true
    })
  }, [initialServices, filters])

  const handleAddToCart = (service: Service) => {
    if (!user) {
      router.push("/login?redirect=/services")
      return
    }

    addToCart({
      id: service.id,
      name_en: service.name_en,
      name_sw: service.name_sw,
      price: service.price,
      image_url: service.image_url,
      duration_minutes: service.duration_minutes,
    })

    // Show success toast
    toast({
      title: "Added to cart",
      description: `${language === "sw" ? service.name_sw : service.name_en} has been added to your cart.`,
      variant: "success",
    })
  }

  const handleBookNow = (service: Service) => {
    if (!user) {
      router.push("/login?redirect=/services")
      return
    }

    router.push(`/book/${service.id}`)
  }

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => (
        <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-0">
          <CardContent className="p-0">
            <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
              <img
                src={service.image_url || "/placeholder.svg"}
                alt={language === "sw" ? service.name_sw : service.name_en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 left-3 bg-[#2E7D32]">
                {language === "sw" ? service.category_sw : service.category_en}
              </Badge>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-[#212121] mb-2 line-clamp-1">
                {language === "sw" ? service.name_sw : service.name_en}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {language === "sw" ? service.description_sw : service.description_en}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm">{service.rating}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="ml-1 text-sm">{service.duration_minutes} min</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#2E7D32]">
                  TZS {service.price.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCart(service)}
                    className="flex items-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t("Add to Cart")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBookNow(service)}
                    className="bg-[#2E7D32] hover:bg-[#1B5E20]"
                  >
                    {t("Book Now")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

