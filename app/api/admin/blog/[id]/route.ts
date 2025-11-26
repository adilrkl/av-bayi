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

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const post = await prisma.blogPost.findUnique({
            where: {
                id: id,
            },
        })

        if (!post) {
            return new NextResponse("Blog post not found", { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error('[BLOG_GET_SINGLE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { id } = await params

        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = blogPostSchema.parse(json)

        const post = await prisma.blogPost.update({
            where: {
                id: id,
            },
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.excerpt,
                thumbnail: body.thumbnail,
                publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 422 })
        }
        console.error('[BLOG_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { id } = await params

        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const post = await prisma.blogPost.delete({
            where: {
                id: id,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error('[BLOG_DELETE]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
