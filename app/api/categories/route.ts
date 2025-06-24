import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query('SELECT * FROM service_categories ORDER BY id DESC')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name_en, name_sw, description_en, description_sw, icon, image_url, is_active } = body
    const result = await query(
      `INSERT INTO service_categories (name_en, name_sw, description_en, description_sw, icon, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name_en, name_sw, description_en, description_sw, icon, image_url, is_active]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 