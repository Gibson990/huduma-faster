"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Clock, Shield } from "lucide-react"
import { useLanguage } from "@/lib/language"
import Link from "next/link"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">{t("hero.title")}</h1>
              <p className="text-lg md:text-xl text-green-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t("hero.subtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#2E7D32] hover:bg-gray-100 hover:text-[#1B5E20] font-semibold"
              >
                <Link href="/services">
                  {t("hero.book_now")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-[#2E7D32] font-semibold bg-transparent"
              >
                <Link href="/services">{t("hero.learn_more")}</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 md:pt-8">
              <div className="text-center">
                <Phone className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-[#C8E6C9]" />
                <div className="text-sm md:text-base font-medium">{t("hero.support_24_7")}</div>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-[#C8E6C9]" />
                <div className="text-sm md:text-base font-medium">{t("hero.quick_response")}</div>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-[#C8E6C9]" />
                <div className="text-sm md:text-base font-medium">{t("hero.verified_providers")}</div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm max-w-md mx-auto">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D"
                alt="Service Provider"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white text-[#2E7D32] p-4 md:p-6 rounded-xl shadow-lg">
              <div className="text-xl md:text-2xl font-bold">500+</div>
              <div className="text-xs md:text-sm text-gray-600">Wateja Wenye Furaha</div>
            </div>
            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-[#8D6E63] text-white p-3 md:p-4 rounded-xl shadow-lg">
              <div className="text-lg font-bold">4.9★</div>
              <div className="text-xs">Ukadiriaji</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
