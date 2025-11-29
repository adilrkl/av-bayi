"use client"

import Link from "next/link"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import { toast } from "sonner"
import { useState, useEffect } from "react"
interface ProductCardProps {
    product: any // Replace with proper type
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem, removeItem, isInWishlist } = useWishlistStore()
    const [isLiked, setIsLiked] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Parse images if string (SQLite workaround)
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
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                {mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.stock <= 0 && (
                        <Badge variant="destructive">Tükendi</Badge>
                    )}
                    {product.discountPrice && (
                        <Badge className="bg-secondary hover:bg-secondary">Indirim</Badge>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all translate-x-0 md:translate-x-2 md:group-hover:translate-x-0 duration-300">
                    <Button
                        size="icon"
                        variant={isLiked ? "default" : "secondary"}
                        className={cn("h-8 w-8 rounded-full shadow-sm", isLiked && "bg-red-500 hover:bg-red-600 text-white")}
                        onClick={toggleWishlist}
                    >
                        <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    {product.category?.name}
                </div>
                <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                    <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                        {product.discountPrice ? (
                            <>
                                <span className="text-xs text-muted-foreground line-through">
                                    {Number(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </span>
                                <span className="text-lg font-bold text-secondary">
                                    {Number(product.discountPrice).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-primary">
                                {Number(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                            </span>
                        )}
                    </div>

                    <Button
                        size="icon"
                        className="rounded-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                            useCartStore.getState().addItem({
                                productId: product.id,
                                name: product.name,
                                price: product.discountPrice ? Number(product.discountPrice) : Number(product.price),
                                image: mainImage,
                                quantity: 1
                            })
                            toast.success("Ürün sepete eklendi!")
                        }}
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
