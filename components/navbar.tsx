"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language"
import { CartButton } from "./cart-button"
import { UserNav } from "./user-nav"
import { LanguageToggle } from "./language-toggle"

export function Navbar() {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-[#2E7D32]">Huduma Faster</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            {t("Home")}
          </Link>
          <Link href="/services" className="text-gray-600 hover:text-gray-900">
            {t("Services")}
          </Link>
          <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900">
            {t("How It Works")}
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            {t("About")}
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <CartButton />
          <UserNav />
        </div>
      </div>
    </header>
  )
} 