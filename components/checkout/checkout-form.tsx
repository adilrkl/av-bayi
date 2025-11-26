"use client"

import { useState, useEffect } from "react"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, MapPin, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface CheckoutFormProps {
    user: any
}

export function CheckoutForm({ user }: CheckoutFormProps) {
    const router = useRouter()
    const { items, subtotal, clearCart } = useCartStore()
    const [step, setStep] = useState(1) // 1: Address, 2: Payment
    const [addresses, setAddresses] = useState<any[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [isOrderPlacing, setIsOrderPlacing] = useState(false)
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "bank_transfer">("credit_card")
    const [newAddress, setNewAddress] = useState({
        title: "",
        addressLine: "",
        city: "",
        district: "",
        zipCode: "",
        phone: ""
    })

    // Fetch addresses
    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/user/addresses")
            const data = await res.json()
            if (data.success) {
                setAddresses(data.data)
                // If no address selected and addresses exist, select the first one
                if (!selectedAddressId && data.data.length > 0) {
                    setSelectedAddressId(data.data[0].id)
                }
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAddress)
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Adres başarıyla eklendi")
                setIsAddressModalOpen(false)
                setNewAddress({
                    title: "",
                    addressLine: "",
                    city: "",
                    district: "",
                    zipCode: "",
                    phone: ""
                })
                await fetchAddresses()
                setSelectedAddressId(data.data.id)
            } else {
                toast.error(data.error || "Adres eklenirken bir hata oluştu")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePlaceOrder = async () => {
        setIsOrderPlacing(true)
        try {
            const selectedAddress = addresses.find(a => a.id === selectedAddressId)

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    shippingAddress: selectedAddress,
                    billingAddress: selectedAddress,
                    totalAmount: subtotal(),
                    paymentStatus: paymentMethod === "credit_card" ? "PAID" : "PENDING"
                })
            })

            const data = await res.json()
            if (data.success) {
                clearCart()
                router.push(`/order-success?id=${data.data.id}`)
            } else {
                toast.error("Sipariş oluşturulurken bir hata oluştu.")
            }
        } catch (error) {
            console.error("Order failed", error)
            toast.error("Sipariş başarısız.")
        } finally {
            setIsOrderPlacing(false)
        }
    }

    if (items.length === 0) {
        return <div className="text-center py-12">Sepetiniz boş.</div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>1</div>
                        <span className="font-medium">Teslimat</span>
                    </div>
                    <div className="h-[2px] flex-1 mx-4 bg-muted">
                        <div className={`h-full bg-primary transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`} />
                    </div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>2</div>
                        <span className="font-medium">Ödeme</span>
                    </div>
                </div>

                {/* Step 1: Address */}
                {step === 1 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Teslimat Adresi Seçin</CardTitle>
                            <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Yeni Adres
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Yeni Adres Ekle</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddressSubmit} className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Adres Başlığı</Label>
                                            <Input
                                                id="title"
                                                value={newAddress.title}
                                                onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="addressLine">Adres</Label>
                                            <Input
                                                id="addressLine"
                                                value={newAddress.addressLine}
                                                onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">İl</Label>
                                                <Input
                                                    id="city"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="district">İlçe</Label>
                                                <Input
                                                    id="district"
                                                    value={newAddress.district}
                                                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="zipCode">Posta Kodu</Label>
                                                <Input
                                                    id="zipCode"
                                                    value={newAddress.zipCode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Telefon</Label>
                                                <Input
                                                    id="phone"
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Kaydediliyor..." : "Kaydet"}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {addresses.length > 0 ? (
                                <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className={`relative border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === address.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-300'}`}>
                                                <RadioGroupItem value={address.id} id={address.id} className="sr-only" />
                                                <Label htmlFor={address.id} className="cursor-pointer block h-full">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="font-bold flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-primary" />
                                                            {address.title}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground space-y-1">
                                                        <p>{address.addressLine}</p>
                                                        <p>{address.district} / {address.city}</p>
                                                        <p>{address.phone}</p>
                                                    </div>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            ) : (
                                <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                                    <p className="text-muted-foreground mb-4">Henüz kayıtlı adresiniz yok.</p>
                                    <Button variant="outline" onClick={() => setIsAddressModalOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Yeni Adres Ekle
                                    </Button>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <Button onClick={() => setStep(2)} disabled={!selectedAddressId}>
                                    Ödemeye Geç
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ödeme Yöntemi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as "credit_card" | "bank_transfer")} className="space-y-4 mb-6">
                                <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer ${paymentMethod === "credit_card" ? "border-primary bg-primary/5" : ""}`}>
                                    <RadioGroupItem value="credit_card" id="credit_card" />
                                    <Label htmlFor="credit_card" className="flex-1 cursor-pointer font-medium">Kredi Kartı ile Ödeme</Label>
                                </div>
                                <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer ${paymentMethod === "bank_transfer" ? "border-primary bg-primary/5" : ""}`}>
                                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                    <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer font-medium">Havale / EFT ile Ödeme</Label>
                                </div>
                            </RadioGroup>

                            {paymentMethod === "credit_card" && (
                                <div className="space-y-4 border-t pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Kart Numarası</Label>
                                            <Input placeholder="0000 0000 0000 0000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Kart Sahibi</Label>
                                            <Input placeholder="Ad Soyad" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Son Kullanma Tarihi</Label>
                                            <Input placeholder="AA/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CVV</Label>
                                            <Input placeholder="123" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "bank_transfer" && (
                                <div className="space-y-4 border-t pt-4">
                                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                                        <p className="font-semibold">Banka Hesap Bilgileri:</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            <div>
                                                <span className="text-muted-foreground">Banka:</span> <span className="font-medium">Ziraat Bankası</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Alıcı:</span> <span className="font-medium">Kale Av Malzemeleri Ltd. Şti.</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">IBAN:</span> <span className="font-medium font-mono">TR12 0001 0002 0003 0004 0005 06</span>
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                * Lütfen açıklama kısmına sipariş numaranızı yazmayı unutmayınız.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-between">
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Geri Dön
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Sipariş Özeti</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                            {items.map((item) => (
                                <div key={item.productId} className="flex justify-between">
                                    <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Toplam</span>
                                <span className="text-primary">{subtotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                            </div>
                        </div>

                        {step === 2 && (
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handlePlaceOrder}
                                disabled={isOrderPlacing || !selectedAddressId}
                            >
                                {isOrderPlacing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    "Siparişi Tamamla"
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
