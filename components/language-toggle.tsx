"use client"

import { useLanguage } from "@/lib/language"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      onClick={() => setLanguage(language === "en" ? "sw" : "en")}
      className="w-16"
    >
      {language === "en" ? "SW" : "EN"}
    </Button>
  )
} 