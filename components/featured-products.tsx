import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"

async function getFeaturedProducts() {
  // In a real app, this would fetch from your database
  return [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image_url: "/placeholder.svg?height=300&width=300",
      rating: 4.5,
    },
    { id: 2, name: "Smart Watch", price: 199.99, image_url: "/placeholder.svg?height=300&width=300", rating: 4.8 },
    { id: 3, name: "Cotton T-Shirt", price: 24.99, image_url: "/placeholder.svg?height=300&width=300", rating: 4.3 },
    { id: 4, name: "Coffee Maker", price: 79.99, image_url: "/placeholder.svg?height=300&width=300", rating: 4.6 },
  ]
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden rounded-t-lg relative">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 left-3 bg-green-600">Featured</Badge>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">${product.price}</div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full">
              <Link href={`/products/${product.id}`}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
