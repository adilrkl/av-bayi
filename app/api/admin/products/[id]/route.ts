import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = productSchema.parse(json)

        const product = await prisma.product.update({
            where: {
                id: id,
            },
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
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 422 })
        }

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await prisma.product.delete({
            where: {
                id: id,
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
