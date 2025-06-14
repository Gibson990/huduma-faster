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
import { ServiceCard } from "./service-card"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"

interface ServiceGridProps {
  initialServices: Service[]
  filters?: {
    search?: string
    category?: string
    priceRange?: [number, number]
    duration?: number
    rating?: number
  }
}

export function ServiceGrid({ initialServices, filters }: ServiceGridProps) {
  const { t, language } = useLanguage()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [services] = useState(initialServices)
  const [searchTerm, setSearchTerm] = useState(filters?.search || "")
  const [selectedCategory, setSelectedCategory] = useState(filters?.category || "all")
  const [priceRange, setPriceRange] = useState<[number, number]>(filters?.priceRange || [0, 1000000])
  const [duration, setDuration] = useState(filters?.duration || 0)
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.name_sw.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || service.category_en === selectedCategory
      const matchesPrice = service.base_price >= priceRange[0] && service.base_price <= priceRange[1]
      const matchesDuration = !duration || service.duration_minutes <= duration
      const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(service.rating))

      return matchesSearch && matchesCategory && matchesPrice && matchesDuration && matchesRating
    })
  }, [services, searchTerm, selectedCategory, priceRange, duration, selectedRatings])

  const handleAddToCart = (service: Service) => {
    if (!user) {
      router.push("/login?redirect=/services")
      return
    }

    addToCart({
      id: service.id,
      name_en: service.name_en,
      name_sw: service.name_sw,
      price: service.base_price,
      image_url: service.image_url,
      duration_minutes: service.duration_minutes,
    })

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

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    )
  }

  return (
    <div className="flex gap-6">
      {/* Filters sidebar */}
      <div className="hidden lg:block w-80 space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Categories</h3>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Home Cleaning">Home Cleaning</SelectItem>
                  <SelectItem value="Gardening">Gardening</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Price Range</h3>
              <Slider
                value={[priceRange[0], priceRange[1]]}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                min={0}
                max={1000000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>TSh {priceRange[0].toLocaleString()}</span>
                <span>TSh {priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Duration</h3>
              <Slider
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                min={0}
                max={240}
                step={30}
                className="w-full"
              />
              <div className="text-sm text-gray-500 text-right">
                {duration ? `${duration} minutes` : "Any duration"}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onCheckedChange={() => handleRatingChange(rating)}
                    />
                    <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1">
                      {rating} {rating === 1 ? "Star" : "Stars"} & Up
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-6">
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onAddToCart={() => handleAddToCart(service)}
              onBookNow={() => handleBookNow(service)}
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No services found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

