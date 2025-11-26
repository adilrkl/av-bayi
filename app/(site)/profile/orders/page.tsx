"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders")
                const data = await res.json()
                if (data.success) {
                    setOrders(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch orders", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (isLoading) {
        return <div>Yükleniyor...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-heading font-bold">Siparişlerim</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="pb-2 border-b bg-muted/20">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Sipariş No</span>
                                    <span className="font-bold text-sm">#{order.id.substring(0, 8)}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-xs text-muted-foreground">Tarih</span>
                                    <span className="font-medium text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                                        {order.status === 'PENDING' && 'Beklemede'}
                                        {order.status === 'PROCESSING' && 'İşleme Alındı'}
                                        {order.status === 'SHIPPED' && 'Kargoda'}
                                        {order.status === 'DELIVERED' && 'Teslim Edildi'}
                                        {order.status === 'CANCELLED' && 'İptal Edildi'}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {order.items.length} Ürün
                                    </span>
                                </div>
                                <span className="font-bold text-lg text-primary">
                                    {Number(order.totalAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 text-sm">
                                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                            <Package className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{item.product.name}</div>
                                            <div className="text-muted-foreground">x{item.quantity}</div>
                                        </div>
                                        <div>
                                            {Number(item.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">Henüz siparişiniz bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
