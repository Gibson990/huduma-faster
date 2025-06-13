"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const faqItems = [
  {
    question: "How do I book a service?",
    answer:
      "You can book a service by browsing our services page, selecting the service you need, and filling out the booking form with your details and preferred time.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "Currently, we accept cash payments upon service completion. Mobile money payment options are coming soon.",
  },
  {
    question: "How are service providers verified?",
    answer:
      "All our service providers undergo background checks, skill verification, and customer review assessments before joining our platform.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled time. Contact our support team for assistance.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "We have a satisfaction guarantee. If you're not happy with the service, contact us within 24 hours and we'll work to resolve the issue.",
  },
]

export default function SupportPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message Sent!",
      description: "We've received your message and will get back to you within 24 hours.",
      variant: "success",
    })

    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#212121] mb-4">Support Center</h1>
        <p className="text-gray-600">We're here to help! Get in touch with us or find answers to common questions.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#212121] flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="bg-[#2E7D32] hover:bg-[#1B5E20]" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#212121] flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium text-[#212121] mb-2">{item.question}</h4>
                    <p className="text-gray-600 text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#212121]">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#2E7D32]" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-gray-600">+255 700 000 000</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#2E7D32]" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-600">support@hudumafaster.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-[#2E7D32]" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-gray-600">Dar es Salaam, Tanzania</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#2E7D32]" />
                <div>
                  <div className="font-medium">Support Hours</div>
                  <div className="text-sm text-gray-600">24/7 Available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-[#F5F5F5]">
            <CardContent className="p-6">
              <h3 className="font-medium text-[#212121] mb-2">Emergency Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                For urgent issues with ongoing services, call our emergency hotline.
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Phone className="h-4 w-4 mr-2" />
                Emergency: +255 700 000 001
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
