"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Plus, Edit, Trash2, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language"

const mockServices = [
  {
    id: 1,
    name_en: "Electrical Wiring",
    name_sw: "Uwiring wa Umeme",
    description_en: "Complete electrical wiring for homes and offices",
    description_sw: "Uwiring kamili wa umeme kwa nyumba na ofisi",
    price: 300000,
    duration_minutes: 180,
    category_id: 1,
    category_name: "Electrical Services",
    image_url: "/placeholder.svg?height=300&width=300",
    is_active: true,
    provider_count: 3,
    booking_count: 45,
  },
  {
    id: 2,
    name_en: "House Cleaning",
    name_sw: "Usafi wa Nyumba",
    description_en: "Deep cleaning for entire house",
    description_sw: "Usafi wa kina kwa nyumba nzima",
    price: 160000,
    duration_minutes: 240,
    category_id: 3,
    category_name: "Cleaning Services",
    image_url: "/placeholder.svg?height=300&width=300",
    is_active: true,
    provider_count: 5,
    booking_count: 78,
  },
  {
    id: 3,
    name_en: "Pipe Repair",
    name_sw: "Ukarabati wa Mabomba",
    description_en: "Fix leaking and broken pipes",
    description_sw: "Kukarabati mabomba yanayovuja na yaliyovunjika",
    price: 200000,
    duration_minutes: 120,
    category_id: 2,
    category_name: "Plumbing Services",
    image_url: "/placeholder.svg?height=300&width=300",
    is_active: true,
    provider_count: 2,
    booking_count: 32,
  },
]

const mockCategories = [
  { id: 1, name: "Electrical Services" },
  { id: 2, name: "Plumbing Services" },
  { id: 3, name: "Cleaning Services" },
  { id: 4, name: "Carpentry" },
  { id: 5, name: "Painting" },
]

export function ServiceManagement() {
  const { t, language } = useLanguage()
  const [services, setServices] = useState(mockServices)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [formData, setFormData] = useState({
    name_en: "",
    name_sw: "",
    description_en: "",
    description_sw: "",
    price: "",
    duration_minutes: "",
    category_id: "",
    image_url: "",
  })

  const handleAddService = () => {
    const newService = {
      id: Date.now(),
      ...formData,
      price: Number.parseFloat(formData.price),
      duration_minutes: Number.parseInt(formData.duration_minutes),
      category_id: Number.parseInt(formData.category_id),
      category_name: mockCategories.find((c) => c.id === Number.parseInt(formData.category_id))?.name || "",
      is_active: true,
      provider_count: 0,
      booking_count: 0,
    }
    setServices([...services, newService])
    setFormData({
      name_en: "",
      name_sw: "",
      description_en: "",
      description_sw: "",
      price: "",
      duration_minutes: "",
      category_id: "",
      image_url: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditService = (service: any) => {
    setEditingService(service)
    setFormData({
      name_en: service.name_en,
      name_sw: service.name_sw,
      description_en: service.description_en,
      description_sw: service.description_sw,
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString(),
      category_id: service.category_id.toString(),
      image_url: service.image_url,
    })
  }

  const handleUpdateService = () => {
    setServices(
      services.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              ...formData,
              price: Number.parseFloat(formData.price),
              duration_minutes: Number.parseInt(formData.duration_minutes),
              category_id: Number.parseInt(formData.category_id),
              category_name: mockCategories.find((c) => c.id === Number.parseInt(formData.category_id))?.name || "",
            }
          : s,
      ),
    )
    setEditingService(null)
    setFormData({
      name_en: "",
      name_sw: "",
      description_en: "",
      description_sw: "",
      price: "",
      duration_minutes: "",
      category_id: "",
      image_url: "",
    })
  }

  const handleDeleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const toggleServiceStatus = (id: number) => {
    setServices(services.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#212121] flex items-center gap-2">
            <Package className="h-5 w-5 md:h-6 md:w-6" />
            Service Management
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Manage all services and their details</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <ServiceForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddService}
              submitLabel="Add Service"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => (
          <Card key={service.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                <img
                  src={service.image_url || "/placeholder.svg"}
                  alt={language === "sw" ? service.name_sw : service.name_en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={service.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-[#212121] text-sm md:text-base line-clamp-1">
                    {language === "sw" ? service.name_sw : service.name_en}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                    {language === "sw" ? service.description_sw : service.description_en}
                  </p>
                </div>

                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{service.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-bold text-[#2E7D32]">TSh {service.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.duration_minutes} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Providers:</span>
                    <span>{service.provider_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bookings:</span>
                    <span>{service.booking_count}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditService(service)} className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id)}
                    className="flex-1"
                  >
                    {service.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <ServiceForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateService}
            submitLabel="Update Service"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ServiceForm({ formData, setFormData, onSubmit, submitLabel }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name_en">Service Name (English)</Label>
          <Input
            id="name_en"
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            placeholder="e.g., Electrical Wiring"
          />
        </div>
        <div>
          <Label htmlFor="name_sw">Service Name (Swahili)</Label>
          <Input
            id="name_sw"
            value={formData.name_sw}
            onChange={(e) => setFormData({ ...formData, name_sw: e.target.value })}
            placeholder="e.g., Uwiring wa Umeme"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description_en">Description (English)</Label>
          <Textarea
            id="description_en"
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            placeholder="Detailed service description in English"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="description_sw">Description (Swahili)</Label>
          <Textarea
            id="description_sw"
            value={formData.description_sw}
            onChange={(e) => setFormData({ ...formData, description_sw: e.target.value })}
            placeholder="Detailed service description in Swahili"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (TSh)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="150000"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            placeholder="120"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <Button onClick={onSubmit} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
        {submitLabel}
      </Button>
    </div>
  )
}
