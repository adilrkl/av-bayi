import { prisma } from "@/lib/prisma"
import { FeaturedProductCard } from "@/components/product/featured-product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { serializeProduct } from "@/lib/utils"

export async function FeaturedProducts() {
    const newArrivals = await prisma.product.findMany({
        take: 6,
        orderBy: { updatedAt: 'desc' },
        where: { isFeatured: true },
        include: { category: true }
    })

    const serializedProducts = newArrivals.map(serializeProduct)

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-heading font-bold uppercase tracking-tight mb-2">
                            Öne Çıkan <span className="text-secondary">Ürünler</span>
                        </h2>
                        <p className="text-muted-foreground">En yeni ve en çok tercih edilen ürünlerimiz.</p>
                    </div>
                    <Button variant="outline" asChild className="hidden md:inline-flex">
                        <Link href="/featured-products">Tümünü Gör</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {serializedProducts.map((product) => (
                        <FeaturedProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" asChild>
                        <Link href="/featured-products">Tümünü Gör</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
