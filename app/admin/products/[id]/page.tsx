import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
    })
    return product
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

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const [product, categories, brands] = await Promise.all([
        getProduct(id),
        getCategories(),
        getBrands(),
    ])

    if (!product) {
        notFound()
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Ürün Düzenle</h1>
            <ProductForm
                categories={categories}
                brands={brands}
                initialData={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    price: product.price.toString(),
                    discountPrice: product.discountPrice?.toString() || "",
                    stock: product.stock.toString(),
                    categoryId: product.categoryId,
                    brandId: product.brandId || "",
                    images: JSON.parse(product.images as string).join(", "),
                    youtubeUrl: product.youtubeUrl || "",
                    features: product.features || "",
                    isFeatured: product.isFeatured,
                }}
            />
        </div>
    )
}
