import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CategoryList } from "@/components/admin/category-list"

async function getCategories() {
    const categories = await prisma.category.findMany({
        where: {
            parentId: null
        },
        include: {
            _count: {
                select: { products: true },
            },
            children: {
                include: {
                    _count: {
                        select: { products: true },
                    },
                    children: {
                        include: {
                            _count: {
                                select: { products: true },
                            },
                            children: true // Just in case, though we target 3 levels
                        }
                    }
                }
            }
        },
        orderBy: {
            name: "asc",
        },
    })
    return categories
}

export default async function AdminCategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Kategoriler</h1>
                <Link href="/admin/categories/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Kategori Ekle
                    </Button>
                </Link>
            </div>

            <CategoryList data={categories} />
        </div>
    )
}
