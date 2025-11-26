import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Calendar, User } from "lucide-react"

interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params

    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: true }
    })

    if (!post) {
        notFound()
    }

    return (
        <article className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{post.title}</h1>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author.name}
                    </div>
                </div>
            </div>

            <div className="aspect-video bg-muted rounded-lg mb-8 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-200">
                    Görsel
                </div>
            </div>

            <div className="prose prose-lg max-w-none">
                {/* Simple rendering for now, ideally use a markdown renderer */}
                {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                ))}
            </div>
        </article>
    )
}
