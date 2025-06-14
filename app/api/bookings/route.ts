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