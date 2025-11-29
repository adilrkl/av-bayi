"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit, Trash, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
    id: string
    name: string
    slug: string
    _count: {
        products: number
    }
    children?: Category[]
}

interface CategoryListProps {
    data: Category[]
}

export function CategoryList({ data }: CategoryListProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[400px]">Kategori Adı</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Ürün Sayısı</TableHead>
                        <TableHead className="text-right">Aksiyonlar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((category) => (
                        <CategoryRow key={category.id} category={category} level={0} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

interface CategoryRowProps {
    category: Category
    level: number
}

function CategoryRow({ category, level }: CategoryRowProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const hasChildren = category.children && category.children.length > 0

    return (
        <>
            <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium">
                    <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${level * 24}px` }}
                    >
                        {hasChildren ? (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 hover:bg-muted rounded-sm transition-colors"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                            </button>
                        ) : (
                            <div className="w-6" /> // Spacer for alignment
                        )}
                        {category.name}
                    </div>
                </TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category._count.products}</TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Link href={`/admin/categories/${category.id}`}>
                            <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            {isExpanded && hasChildren && category.children?.map((child) => (
                <CategoryRow key={child.id} category={child} level={level + 1} />
            ))}
        </>
    )
}
