import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import * as z from "zod"

const blogPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional(),
    thumbnail: z.string().optional(),
    publishedAt: z.string().optional(),
})

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const posts = await prisma.blogPost.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error('[BLOG_GET]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = blogPostSchema.parse(json)

        const post = await prisma.blogPost.create({
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.excerpt,
                thumbnail: body.thumbnail,
                publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
                authorId: session.user.id,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 422 })
        }
        console.error('[BLOG_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
