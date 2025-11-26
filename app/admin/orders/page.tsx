import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

async function getOrders() {
    const orders = await prisma.order.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: { items: true },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })
    return orders
}

export default async function AdminOrdersPage() {
    const orders = await getOrders()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Siparişler</h1>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sipariş ID</TableHead>
                            <TableHead>Müşteri</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Toplam</TableHead>
                            <TableHead>Ürünler</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead className="text-right">Aksiyon</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{order.user.name || "N/A"}</span>
                                        <span className="text-xs text-muted-foreground">{order.user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>${Number(order.totalAmount).toFixed(2)}</TableCell>
                                <TableCell>{order._count.items}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/orders/${order.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
