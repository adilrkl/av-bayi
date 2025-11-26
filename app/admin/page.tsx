import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"

async function getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders, lowStockProducts] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.product.count({
            where: {
                stock: {
                    lte: 10,
                },
            },
        }),
    ])

    // Calculate total sales
    const orders = await prisma.order.findMany({
        select: {
            totalAmount: true,
        },
    })

    const totalSales = orders.reduce((acc, order) => acc + Number(order.totalAmount), 0)

    return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSales,
        lowStockProducts,
    }
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Kontrol Paneli</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₺{stats.totalSales.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Geçen aya göre +20.1%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Siparişler</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Geçen aya göre +180.1%
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ürünler</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.lowStockProducts} düşük stok
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktif Kullanıcılar</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Geçen aya göre +19%
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Son Siparişler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Son siparişler burada görüntülenecek.
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Son Satışlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Son satışlar burada görüntülenecek.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
