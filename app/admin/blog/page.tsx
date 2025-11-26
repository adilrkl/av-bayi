import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

async function getBlogPosts() {
    return await prisma.blogPost.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            author: {
                select: {
                    name: true,
                }
            }
        }
    })
}

export default async function BlogPage() {
    const posts = await getBlogPosts()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Blog Yazıları</h1>
                <Button asChild>
                    <Link href="/admin/blog/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Yazı Ekle
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Başlık</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Yazar</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tarih</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                        Henüz blog yazısı bulunmuyor.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{post.title}</td>
                                        <td className="p-4 align-middle">{post.author.name || "Admin"}</td>
                                        <td className="p-4 align-middle">
                                            {format(new Date(post.publishedAt), "d MMMM yyyy", { locale: tr })}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/blog/${post.id}`}>Düzenle</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
