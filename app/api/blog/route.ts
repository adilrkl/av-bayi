import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { publishedAt: 'desc' },
        })

        return NextResponse.json({ success: true, data: posts })
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blog posts' },
            { status: 500 }
        )
    }
}
