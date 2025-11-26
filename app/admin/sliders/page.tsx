import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SlidersPage() {
    const sliders = await prisma.slider.findMany({
        orderBy: {
            order: 'asc'
        }
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Slaytlar</h1>
                <Link href="/admin/sliders/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Slayt
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tüm Slaytlar</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sıra</TableHead>
                                <TableHead>Başlık</TableHead>
                                <TableHead>Alt Başlık</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sliders.map((slider) => (
                                <TableRow key={slider.id}>
                                    <TableCell>{slider.order}</TableCell>
                                    <TableCell>{slider.title}</TableCell>
                                    <TableCell>{slider.subtitle || '-'}</TableCell>
                                    <TableCell>
                                        {slider.isActive ? (
                                            <span className="text-green-600">Aktif</span>
                                        ) : (
                                            <span className="text-gray-500">Pasif</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/sliders/${slider.id}`}>
                                            <Button variant="outline" size="sm">
                                                Düzenle
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
