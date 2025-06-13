"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Phone, Mail, MoreHorizontal, Plus, Trash, UserCheck, UserX, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Initial providers data
const initialProviders = [
  {
    id: 1,
    name: "Mike Johnson",
    email: "mike@providers.com",
    phone: "+255700001001",
    specialization: "Electrical Services",
    rating: 4.8,
    totalJobs: 156,
    status: "active",
    verified: true,
    location: "Dar es Salaam",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@providers.com",
    phone: "+255700001002",
    specialization: "Plumbing Services",
    rating: 4.6,
    totalJobs: 98,
    status: "active",
    verified: true,
    location: "Arusha",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
  },
  {
    id: 3,
    name: "David Brown",
    email: "david@providers.com",
    phone: "+255700001003",
    specialization: "Cleaning Services",
    rating: 4.9,
    totalJobs: 203,
    status: "active",
    verified: true,
    location: "Mwanza",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
  },
  {
    id: 4,
    name: "Lisa Garcia",
    email: "lisa@providers.com",
    phone: "+255700001004",
    specialization: "Carpentry",
    rating: 4.7,
    totalJobs: 134,
    status: "inactive",
    verified: false,
    location: "Dodoma",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000",
  },
]

// Available specializations
const specializations = [
  "Electrical Services",
  "Plumbing Services",
  "Cleaning Services",
  "Carpentry",
  "Painting",
  "Furniture",
  "Other Services",
]

// Available locations
const locations = ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Moshi", "Tanga", "Zanzibar"]

export function ProviderManagement() {
  const [providers, setProviders] = useState(initialProviders)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const { toast } = useToast()

  // New provider form state
  const [newProvider, setNewProvider] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    location: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProvider((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewProvider((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddProvider = () => {
    // Validate form
    if (
      !newProvider.name ||
      !newProvider.email ||
      !newProvider.phone ||
      !newProvider.specialization ||
      !newProvider.location
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new provider
    const newId = Math.max(...providers.map((p) => p.id)) + 1
    const provider = {
      id: newId,
      name: newProvider.name,
      email: newProvider.email,
      phone: newProvider.phone,
      specialization: newProvider.specialization,
      location: newProvider.location,
      rating: 0,
      totalJobs: 0,
      status: "active",
      verified: false,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000", // Default image for new providers
    }

    setProviders([...providers, provider])
    setIsAddDialogOpen(false)
    setNewProvider({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      location: "",
    })

    toast({
      title: "Provider Added",
      description: `${provider.name} has been added as a service provider`,
      variant: "success",
    })
  }

  const handleDeleteProvider = () => {
    if (selectedProvider) {
      setProviders(providers.filter((p) => p.id !== selectedProvider.id))
      setIsDeleteDialogOpen(false)
      setSelectedProvider(null)

      toast({
        title: "Provider Deleted",
        description: `${selectedProvider.name} has been removed from service providers`,
        variant: "success",
      })
    }
  }

  const toggleProviderStatus = (provider: any) => {
    const newStatus = provider.status === "active" ? "inactive" : "active"
    setProviders(providers.map((p) => (p.id === provider.id ? { ...p, status: newStatus } : p)))

    toast({
      title: `Provider ${newStatus === "active" ? "Activated" : "Deactivated"}`,
      description: `${provider.name} has been ${newStatus === "active" ? "activated" : "deactivated"}`,
      variant: "success",
    })
  }

  const openDetailsDialog = (provider: any) => {
    setSelectedProvider(provider)
    setIsDetailsDialogOpen(true)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#212121]">Service Providers</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
          <Plus className="mr-2 h-4 w-4" /> Add Provider
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Provider</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Specialization</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Jobs</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={provider.image || "/placeholder.svg?height=40&width=40"}
                        alt={provider.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-[#212121]">{provider.name}</div>
                        {provider.verified && <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {provider.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {provider.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{provider.specialization}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{provider.totalJobs}</td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        provider.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {provider.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDetailsDialog(provider)}>
                          <Info className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleProviderStatus(provider)}>
                          {provider.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              <span>Activate</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProvider(provider)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Provider Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service Provider</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newProvider.name}
                  onChange={handleInputChange}
                  placeholder="Enter provider's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newProvider.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newProvider.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +255700000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={newProvider.specialization}
                  onValueChange={(value) => handleSelectChange("specialization", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newProvider.location} onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProvider} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                Add Provider
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Provider Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service Provider</DialogTitle>
            </DialogHeader>
            {selectedProvider && (
              <div className="py-4">
                <p className="mb-4">
                  Are you sure you want to delete <strong>{selectedProvider.name}</strong>? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProvider}>
                    Delete Provider
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Provider Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Provider Details</DialogTitle>
            </DialogHeader>
            {selectedProvider && (
              <div className="py-4">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={selectedProvider.image || "/placeholder.svg?height=80&width=80"}
                    alt={selectedProvider.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{selectedProvider.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{selectedProvider.rating} rating</span>
                    </div>
                    <Badge
                      className={
                        selectedProvider.status === "active"
                          ? "bg-green-100 text-green-800 mt-1"
                          : "bg-gray-100 text-gray-800 mt-1"
                      }
                    >
                      {selectedProvider.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500">Specialization</Label>
                    <p className="text-sm font-medium">{selectedProvider.specialization}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Location</Label>
                    <p className="text-sm font-medium">{selectedProvider.location}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Email</Label>
                    <p className="text-sm font-medium">{selectedProvider.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <p className="text-sm font-medium">{selectedProvider.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Total Jobs</Label>
                    <p className="text-sm font-medium">{selectedProvider.totalJobs} completed</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Verification</Label>
                    <p className="text-sm font-medium">{selectedProvider.verified ? "Verified" : "Not verified"}</p>
                  </div>
                </div>

                <div className="mt-6 space-x-2 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Here you would implement functionality to contact the provider
                      toast({
                        title: "Contact Initiated",
                        description: `Sending message to ${selectedProvider.name}`,
                        variant: "success",
                      })
                    }}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                  <Button
                    onClick={() => toggleProviderStatus(selectedProvider)}
                    className={selectedProvider.status === "active" ? "bg-amber-600" : "bg-[#2E7D32]"}
                  >
                    {selectedProvider.status === "active" ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
