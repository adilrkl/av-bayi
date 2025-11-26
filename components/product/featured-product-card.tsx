"use client"

import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useWishlistStore } from "@/store/wishlist-store"
import { useState, useEffect } from "react"

interface FeaturedProductCardProps {
    product: any
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
    const { addItem, removeItem, isInWishlist } = useWishlistStore()
    const [isLiked, setIsLiked] = useState(false)
    const [mounted, setMounted] = useState(false)

    let images = []
    try {
        images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
    } catch (e) {
        images = []
    }

    const mainImage = images && images.length > 0 ? images[0] : null

    useEffect(() => {
        setMounted(true)
        setIsLiked(isInWishlist(product.id))
    }, [isInWishlist, product.id])

    const toggleWishlist = () => {
        if (isLiked) {
            removeItem(product.id)
            setIsLiked(false)
        } else {
            addItem({
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                image: mainImage,
                slug: product.slug,
                discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
                stock: product.stock
            })
            setIsLiked(true)
        }
    }

    return (
        <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                {mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.stock <= 0 && (
                        <Badge variant="destructive" className="text-xs py-0.5">Tükendi</Badge>
                    )}
                    {product.discountPrice && (
                        <Badge className="bg-secondary hover:bg-secondary text-xs py-0.5">İndirim</Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant={isLiked ? "default" : "secondary"}
                        className={cn("h-7 w-7 rounded-full shadow-sm", isLiked && "bg-red-500 hover:bg-red-600 text-white")}
                        onClick={toggleWishlist}
                    >
                        <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                    {product.category?.name}
                </div>
                <h3 className="font-heading font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                    <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                        {product.discountPrice ? (
                            <>
                                <span className="text-[10px] text-muted-foreground line-through">
                                    {Number(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </span>
                                <span className="text-base font-bold text-secondary">
                                    {Number(product.discountPrice).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-bold text-primary">
                                {Number(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                            </span>
                        )}
                    </div>

                    <Button size="icon" className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90">
                        <ShoppingCart className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
