import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface OrderSuccessPageProps {
    searchParams: Promise<{ id: string }>
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
    const { id } = await searchParams

    const order = await prisma.order.findUnique({
        where: { id }
    })

    if (!order) {
        return notFound()
    }

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[60vh]">
            <div className="bg-green-100 p-6 rounded-full mb-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-4">Siparişiniz Alındı!</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                Siparişiniz başarıyla oluşturuldu. Sipariş numaranız: <span className="font-bold text-foreground">{id}</span>.
                Detayları e-posta adresinize gönderdik.
            </p>

            {order.paymentStatus === 'PENDING' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-lg w-full mb-8 text-left">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-orange-900">Ödeme Bekleniyor</h3>
                            <p className="text-sm text-orange-800 mt-1">
                                Siparişinizin onaylanması için lütfen aşağıdaki banka hesabına havale/EFT işlemini gerçekleştiriniz.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded border border-orange-100 space-y-2 text-sm">
                        <p className="font-semibold text-gray-900">Banka Hesap Bilgileri:</p>
                        <div className="grid grid-cols-1 gap-2 text-gray-700">
                            <div>
                                <span className="text-gray-500">Banka:</span> <span className="font-medium">Ziraat Bankası</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Alıcı:</span> <span className="font-medium">Kale Av Malzemeleri Ltd. Şti.</span>
                            </div>
                            <div>
                                <span className="text-gray-500">IBAN:</span> <span className="font-medium font-mono">TR12 0001 0002 0003 0004 0005 06</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                * Lütfen açıklama kısmına <strong>{id}</strong> nolu sipariş numaranızı yazmayı unutmayınız.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/">Anasayfaya Dön</Link>
                </Button>
                <Button asChild>
                    <Link href="/profile/orders">Siparişlerimi Gör</Link>
                </Button>
            </div>
        </div>
    )
}
