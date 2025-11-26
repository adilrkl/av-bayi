import { CategoryForm } from "@/components/admin/category-form"

export default function NewCategoryPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Yeni Kategori Ekle</h1>
            <div className="rounded-md border bg-card p-6">
                <CategoryForm />
            </div>
        </div>
    )
}
