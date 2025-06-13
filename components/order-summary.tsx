"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart"
import { useLanguage } from "@/lib/language"

export function OrderSummary() {
  const { items, total } = useCart()
  const { t, language } = useLanguage()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#212121]">{t("checkout.orderSummary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={item.image_url || "/placeholder.svg?height=64&width=64"}
                  alt={language === "sw" ? item.name_sw : item.name_en}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                  {language === "sw" ? item.name_sw : item.name_en}
                </h4>
                <div className="text-sm text-gray-500 mt-1">
                  {t("common.currency")} {item.price.toLocaleString()} x {item.quantity}
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  {t("common.currency")} {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t("checkout.subtotal")}</span>
            <span>
              {t("common.currency")} {total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("checkout.serviceFee")}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {t("checkout.free")}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>{t("checkout.total")}</span>
          <span className="text-[#2E7D32]">
            {t("common.currency")} {total.toLocaleString()}
          </span>
        </div>

        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <p>{t("checkout.paymentNote")}</p>
        </div>
      </CardContent>
    </Card>
  )
}
