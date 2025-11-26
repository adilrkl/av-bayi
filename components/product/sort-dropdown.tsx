"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SortDropdown() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentSort = searchParams.get('sort') || 'newest'

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', value)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sırala:</span>
            <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">En Yeniler</SelectItem>
                    <SelectItem value="price_asc">Fiyat (Artan)</SelectItem>
                    <SelectItem value="price_desc">Fiyat (Azalan)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
