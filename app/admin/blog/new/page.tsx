import { BlogForm } from "@/components/admin/blog-form"

export default function NewBlogPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Yeni Blog Yazısı Ekle</h1>
            <div className="rounded-md border bg-card p-6">
                <BlogForm />
            </div>
        </div>
    )
}
