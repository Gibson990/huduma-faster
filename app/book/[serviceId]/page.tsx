"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { ServiceDetails } from "@/components/service-details"
import { BookingForm } from "@/components/booking-form"
import { Service } from "@/lib/services"

interface PageProps {
  params: {
    serviceId: string
  }
}

export default function BookServicePage({ params }: PageProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [service, setService] = useState<Service | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=/book/${params.serviceId}`)
    }
  }, [user, isLoading, router, params.serviceId])

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.serviceId}`)
        if (!response.ok) {
          throw new Error('Service not found')
        }
        const data = await response.json()
        setService(data)
      } catch (error) {
        console.error('Error fetching service:', error)
        toast({
          title: "Error",
          description: "Failed to load service details",
          variant: "destructive",
        })
        router.push("/services")
      } finally {
        setLoading(false)
      }
    }

    if (params.serviceId) {
      fetchService()
    }
  }, [params.serviceId, router, toast])

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
