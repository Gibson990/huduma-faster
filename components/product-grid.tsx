import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"

async function getAllProducts() {
  // In a real app, this would fetch from your database
  return [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image_url: "/placeholder.svg?height=300&width=300",
      category: "Electronics",
      stock: 50,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      image_url: "/placeholder.svg?height=300&width=300",
      category: "Electronics",
      stock: 30,
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      price: 24.99,
      image_url: "/placeholder.svg?height=300&width=300",
      category: "Clothing",
      stock: 100,
    },
    {
      id: 4,
      name: "Denim Jeans",
      price: 59.99,
      image_url: "/placeholder.svg?height=300&width=300",
      category: "Clothing",
      stock: 75,
    },
    {
      id: 5,
      name: "Coffee Maker",
      price: 79.99,
      image_url: "/placeholder.svg?height=300&width=300",
      category: "Home & Garden",
      stock: 25,
    },
    {
      id: 6,
      name: "Plant Pot Set",
      price: 34.99,
      image_url: "/placeholder.svg?height=300&width=300",
      category: "Home & Garden",
      stock: 40,
    },
  ]
}

export async function ProductGrid() {
  const products = await getAllProducts()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden rounded-t-lg relative">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.stock < 10 && (
                <Badge variant="destructive" className="absolute top-3 left-3">
                  Low Stock
                </Badge>
              )}
            </div>
            <div className="p-4">
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm text-gray-600">(4.2)</span>
              </div>
              <div className="text-2xl font-bold text-green-600">${product.price}</div>
              <div className="text-sm text-gray-500 mt-1">{product.stock} in stock</div>
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
