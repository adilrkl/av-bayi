import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function BlogPage() {
    const posts = await prisma.blogPost.findMany({
        orderBy: {
            publishedAt: 'desc'
        },
        include: {
            author: true
        }
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-heading font-bold mb-8">Blog</h1>
            {posts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    Henüz blog yazısı bulunmuyor.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <Card key={post.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="line-clamp-2">
                                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="flex items-center mt-2">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground line-clamp-3">
                                    {post.excerpt || post.content.substring(0, 150) + "..."}
                                </p>
                                <Link href={`/blog/${post.slug}`} className="text-primary hover:underline mt-4 inline-block text-sm font-medium">
                                    Devamını Oku
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
