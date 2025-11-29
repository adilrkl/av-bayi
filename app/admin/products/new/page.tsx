import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

async function getCategories() {
    return await prisma.category.findMany({
        where: {
            parentId: null
        },
        include: {
            children: {
                include: {
                    children: true
                }
            }
        },
        orderBy: { name: 'asc' }
    })
}

async function getBrands() {
    return await prisma.brand.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: { name: 'asc' }
    })
}

export default async function NewProductPage() {
    const [categories, brands] = await Promise.all([
        getCategories(),
        getBrands(),
    ])

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Yeni Ürün Ekle</h1>
            <div className="rounded-md border bg-card p-6">
                <ProductForm categories={categories} brands={brands} />
            </div>
        </div>
    )
}
