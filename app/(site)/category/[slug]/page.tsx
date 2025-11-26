import { prisma } from "@/lib/prisma"
import { ProductGrid } from "@/components/product/product-grid"
import { SidebarFilters } from "@/components/product/sidebar-filters"
import { SortDropdown } from "@/components/product/sort-dropdown"
import { notFound } from "next/navigation"
import { serializeProduct } from "@/lib/utils"

interface CategoryPageProps {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params
    const resolvedSearchParams = await searchParams
    const page = Number(resolvedSearchParams.page) || 1
    const limit = 12
    const sort = resolvedSearchParams.sort as string || 'newest'
    const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined
    const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined

    // Fetch Category
    const category = await prisma.category.findUnique({
        where: { slug },
        include: { children: true }
    })

    if (!category) {
        notFound()
    }

    const brandsParam = resolvedSearchParams.brands as string
    const brandIds = brandsParam ? brandsParam.split(',') : []

    // Build Filter
    const where: any = {
        categoryId: category.id // TODO: Handle recursive children categories
    }

    // If category has children, include them in filter
    if (category.children.length > 0) {
        const childIds = category.children.map(c => c.id)
        where.categoryId = { in: [category.id, ...childIds] }
    }

    if (minPrice || maxPrice) {
        where.price = {}
        if (minPrice) where.price.gte = minPrice
        if (maxPrice) where.price.lte = maxPrice
    }

    if (brandIds.length > 0) {
        where.brandId = { in: brandIds }
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
            include: { category: true }
        }),
        prisma.product.count({ where })
    ])

    const serializedProducts = products.map(serializeProduct)

    // Fetch Brands for this category
    const brands = await prisma.brand.findMany({
        where: {
            products: {
                some: {
                    categoryId: { in: [category.id, ...category.children.map(c => c.id)] }
                }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb (Simplified) */}
            <div className="text-sm text-muted-foreground mb-6">
                Anasayfa / {category.name}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <SidebarFilters
                        category={category}
                        brands={brands}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-heading font-bold">{category.name}</h1>
                        <SortDropdown />
                    </div>

                    <ProductGrid products={serializedProducts} />

                    {/* Pagination (Simplified) */}
                    <div className="mt-8 flex justify-center">
                        {/* Pagination Controls would go here */}
                        <span className="text-sm text-muted-foreground">
                            Toplam {total} ürün
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
