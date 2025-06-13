"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/components/auth/auth-provider"

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  useEffect(() => {
    if (user) {
      router.push(redirect || "/dashboard")
    }
  }, [user, router, redirect])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#212121] mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue with your booking</p>
        </div>
        <LoginForm redirectTo={redirect} />
      </div>
    </div>
  )
}
