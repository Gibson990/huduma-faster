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
  doc.text(`Date: ${booking.createdAt.toLocaleDateString()}`, 20, 75)
  doc.text(`Due Date: ${booking.scheduledDate.toLocaleDateString()}`, 20, 80)

  // Customer details
  doc.setFontSize(12)
  doc.text("Bill To:", 140, 70)
  doc.setFontSize(10)
  doc.text(booking.customerName, 140, 75)
  doc.text(booking.customerEmail, 140, 80)
  doc.text(booking.customerPhone, 140, 85)
  doc.text(booking.serviceAddress, 140, 90, { maxWidth: 50 })

  // Service details table
  autoTable(doc, {
    startY: 100,
    head: [["Service", "Provider", "Quantity", "Price", "Total"]],
    body: [
      [
        booking.serviceName,
        booking.providerName,
        booking.quantity.toString(),
        `TSh ${booking.servicePrice / booking.quantity}`,
        `TSh ${booking.servicePrice}`,
      ],
    ],
    foot: [
      ["", "", "", "Subtotal", `TSh ${booking.servicePrice}`],
      ["", "", "", "Service Fee", "Free"],
      ["", "", "", "Total", `TSh ${booking.servicePrice}`],
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

  // Payment details
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(10)
  doc.text("Payment Method:", 20, finalY)
  doc.text(booking.paymentMethod === "cash" ? "Cash on service completion" : "Mobile Money", 60, finalY)

  doc.text("Payment Status:", 20, finalY + 5)
  doc.text(booking.paymentStatus, 60, finalY + 5)

  // Notes
  if (booking.notes) {
    doc.text("Notes:", 20, finalY + 15)
    doc.text(booking.notes, 20, finalY + 20, { maxWidth: 170 })
  }

  // Footer
  doc.setFontSize(8)
  doc.text("Thank you for choosing Huduma Faster for your home service needs.", 105, 280, { align: "center" })
  doc.text("For any questions, please contact support@hudumafaster.co.tz or call +255 700 000 000", 105, 285, {
    align: "center",
  })

  // Save the PDF
  doc.save(`invoice-${booking.id}.pdf`)
}
