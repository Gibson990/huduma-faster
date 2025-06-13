import { ServiceGrid } from "@/components/service-grid"
import { getServices } from "@/lib/services"

export default async function ServicesPage() {
  const services = await getServices()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Services</h1>
      <ServiceGrid initialServices={services} />
    </div>
  )
}
