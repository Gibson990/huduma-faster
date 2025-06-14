"use client"

import type { Booking } from "./bookings"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export const generateInvoicePDF = (booking: Booking) => {
  const doc = new jsPDF()

  // Add logo/header
  doc.setFillColor(46, 125, 50) // #2E7D32
  doc.rect(0, 0, 210, 40, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text("HUDUMA FASTER", 105, 20, { align: "center" })
  doc.setFontSize(12)
  doc.text("Professional Home Services", 105, 30, { align: "center" })

  // Invoice details
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.text("INVOICE", 20, 60)

  doc.setFontSize(10)
  doc.text(`Invoice #: ${booking.id}`, 20, 70)
  doc.text(`Date: ${new Date(booking.created_at).toLocaleDateString()}`, 20, 75)
  doc.text(`Due Date: ${new Date(booking.booking_date).toLocaleDateString()}`, 20, 80)

  // Customer details
  doc.setFontSize(12)
  doc.text("Bill To:", 140, 70)
  doc.setFontSize(10)
  doc.text(booking.customer_name, 140, 75)
  doc.text(booking.customer_email, 140, 80)
  doc.text(booking.customer_phone, 140, 85)
  doc.text(booking.address, 140, 90, { maxWidth: 50 })

  // Service details table
  autoTable(doc, {
    startY: 100,
    head: [["Service", "Date", "Time", "Amount"]],
    body: [
      [
        booking.service_name,
        new Date(booking.booking_date).toLocaleDateString(),
        booking.booking_time,
        `TSh ${booking.total_amount}`,
      ],
    ],
    foot: [
      ["", "", "Total", `TSh ${booking.total_amount}`],
    ],
    headStyles: {
      fillColor: [46, 125, 50],
      textColor: [255, 255, 255],
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
  })

  // Status
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(10)
  doc.text("Status:", 20, finalY)
  doc.text(booking.status, 60, finalY)

  // Footer
  doc.setFontSize(8)
  doc.text("Thank you for choosing Huduma Faster for your home service needs.", 105, 280, { align: "center" })
  doc.text("For any questions, please contact support@hudumafaster.co.tz or call +255 700 000 000", 105, 285, {
    align: "center",
  })

  // Save the PDF
  doc.save(`invoice-${booking.id}.pdf`)
}
