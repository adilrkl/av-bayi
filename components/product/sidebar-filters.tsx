"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface SidebarFiltersProps {
    category: any
    brands?: any[]
    minPrice?: number
    maxPrice?: number
}

export function SidebarFilters({ category, brands = [], minPrice, maxPrice }: SidebarFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [priceRange, setPriceRange] = useState([minPrice || 0, maxPrice || 50000])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])

    // Update local state when URL params change
    useEffect(() => {
        setPriceRange([
            Number(searchParams.get('minPrice')) || 0,
            Number(searchParams.get('maxPrice')) || 50000
        ])

        const brandParam = searchParams.get('brands')
        if (brandParam) {
            setSelectedBrands(brandParam.split(','))
        } else {
            setSelectedBrands([])
        }
    }, [searchParams])

    const handlePriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('minPrice', priceRange[0].toString())
        params.set('maxPrice', priceRange[1].toString())
        router.push(`?${params.toString()}`)
    }

    const handleBrandToggle = (brandId: string) => {
        const newBrands = selectedBrands.includes(brandId)
            ? selectedBrands.filter(id => id !== brandId)
            : [...selectedBrands, brandId]

        setSelectedBrands(newBrands)

        const params = new URLSearchParams(searchParams.toString())
        if (newBrands.length > 0) {
            params.set('brands', newBrands.join(','))
        } else {
            params.delete('brands')
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="space-y-8">
            {/* Categories Accordion */}
            <div>
                <h3 className="font-bold mb-4">Kategoriler</h3>
                <Accordion type="single" collapsible className="w-full" defaultValue="categories">
                    <AccordionItem value="categories">
                        <AccordionTrigger className="py-2">Alt Kategoriler</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-2 pt-2">
                                {category.children && category.children.length > 0 ? (
                                    category.children.map((child: any) => (
                                        <li key={child.id}>
                                            <Link
                                                href={`/category/${child.slug}`}
                                                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <ChevronRight className="h-4 w-4 mr-1" />
                                                {child.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-muted-foreground">Alt kategori bulunamadı.</li>
                                )}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
                <div>
                    <h3 className="font-bold mb-4">Markalar</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {brands.map((brand) => (
                            <div key={brand.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`brand-${brand.id}`}
                                    checked={selectedBrands.includes(brand.id)}
                                    onChange={() => handleBrandToggle(brand.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label
                                    htmlFor={`brand-${brand.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {brand.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Filter */}
            <div>
                <h3 className="font-bold mb-4">Fiyat Aralığı</h3>
                <div className="space-y-4">
                    <Slider
                        defaultValue={[0, 50000]}
                        value={priceRange}
                        max={50000}
                        step={100}
                        onValueChange={setPriceRange}
                        className="my-4"
                    />
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className="h-8 text-xs"
                        />
                        <span>-</span>
                        <Input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="h-8 text-xs"
                        />
                    </div>
                    <Button onClick={handlePriceFilter} className="w-full h-8 text-xs">
                        Filtrele
                    </Button>
                </div>
            </div>
        </div>
    )
}
