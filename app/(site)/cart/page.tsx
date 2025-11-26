"use client"

import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function CartPage() {
    const { items, updateQuantity, removeItem, subtotal } = useCartStore()

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-heading font-bold mb-4">Sepetiniz Boş</h1>
                <p className="text-muted-foreground mb-8">Sepetinizde henüz ürün bulunmamaktadır.</p>
                <Button asChild size="lg">
                    <Link href="/">Alışverişe Başla</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-heading font-bold mb-8">Sepetim ({items.length} Ürün)</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-1 space-y-4">
                    {items.map((item) => (
                        <div key={item.productId} className="flex gap-4 p-4 border rounded-lg bg-card">
                            {/* Image */}
                            <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold line-clamp-2">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">Adet Fiyatı: {item.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                        onClick={() => removeItem(item.productId)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex items-center border rounded-md">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="font-bold text-lg">
                                        {(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-muted/30 p-6 rounded-lg border sticky top-24">
                        <h2 className="font-heading font-bold text-xl mb-4">Sipariş Özeti</h2>

                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Ara Toplam</span>
                                <span>{subtotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kargo</span>
                                <span className="text-green-600 font-medium">Ücretsiz</span>
                            </div>
                        </div>

                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-lg">Toplam</span>
                                <span className="font-bold text-2xl text-primary">
                                    {subtotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </span>
                            </div>
                        </div>

                        <Button className="w-full" size="lg" asChild>
                            <Link href="/checkout">
                                Ödemeye Geç <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
