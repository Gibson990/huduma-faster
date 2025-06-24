import { query } from "./db"

export interface Booking {
  id: number
  service_id: number
  service_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  booking_date: Date
  booking_time: string
  total_amount: number
  status: string
  created_at: Date
}

export async function getBookingById(id: number): Promise<Booking | null> {
  try {
    const result = await query(
      `SELECT 
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
      WHERE b.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return null
    }

    const booking = result.rows[0]
    return {
      id: Number(booking.id),
      service_id: Number(booking.service_id),
      service_name: booking.service_name,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      address: booking.address,
      booking_date: new Date(booking.booking_date),
      booking_time: booking.booking_time,
      total_amount: Number(booking.total_amount),
      status: booking.status,
      created_at: new Date(booking.created_at)
    }
  } catch (error) {
    console.error("Error fetching booking:", error)
    throw error
  }
}

export async function getUserBookings(userId: number): Promise<Booking[]> {
  try {
    const result = await query(
      `SELECT 
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
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC`,
      [userId]
    )

    return result.rows.map(booking => ({
      id: Number(booking.id),
      service_id: Number(booking.service_id),
      service_name: booking.service_name,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      address: booking.address,
      booking_date: new Date(booking.booking_date),
      booking_time: booking.booking_time,
      total_amount: Number(booking.total_amount),
      status: booking.status,
      created_at: new Date(booking.created_at)
    }))
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    throw error
  }
} 