import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import slugify from "slugify"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        // TODO: Check for admin role
        // if (!session || session.user.role !== "ADMIN") {
        //     return new NextResponse("Unauthorized", { status: 401 })
        // }

        const brands = await prisma.brand.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(brands)
    } catch (error) {
        console.error("[BRANDS_GET]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        // TODO: Check for admin role
        // if (!session || session.user.role !== "ADMIN") {
        //     return new NextResponse("Unauthorized", { status: 401 })
        // }

        const body = await req.json()
        const { name, image } = body

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        const slug = slugify(name, { lower: true, strict: true })

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                image,
            }
        })

        return NextResponse.json(brand)
    } catch (error) {
        console.error("[BRANDS_POST]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
