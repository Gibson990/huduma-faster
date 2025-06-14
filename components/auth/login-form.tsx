"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "./auth-provider"
import { useLanguage } from "@/lib/language"
import { useRouter } from "next/navigation"

interface LoginFormProps {
  redirectTo?: string | null
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        router.push(redirectTo || "/dashboard")
      } else {
        setError(t("auth.invalid_credentials"))
      }
    } catch (err) {
      setError(t("auth.login_error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-center text-[#2E7D32]">{t("auth.login")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <Button type="submit" className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]" disabled={isLoading}>
            {isLoading ? t("common.loading") : t("auth.login")}
          </Button>
        </form>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
          <p className="font-medium mb-2">Test Credentials:</p>
          <p>Admin: admin@faster.com / 12345</p>
          <p>User: user@faster.com / 12345</p>
        </div>
      </CardContent>
    </Card>
  )
}
