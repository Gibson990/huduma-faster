import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

async function getCategories() {
  // In a real app, this would fetch from your database
  return [
    {
      id: 1,
      name: "Electronics",
      description: "Latest electronic gadgets",
      image_url: "/placeholder.svg?height=200&width=300",
    },
    { id: 2, name: "Clothing", description: "Fashion and apparel", image_url: "/placeholder.svg?height=200&width=300" },
    {
      id: 3,
      name: "Home & Garden",
      description: "Everything for your home",
      image_url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Books",
      description: "Books and educational materials",
      image_url: "/placeholder.svg?height=200&width=300",
    },
  ]
}

export async function CategoryGrid() {
  const categories = await getCategories()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`}>
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-0">
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                <img
                  src={category.image_url || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
