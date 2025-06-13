"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Wrench, Sparkles, Hammer, Paintbrush, Settings } from "lucide-react"
import { useLanguage } from "@/lib/language"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name_en: "Electrical Services",
    name_sw: "Huduma za Umeme",
    description_en: "Professional electrical repairs and installations",
    description_sw: "Ukarabati na usakinishaji wa umeme wa kitaalamu",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000",
    serviceCount: 12,
  },
  {
    id: 2,
    name_en: "Plumbing Services",
    name_sw: "Huduma za Mabomba",
    description_en: "Expert plumbing solutions for your home",
    description_sw: "Suluhisho za kitaalamu za mabomba kwa nyumba yako",
    icon: Wrench,
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000",
    serviceCount: 8,
  },
  {
    id: 3,
    name_en: "Cleaning Services",
    name_sw: "Huduma za Usafi",
    description_en: "Professional home and office cleaning",
    description_sw: "Usafi wa kitaalamu wa nyumba na ofisi",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000",
    serviceCount: 6,
  },
  {
    id: 4,
    name_en: "Carpentry",
    name_sw: "Useremala",
    description_en: "Custom woodwork and furniture repairs",
    description_sw: "Kazi za mbao na ukarabati wa samani",
    icon: Hammer,
    image: "https://images.unsplash.com/photo-1497219055242-93359eeed651?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D",
    serviceCount: 10,
  },
  {
    id: 5,
    name_en: "Painting",
    name_sw: "Uchoraji",
    description_en: "Interior and exterior painting services",
    description_sw: "Huduma za uchoraji wa ndani na nje",
    icon: Paintbrush,
    image: "https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000",
    serviceCount: 5,
  },
  {
    id: 6,
    name_en: "Appliance Repair",
    name_sw: "Ukarabati wa Vifaa",
    description_en: "Fix and maintain household appliances",
    description_sw: "Kukarabati na kutunza vifaa vya nyumbani",
    icon: Settings,
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000",
    serviceCount: 9,
  },
]

export function ServiceCategories() {
  const { t, language } = useLanguage()

  return (
    <section className="py-12 md:py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-4">{t("services.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">{t("services.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-white h-full"
              >
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={language === "sw" ? category.name_sw : category.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <IconComponent className="h-6 w-6 md:h-8 md:w-8 mb-2" />
                      <div className="text-xs md:text-sm font-medium">
                        {category.serviceCount} {t("nav.services")}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg md:text-xl font-semibold text-[#212121] mb-2">
                      {language === "sw" ? category.name_sw : category.name_en}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-4 flex-1">
                      {language === "sw" ? category.description_sw : category.description_en}
                    </p>
                    <Button asChild className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium">
                      <Link href="/services">{t("services.view_services")}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
