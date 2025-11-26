import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product/product-card"
import { serializeProduct } from "@/lib/utils"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Tüm Ürünler | Kale Av",
    description: "En yeni ve en kaliteli avcılık ürünlerini keşfedin.",
}

export const revalidate = 60

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    })

    const serializedProducts = products.map(serializeProduct)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-heading font-bold mb-8">Tüm Ürünler</h1>

            {products.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    Henüz ürün bulunmuyor.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {serializedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
