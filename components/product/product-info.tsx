"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { toast } from "sonner"

interface ProductInfoProps {
    product: any
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1)
    const [isLiked, setIsLiked] = useState(false)
    const addItem = useCartStore((state) => state.addItem)
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

    useEffect(() => {
        setIsLiked(isInWishlist(product.id))
    }, [product.id, isInWishlist])

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'dec' && quantity > 1) {
            setQuantity(quantity - 1)
        } else if (type === 'inc' && quantity < product.stock) {
            setQuantity(quantity + 1)
        }
    }

    const handleAddToCart = () => {
        let images = []
        try {
            images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
        } catch (e) {
            images = []
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.discountPrice ? Number(product.discountPrice) : Number(product.price),
            image: images[0],
            quantity: quantity
        })

        toast.success("Ürün sepete eklendi!")
    }

    const toggleWishlist = () => {
        let images = []
        try {
            images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
        } catch (e) {
            images = []
        }

        if (isLiked) {
            removeFromWishlist(product.id)
            setIsLiked(false)
            toast.success("Favorilerden çıkarıldı")
        } else {
            addToWishlist({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
                image: images[0] || '/placeholder.jpg',
                stock: product.stock,
            })
            setIsLiked(true)

        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Stok Kodu: {product.id.substring(0, 8).toUpperCase()}</span>
                    {product.stock > 0 ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">Stokta Var</Badge>
                    ) : (
                        <Badge variant="destructive">Tükendi</Badge>
                    )}
                </div>
            </div>

            <div className="flex items-baseline gap-4">
                {product.discountPrice ? (
                    <>
                        <span className="text-3xl font-bold text-secondary">
                            {Number(product.discountPrice).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                        <span className="text-xl text-muted-foreground line-through">
                            {Number(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                    </>
                ) : (
                    <span className="text-3xl font-bold text-primary">
                        {Number(product.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                )}
            </div>

            <div className="h-px bg-border my-2" />

            {/* Description */}
            <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="h-px bg-border my-2" />

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border rounded-md w-max">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange('dec')}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange('inc')}
                        disabled={quantity >= product.stock}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <Button
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-lg"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Sepete Ekle
                </Button>

                <Button
                    size="icon"
                    variant="outline"
                    className="h-12 w-12"
                    onClick={toggleWishlist}
                >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                {product.brand && (
                    <div className="flex justify-between">
                        <span>Marka:</span>
                        <span className="font-medium">{product.brand.name}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Kategori:</span>
                    <span className="font-medium">{product.category.name}</span>
                </div>
                <div className="flex justify-between">
                    <span>Kargo:</span>
                    <span className="font-medium">Ücretsiz (500 TL üzeri)</span>
                </div>
            </div>
        </div>
    )
}
