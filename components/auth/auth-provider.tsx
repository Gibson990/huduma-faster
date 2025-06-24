"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "customer"
  phone?: string
  address?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem("auth-token")
    const userData = localStorage.getItem("user-data")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem("auth-token", data.token)
        localStorage.setItem("user-data", JSON.stringify(data.user))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem("auth-token", data.token)
        localStorage.setItem("user-data", JSON.stringify(data.user))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
