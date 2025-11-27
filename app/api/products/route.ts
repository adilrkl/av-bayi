import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import * as z from "zod"

const productSchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    price: z.number(),
    discountPrice: z.number().nullable(),
    stock: z.number(),
    categoryId: z.string(),
    images: z.array(z.string()),
    youtubeUrl: z.string().optional().nullable(),
    features: z.string().optional().nullable(),
    brandId: z.string().optional().nullable(),
    isFeatured: z.boolean().optional().default(false),
})

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const categorySlug = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'newest'

    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {}

    if (search) {
        where.OR = [
            { name: { contains: search } },
            { description: { contains: search } },
        ]
    }

    if (categorySlug) {
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
            include: { children: true }
        })

        if (category) {
            const categoryIds = [category.id, ...category.children.map(c => c.id)]
            where.categoryId = { in: categoryIds }
        }
    }

    if (minPrice || maxPrice) {
        where.price = {}
        if (minPrice) where.price.gte = parseFloat(minPrice)
        if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = {}
    switch (sort) {
        case 'price_asc':
            orderBy = { price: 'asc' }
            break
        case 'price_desc':
            orderBy = { price: 'desc' }
            break
        case 'newest':
        default:
            orderBy = { createdAt: 'desc' }
            break
    }

    try {
        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: { category: true },
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            success: true,
            data: products,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = productSchema.parse(json)

        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                discountPrice: body.discountPrice,
                stock: body.stock,
                categoryId: body.categoryId,
                images: JSON.stringify(body.images),
                youtubeUrl: body.youtubeUrl,
                features: body.features,
                brandId: body.brandId,
                isFeatured: body.isFeatured,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error('Error creating product:', error)
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 422 })
        }

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
