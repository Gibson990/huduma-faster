import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      name,
      email,
      phone,
      address,
      date,
      time,
      notes
    } = body;

    // Get service price
    const serviceResult = await query(
      'SELECT base_price FROM services WHERE id = $1',
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const basePrice = serviceResult.rows[0].base_price;

    // Create booking
    const result = await query(
      `INSERT INTO bookings (
        service_id,
        customer_name,
        customer_email,
        customer_phone,
        address,
        booking_date,
        booking_time,
        total_amount,
        status,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
      [
        serviceId,
        name,
        email,
        phone,
        address,
        date,
        time,
        basePrice,
        'pending',
        notes
      ]
    );

    return NextResponse.json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let queryString = `
      SELECT 
        b.id,
        b.service_id,
        s.name_en as service_name,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.address,
        b.booking_date,
        b.booking_time,
        b.total_amount,
        b.status,
        b.created_at
      FROM bookings b
      JOIN services s ON b.service_id = s.id
    `;
    const queryParams = [];

    if (userId) {
      queryString += ' WHERE b.customer_id = $1';
      queryParams.push(userId);
    }

    queryString += ' ORDER BY b.created_at DESC';

    const result = await query(queryString, queryParams);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
} 