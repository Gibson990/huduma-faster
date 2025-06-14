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
        s.name as service_name,
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