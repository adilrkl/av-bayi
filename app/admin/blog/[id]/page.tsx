import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BlogForm } from "@/components/admin/blog-form"

async function getBlogPost(id: string) {
    const post = await prisma.blogPost.findUnique({
        where: { id },
    })
    return post
}

export default async function EditBlogPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const post = await getBlogPost(id)

    if (!post) {
        notFound()
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Blog Yazısını Düzenle</h1>
            <div className="rounded-md border bg-card p-6">
                <BlogForm
                    initialData={{
                        id: post.id,
                        title: post.title,
                        slug: post.slug,
                        content: post.content,
                        excerpt: post.excerpt || "",
                        thumbnail: post.thumbnail || "",
                        publishedAt: post.publishedAt.toISOString().split('T')[0],
                    }}
                />
            </div>
        </div>
    )
}
