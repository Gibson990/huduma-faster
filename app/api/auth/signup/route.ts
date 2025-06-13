import { type NextRequest, NextResponse } from "next/server"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    // In real app, check if user exists and save to database
    const hashedPassword = hashPassword(password)

    const newUser = {
      id: Date.now(), // In real app, use database auto-increment
      name,
      email,
      role: "customer" as const,
    }

    const token = generateToken(newUser)

    return NextResponse.json({
      user: newUser,
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
