"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronUp, Filter } from "lucide-react"

// Categories for Tanzania-specific services
const categories = [
  "Electrical Services",
  "Plumbing Services",
  "Cleaning Services",
  "Carpentry",
  "Painting",
  "Moving Services",
]

const durations = ["Under 1 hour", "1-2 hours", "2-4 hours", "4+ hours"]
const ratings = ["4.5+", "4.0+", "3.5+", "3.0+"]

interface ServiceFiltersProps {
  filters: {
    search: string
    categories: string[]
    priceRange: [number, number]
    duration: string[]
    rating: string[]
  }
  onFiltersChange: (filters: any) => void
}

export function ServiceFilters({ filters, onFiltersChange }: ServiceFiltersProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({
        ...filters,
        categories: [...filters.categories, category],
      })
    } else {
      onFiltersChange({
        ...filters,
        categories: filters.categories.filter((c) => c !== category),
      })
    }
  }

  const handleDurationChange = (duration: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({
        ...filters,
        duration: [...filters.duration, duration],
      })
    } else {
      onFiltersChange({
        ...filters,
        duration: filters.duration.filter((d) => d !== duration),
      })
    }
  }

  const handleRatingChange = (rating: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({
        ...filters,
        rating: [...filters.rating, rating],
      })
    } else {
      onFiltersChange({
        ...filters,
        rating: filters.rating.filter((r) => r !== rating),
      })
    }
  }

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: value as [number, number],
    })
  }

  const handleReset = () => {
    onFiltersChange({
      search: "",
      categories: [],
      priceRange: [0, 500000],
      duration: [],
      rating: [],
    })
  }

  return (
    <Card className="sticky top-4 border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#212121]">Filters</CardTitle>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <Filter className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={`space-y-6 ${isCollapsed ? "hidden lg:block" : "block"}`}>
        <div className="space-y-4">
          <h3 className="font-medium text-[#212121]">Price Range (TSh)</h3>
          <div className="px-2">
            <Slider
              defaultValue={[0, 500000]}
              min={0}
              max={500000}
              step={10000}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="mb-6"
            />
            <div className="flex items-center justify-between text-sm">
              <span>TSh {filters.priceRange[0].toLocaleString()}</span>
              <span>TSh {filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-[#212121]">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-[#212121]">Duration</h3>
          <div className="space-y-2">
            {durations.map((duration) => (
              <div key={duration} className="flex items-center space-x-2">
                <Checkbox
                  id={`duration-${duration}`}
                  checked={filters.duration.includes(duration)}
                  onCheckedChange={(checked) => handleDurationChange(duration, checked === true)}
                />
                <Label htmlFor={`duration-${duration}`} className="text-sm">
                  {duration}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-[#212121]">Rating</h3>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating.includes(rating)}
                  onCheckedChange={(checked) => handleRatingChange(rating, checked === true)}
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm">
                  {rating} stars
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleReset} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}
