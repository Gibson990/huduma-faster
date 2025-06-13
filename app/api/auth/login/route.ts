import { type NextRequest, NextResponse } from "next/server"

// Simple test users for demo
const testUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@faster.com",
    password: "12345",
    role: "admin" as const,
  },
  {
    id: 2,
    name: "Test User",
    email: "user@faster.com",
    password: "12345",
    role: "customer" as const,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user with matching email and password
    const user = testUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Simple token (just user ID for demo)
    const token = `demo-token-${user.id}`

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
