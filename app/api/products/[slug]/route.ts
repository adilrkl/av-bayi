import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params

    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                reviews: true,
            },
        })

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Ürün bulunamadı' },
                { status: 404 }
            )
        }

        // Fetch related products (same category, exclude current)
        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
            },
            take: 4,
        })

        return NextResponse.json({
            success: true,
            data: {
                ...product,
                relatedProducts,
            },
        })
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}
