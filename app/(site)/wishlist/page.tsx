"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useWishlistStore } from "@/store/wishlist-store"
import { ProductCard } from "@/components/product/product-card"
import { useEffect, useState } from "react"

export default function WishlistPage() {
    const { items } = useWishlistStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-heading font-bold mb-8">Favorilerim</h1>

            {items.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Heart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Favori listeniz boş</h2>
                    <p className="text-muted-foreground mb-8">Beğendiğiniz ürünleri favorilerinize ekleyerek daha sonra kolayca bulabilirsiniz.</p>
                    <Button asChild>
                        <Link href="/">Alışverişe Başla</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <ProductCard key={item.productId} product={{
                            id: item.productId,
                            name: item.name,
                            price: item.price,
                            discountPrice: item.discountPrice,
                            images: item.image ? JSON.stringify([item.image]) : '[]',
                            slug: item.slug,
                            stock: item.stock,
                            category: { name: 'Favori' } // Placeholder
                        }} />
                    ))}
                </div>
            )}
        </div>
    )
}
