import { prisma } from "@/lib/prisma"
import { ProductGrid } from "@/components/product/product-grid"
import { SortDropdown } from "@/components/product/sort-dropdown"
import { serializeProduct } from "@/lib/utils"
import { Search } from "lucide-react"

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedSearchParams = await searchParams
    const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : ''
    const page = Number(resolvedSearchParams.page) || 1
    const limit = 12
    const sort = resolvedSearchParams.sort as string || 'newest'

    if (!query) {
        return (
            <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex flex-col items-center justify-center">
                <Search className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Arama Yapın</h1>
                <p className="text-muted-foreground">Aradığınız ürün, kategori veya markayı yukarıdaki arama çubuğuna yazınız.</p>
            </div>
        )
    }

    // Build Filter
    const where: any = {
        OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { name: { contains: query, mode: 'insensitive' } } },
            { brand: { name: { contains: query, mode: 'insensitive' } } }
        ]
    }

    // Build Sort
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }

    // Fetch Products
    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
            include: { category: true, brand: true }
        }),
        prisma.product.count({ where })
    ])

    const serializedProducts = products.map(serializeProduct)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-sm text-muted-foreground mb-6">
                Anasayfa / Arama Sonuçları
            </div>

            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-heading font-bold">"{query}" için sonuçlar</h1>
                        <p className="text-muted-foreground mt-1">{total} ürün bulundu</p>
                    </div>
                    <SortDropdown />
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16 bg-muted/20 rounded-lg">
                        <p className="text-lg text-muted-foreground">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                    </div>
                ) : (
                    <>
                        <ProductGrid products={serializedProducts} />

                        {/* Pagination (Simplified) */}
                        <div className="mt-8 flex justify-center">
                            <span className="text-sm text-muted-foreground">
                                Toplam {total} ürün
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
