"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Phone, Globe, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/lib/language"
import { useAuth } from "./auth/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MobileNav } from "./mobile-nav"
import { useCart } from "@/lib/cart"

export function Header() {
  const { t, language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const { cart = [] } = useCart() // Provide default empty array if cart is undefined
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Add null check before using reduce
  const cartItemCount = Array.isArray(cart) ? cart.reduce((total, item) => total + (item?.quantity || 0), 0) : 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link href="/" className="text-xl md:text-2xl font-bold text-[#2E7D32] flex-shrink-0">
              Huduma <span className="text-[#8D6E63]">Faster</span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-[#212121] hover:text-[#2E7D32] transition-colors text-sm">
                {t("nav.home")}
              </Link>
              <Link href="/services" className="text-[#212121] hover:text-[#2E7D32] transition-colors text-sm">
                {t("nav.services")}
              </Link>
              <Link href="/how-it-works" className="text-[#212121] hover:text-[#2E7D32] transition-colors text-sm">
                How It Works
              </Link>
              <Link href="/about" className="text-[#212121] hover:text-[#2E7D32] transition-colors text-sm">
                About
              </Link>
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden xl:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#C8E6C9] focus:border-[#2E7D32] text-sm"
              />
            </form>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-xs md:text-sm text-[#2E7D32]">
              <Phone className="h-3 w-3 md:h-4 md:w-4" />
              <span>+255 700 000 000</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English {language === "en" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("sw")}>
                  Kiswahili {language === "sw" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Icon Button */}
            <Button variant="ghost" size="sm" className="p-2 relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2E7D32] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t("nav.dashboard")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>{t("nav.logout")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-[#212121] hover:text-[#2E7D32]">
                  <Link href="/login">{t("nav.login")}</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
                  <Link href="/signup">{t("nav.signup")}</Link>
                </Button>
              </div>
            )}

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
