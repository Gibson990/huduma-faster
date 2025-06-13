import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/lib/language"
import { AuthProvider } from "@/components/auth/auth-provider"
import { CartProvider } from "@/lib/cart"
import { BookingsProvider } from "@/lib/bookings"
import { Toaster } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Huduma Faster - Local Service Booking Platform",
  description:
    "Book trusted local service providers instantly. From electricians to cleaners, get quality services at your doorstep in Tanzania.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <BookingsProvider>
                <Header />
                <main>{children}</main>
                <Footer />
                <Toaster />
              </BookingsProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
