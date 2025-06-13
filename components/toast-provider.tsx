"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

export function ToastProvider() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-center justify-between max-w-md animate-in slide-in-from-right ${
            toast.variant === "destructive"
              ? "bg-red-100 text-red-800 border-l-4 border-red-500"
              : toast.variant === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-white text-gray-800 border-l-4 border-blue-500"
          }`}
        >
          <div>
            {toast.title && <h4 className="font-medium">{toast.title}</h4>}
            {toast.description && <p className="text-sm">{toast.description}</p>}
          </div>
          <button onClick={() => dismiss(toast.id)} className="ml-4">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
