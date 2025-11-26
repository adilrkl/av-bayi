import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/admin/category-form"

async function getCategory(id: string) {
    const category = await prisma.category.findUnique({
        where: { id },
    })
    return category
}

export default async function EditCategoryPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const category = await getCategory(id)

    if (!category) {
        notFound()
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Kategori Düzenle</h1>
            <CategoryForm
                initialData={{
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    image: category.image || "",
                }}
            />
        </div>
    )
}
