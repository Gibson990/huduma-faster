"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"

// Popular services for quick booking
const popularServices = [
  {
    id: "1",
    name: "Electrical Wiring",
    price: 300000,
    duration: 180,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "Light Installation",
    price: 150000,
    duration: 90,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Pipe Repair",
    price: 200000,
    duration: 120,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "House Cleaning",
    price: 160000,
    duration: 240,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function BookPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/book")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#212121] mb-4">Book a Service</h1>
        <p className="text-gray-600">Choose from our popular services or browse all available services</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {popularServices.map((service) => (
          <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-0">
            <CardContent className="p-0">
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[#212121] mb-2">{service.name}</h3>
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration} min
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    At your location
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#2E7D32] mb-4">TSh {service.price.toLocaleString()}</div>
                <Button asChild className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
                  <Link href={`/book/${service.id}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">Looking for something else?</p>
        <Button asChild variant="outline" size="lg">
          <Link href="/services">Browse All Services</Link>
        </Button>
      </div>
    </div>
  )
}
