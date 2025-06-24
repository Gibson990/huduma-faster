import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const result = await query(
      `SELECT 
        b.id,
        s.name_en as service_name,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.address,
        b.booking_date,
        b.booking_time,
        b.total_amount,
        b.status
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.id = $1`,
      [params.bookingId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: { params: { bookingId: string } }) {
  try {
    const body = await request.json();
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in body) {
      fields.push(`${key} = $${idx}`);
      values.push(body[key]);
      idx++;
    }
    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    values.push(params.bookingId);
    const result = await query(
      `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
} 