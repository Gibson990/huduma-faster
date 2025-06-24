"use client"

import { useLanguage } from "@/lib/language"

export default function AboutPage() {
  const { t, language } = useLanguage()

  const content = {
    title_en: "About Huduma Faster",
    title_sw: "Kuhusu Huduma Faster",
    description_en: "Huduma Faster is Tanzania's leading on-demand service platform, connecting customers with trusted service providers for all their home and business needs.",
    description_sw: "Huduma Faster ni jukwaa la huduma za on-demand la Tanzania, linalounganisha wateja na watoa huduma wa kuaminika kwa mahitaji yao yote ya nyumbani na biashara.",
    mission_en: "Our mission is to make quality services accessible to everyone in Tanzania, while creating opportunities for skilled service providers.",
    mission_sw: "Lengo letu ni kufanya huduma bora ziweze kufikiwa na kila mtu nchini Tanzania, huku tukitengeneza fursa kwa watoa huduma wenye ujuzi.",
    vision_en: "To be the most trusted and comprehensive service platform in Tanzania, transforming how people access and provide services.",
    vision_sw: "Kuwa jukwaa la huduma la kuaminika zaidi na la kina nchini Tanzania, kubadilisha jinsi watu wanavyopata na kutoa huduma."
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        {language === "sw" ? content.title_sw : content.title_en}
      </h1>

      <div className="max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-8">
          {language === "sw" ? content.description_sw : content.description_en}
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "sw" ? "Lengo Letu" : "Our Mission"}
          </h2>
          <p className="text-gray-600">
            {language === "sw" ? content.mission_sw : content.mission_en}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "sw" ? "Dira Yetu" : "Our Vision"}
          </h2>
          <p className="text-gray-600">
            {language === "sw" ? content.vision_sw : content.vision_en}
          </p>
        </div>
      </div>
    </div>
  )
} 