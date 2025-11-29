import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import { serializeProduct } from "@/lib/utils"

export async function CategoryShowcase() {
    // 1. Fetch top categories with their children
    const categories = await prisma.category.findMany({
        where: { parentId: null },
        take: 4,
        orderBy: { name: 'asc' },
        include: {
            children: {
                include: {
                    children: true
                }
            }
        }
    })

    // 2. Fetch products for each category (including sub-categories)
    const categoriesWithProducts = await Promise.all(categories.map(async (category) => {
        // Collect all IDs
        const categoryIds = [category.id]

        if (category.children) {
            category.children.forEach(child => {
                categoryIds.push(child.id)
                if (child.children) {
                    child.children.forEach(grandChild => {
                        categoryIds.push(grandChild.id)
                    })
                }
            })
        }

        // Fetch products
        const products = await prisma.product.findMany({
            where: {
                categoryId: { in: categoryIds }
            },
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: { category: true, brand: true }
        })

        return {
            ...category,
            products
        }
    }))

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 space-y-16">
                <h2 className="text-3xl font-heading font-bold text-center mb-10 uppercase tracking-tight">
                    Kategorileri <span className="text-secondary">Keşfet</span>
                </h2>

                {categoriesWithProducts.map((category) => (
                    <div key={category.id} className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h3 className="text-2xl font-bold">{category.name}</h3>
                            <Link
                                href={`/category/${category.slug}`}
                                className="text-primary hover:text-secondary transition-colors flex items-center text-sm font-medium"
                            >
                                Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {category.products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {category.products.map((product) => (
                                    <ProductCard key={product.id} product={serializeProduct(product)} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground bg-background rounded-lg border border-dashed">
                                Bu kategoride henüz ürün bulunmuyor.
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
