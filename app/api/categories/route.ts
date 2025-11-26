import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                children: {
                    include: {
                        children: true, // Support 2 levels of nesting for now
                    },
                },
            },
            where: {
                parentId: null, // Only fetch root categories
            },
        })

        return NextResponse.json({ success: true, data: categories })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
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

        // Basic validation
        if (!json.name || !json.slug) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const category = await prisma.category.create({
            data: {
                name: json.name,
                slug: json.slug,
                image: json.image,
                parentId: json.parentId || null,
            },
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error('Error creating category:', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
