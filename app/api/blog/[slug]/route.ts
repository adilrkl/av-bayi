import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params

    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug },
        })

        if (!post) {
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: post })
    } catch (error) {
        console.error('Error fetching blog post:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blog post' },
            { status: 500 }
        )
    }
}
