import { type NextRequest, NextResponse } from "next/server"
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432
})

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log('Login attempt:', { email, password })

    // Query user from database
    const result = await pool.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [email]
    )

    const user = result.rows[0]
    console.log('Found user:', user ? { ...user, password_hash: '***' } : 'No user found')

    if (!user) {
      console.log('No user found with email:', email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    console.log('Password match:', passwordMatch)

    if (!passwordMatch) {
      console.log('Password mismatch for user:', email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Simple token (just user ID for demo)
    const token = `demo-token-${user.id}`

    console.log('Login successful for user:', email)
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
    console.error('Login error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
