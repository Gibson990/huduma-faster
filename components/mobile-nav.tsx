"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useLanguage } from "@/lib/language"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"

export function MobileNav() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const closeNav = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-[#2E7D32]">Menu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-4 mt-6">
          <Link href="/" className="text-[#212121] hover:text-[#2E7D32] transition-colors py-2" onClick={closeNav}>
            {t("nav.home")}
          </Link>
          <Link
            href="/services"
            className="text-[#212121] hover:text-[#2E7D32] transition-colors py-2"
            onClick={closeNav}
          >
            {t("nav.services")}
          </Link>
          <Link
            href="/services"
            className="text-[#212121] hover:text-[#2E7D32] transition-colors py-2"
            onClick={closeNav}
          >
            How It Works
          </Link>
          <Link
            href="/services"
            className="text-[#212121] hover:text-[#2E7D32] transition-colors py-2"
            onClick={closeNav}
          >
            About
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[#212121] hover:text-[#2E7D32] transition-colors py-2"
                onClick={closeNav}
              >
                {t("nav.dashboard")}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#212121] hover:text-[#2E7D32] transition-colors py-2"
                onClick={closeNav}
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/signup"
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded text-center"
                onClick={closeNav}
              >
                {t("nav.signup")}
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
