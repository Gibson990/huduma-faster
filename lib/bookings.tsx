"use client"

import * as React from "react"
import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface Booking {
  id: string
  userId: number
  serviceId: string
  serviceName: string
  servicePrice: number
  providerName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceAddress: string
  scheduledDate: Date
  scheduledTime: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid"
  paymentMethod: string
  notes?: string
  createdAt: Date
  rating?: number
  review?: string
  quantity: number
}

interface BookingsContextType {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => string
  updateBooking: (id: string, updates: Partial<Booking>) => void
  getUserBookings: (userId: number) => Booking[]
  getAllBookings: () => Booking[]
  getBookingById: (id: string) => Booking | undefined
  getBookingsByIds: (ids: string[]) => Booking[]
  getTotalRevenue: () => number
  getPendingBookingsCount: () => number
  getCompletedBookingsCount: () => number
  getAverageRating: () => number
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined)

// Helper function to convert date strings back to Date objects
const parseDates = (booking: any): Booking => ({
  ...booking,
  scheduledDate: new Date(booking.scheduledDate),
  createdAt: new Date(booking.createdAt),
})

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem("huduma-bookings")
    if (savedBookings) {
      try {
        const parsed = JSON.parse(savedBookings)
        // Convert date strings back to Date objects
        const bookingsWithDates = parsed.map(parseDates)
        setBookings(bookingsWithDates)
      } catch (error) {
        console.error("Error parsing bookings:", error)
        // If there's an error, start with empty bookings
        setBookings([])
      }
    }
  }, [])

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem("huduma-bookings", JSON.stringify(bookings))
  }, [bookings])

  const addBooking = (bookingData: Omit<Booking, "id" | "createdAt">): string => {
    const newBooking: Booking = {
      ...bookingData,
      id: `BK${Date.now().toString().slice(-6)}`,
      createdAt: new Date(),
    }

    setBookings((prev) => {
      const updated = [newBooking, ...prev]
      console.log("Added booking:", newBooking.id, "Total bookings:", updated.length)
      return updated
    })

    return newBooking.id
  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking)))
  }

  const getUserBookings = (userId: number): Booking[] => {
    return bookings.filter((booking) => booking.userId === userId)
  }

  const getAllBookings = (): Booking[] => {
    return bookings
  }

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((booking) => booking.id === id)
  }

  const getBookingsByIds = (ids: string[]): Booking[] => {
    return bookings.filter((booking) => ids.includes(booking.id))
  }

  const getTotalRevenue = (): number => {
    return bookings
      .filter((booking) => booking.status === "completed")
      .reduce((sum, booking) => sum + booking.servicePrice, 0)
  }

  const getPendingBookingsCount = (): number => {
    return bookings.filter((booking) => booking.status === "pending").length
  }

  const getCompletedBookingsCount = (): number => {
    return bookings.filter((booking) => booking.status === "completed").length
  }

  const getAverageRating = (): number => {
    const ratedBookings = bookings.filter((booking) => booking.rating !== undefined)
    if (ratedBookings.length === 0) return 0

    const totalRating = ratedBookings.reduce((sum, booking) => sum + (booking.rating || 0), 0)
    return totalRating / ratedBookings.length
  }

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        getUserBookings,
        getAllBookings,
        getBookingById,
        getBookingsByIds,
        getTotalRevenue,
        getPendingBookingsCount,
        getCompletedBookingsCount,
        getAverageRating,
      }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingsContext)
  if (!context) {
    throw new Error("useBookings must be used within a BookingsProvider")
  }
  return context
}

// Admin hook to fetch bookings from backend
export function useAdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/bookings")
        if (!res.ok) throw new Error("Failed to fetch bookings")
        const data = await res.json()
        // Convert date strings to Date objects
        setBookings(data.map(parseDates))
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const getTotalRevenue = () =>
    bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.servicePrice, 0)
  const getPendingBookingsCount = () => bookings.filter((b) => b.status === "pending").length
  const getCompletedBookingsCount = () => bookings.filter((b) => b.status === "completed").length
  const getAllBookings = () => bookings

  return {
    bookings,
    loading,
    error,
    getTotalRevenue,
    getPendingBookingsCount,
    getCompletedBookingsCount,
    getAllBookings,
  }
}
