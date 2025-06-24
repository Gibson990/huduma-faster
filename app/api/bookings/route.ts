import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received booking data:", body); // DEBUG LOG
    const {
      serviceId,
      name,
      email,
      phone,
      address,
      date,
      time,
      notes,
      userId
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
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
        address,
        booking_date,
        booking_time,
        total_amount,
        status,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        serviceId,
        userId,
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
    const status = searchParams.get('status');
    const unassigned = searchParams.get('unassigned');
    const location = searchParams.get('location');
    const serviceId = searchParams.get('serviceId');

    let queryString = `
      SELECT 
        b.id,
        b.service_id,
        s.name_en as service_name,
        b.customer_id,
        b.provider_id,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.address,
        b.booking_date,
        b.booking_time,
        b.total_amount,
        b.status,
        b.notes,
        b.created_at,
        p.name as provider_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN users p ON b.provider_id = p.id
      WHERE 1=1
    `;
    const queryParams: any[] = [];

    if (userId) {
      queryString += ' AND b.customer_id = $' + (queryParams.length + 1);
      queryParams.push(userId);
    }
    if (status) {
      queryString += ' AND b.status = $' + (queryParams.length + 1);
      queryParams.push(status);
    }
    if (unassigned === 'true') {
      queryString += ' AND b.provider_id IS NULL';
    }
    if (location) {
      queryString += ' AND b.address ILIKE $' + (queryParams.length + 1);
      queryParams.push(`%${location}%`);
    }
    if (serviceId) {
      queryString += ' AND b.service_id = $' + (queryParams.length + 1);
      queryParams.push(serviceId);
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