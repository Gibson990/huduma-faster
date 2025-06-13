import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "customer"
}

export function hashPassword(password: string): string {
  // For demo, just return the password as is
  return password
}

export function comparePassword(password: string, hash: string): boolean {
  // For demo, simple comparison
  return password === hash
}

export function generateToken(user: User): string {
  // Simple demo token
  return `demo-token-${user.id}`
}

export function verifyToken(token: string): User | null {
  // For demo, just return null (not used in current implementation)
  return null
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}
