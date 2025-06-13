"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center justify-between p-4 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out translate-y-0 opacity-100
            ${toast.variant === "success" ? "bg-green-50 border-l-4 border-green-500" : ""}
            ${toast.variant === "destructive" ? "bg-red-50 border-l-4 border-red-500" : ""}
            ${toast.variant === "default" ? "bg-white border-l-4 border-gray-300" : ""}
          `}
        >
          <div className="flex items-center space-x-3">
            {toast.variant === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {toast.variant === "destructive" && <AlertCircle className="h-5 w-5 text-red-500" />}
            <div>
              <h4 className="font-medium text-gray-900">{toast.title}</h4>
              {toast.description && <p className="text-sm text-gray-600">{toast.description}</p>}
            </div>
          </div>
          <button onClick={() => dismiss(toast.id)} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
