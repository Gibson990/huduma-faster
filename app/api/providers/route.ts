import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Get all providers
export async function GET() {
  try {
    const result = await query("SELECT * FROM users WHERE role = 'provider' ORDER BY id DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
  }
}

// Add a new provider
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, password_hash, is_active, image, specialization, location, rating, totalJobs, verified } = body
    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash, role, is_active, image, specialization, location, rating, totalJobs, verified) VALUES ($1, $2, $3, $4, 'provider', $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [name, email, phone, password_hash, is_active ?? true, image, specialization, location, rating, totalJobs, verified]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 })
  }
} 