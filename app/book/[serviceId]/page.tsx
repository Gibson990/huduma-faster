"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { ServiceDetails } from "@/components/service-details"
import { BookingForm } from "@/components/booking-form"

// Mock service data - in a real app, this would come from an API
const services = [
  {
    id: 1,
    name_en: "House Cleaning",
    name_sw: "Usafi wa Nyumba",
    description_en:
      "Professional house cleaning service for all rooms including kitchen, bathrooms, bedrooms, and living areas.",
    description_sw:
      "Huduma ya kitaalamu ya usafi wa nyumba kwa vyumba vyote ikiwa ni pamoja na jiko, vyoo, vyumba vya kulala, na maeneo ya kuishi.",
    price: 25000,
    category: "Cleaning",
    image_url: "/placeholder.svg?height=300&width=500&text=House+Cleaning",
    duration_minutes: 120,
    features: [
      "Deep cleaning of all rooms",
      "Kitchen and bathroom sanitization",
      "Dusting and vacuuming",
      "Window cleaning",
    ],
  },
  {
    id: 2,
    name_en: "Plumbing Repair",
    name_sw: "Matengenezo ya Mabomba",
    description_en: "Expert plumbing repair services for leaks, clogs, installations, and other plumbing issues.",
    description_sw:
      "Huduma za kitaalamu za matengenezo ya mabomba kwa ajili ya uvujaji, kuziba, ufungaji, na matatizo mengine ya mabomba.",
    price: 35000,
    category: "Plumbing",
    image_url: "/placeholder.svg?height=300&width=500&text=Plumbing+Repair",
    duration_minutes: 90,
    features: ["Leak detection and repair", "Drain unclogging", "Fixture installation", "Pipe replacement"],
  },
  {
    id: 3,
    name_en: "Electrical Services",
    name_sw: "Huduma za Umeme",
    description_en:
      "Comprehensive electrical services including installations, repairs, and maintenance for your home or office.",
    description_sw:
      "Huduma kamili za umeme ikiwa ni pamoja na ufungaji, matengenezo, na matengenezo kwa ajili ya nyumba au ofisi yako.",
    price: 40000,
    category: "Electrical",
    image_url: "/placeholder.svg?height=300&width=500&text=Electrical+Services",
    duration_minutes: 60,
    features: [
      "Wiring installation and repair",
      "Light fixture installation",
      "Circuit breaker replacement",
      "Electrical troubleshooting",
    ],
  },
]

export default function BookServicePage() {
  const { user, isLoading } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=/book/${params.serviceId}`)
    }
  }, [user, isLoading, router, params.serviceId])

  useEffect(() => {
    // Simulate API call to get service details
    const serviceId = Number(params.serviceId)
    const foundService = services.find((s) => s.id === serviceId)

    if (foundService) {
      setService(foundService)
    }

    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [params.serviceId])

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <p className="text-gray-600 mb-4">The requested service could not be found.</p>
          <button
            onClick={() => router.push("/services")}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-md"
          >
            Browse Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Service</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <ServiceDetails service={service} />
        </div>
        <div>
          <BookingForm service={service} user={user} />
        </div>
      </div>
    </div>
  )
}
