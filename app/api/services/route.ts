import { NextResponse } from 'next/server'
import { getServices } from '@/lib/services'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const services = await getServices()
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name_en,
      name_sw,
      description_en,
      description_sw,
      base_price,
      duration_minutes,
      category_id,
      image_url
    } = body;
    const result = await query(
      `INSERT INTO services (name_en, name_sw, description_en, description_sw, base_price, duration_minutes, category_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name_en, name_sw, description_en, description_sw, base_price, duration_minutes, category_id, image_url]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
} 