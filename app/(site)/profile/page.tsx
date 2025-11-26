"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, MapPin, Trash2, User } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { redirect } from "next/navigation"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const [addresses, setAddresses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [newAddress, setNewAddress] = useState({
        title: "",
        addressLine: "",
        city: "",
        district: "",
        zipCode: "",
        phone: ""
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/login")
        }
        if (status === "authenticated") {
            fetchAddresses()
        }
    }, [status])

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/user/addresses")
            const data = await res.json()
            if (data.success) {
                setAddresses(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error)
        }
    }

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
                fetchAddresses()
            } else {
                toast.error(data.error || "Adres eklenirken bir hata oluştu")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return

        try {
            const res = await fetch(`/api/user/addresses?id=${id}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Adres silindi")
                fetchAddresses()
            } else {
                toast.error("Adres silinirken bir hata oluştu")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        }
    }

    if (status === "loading") {
        return <div className="container mx-auto px-4 py-16 flex justify-center"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-heading font-bold mb-8">Hesabım</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Kişisel Bilgiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-muted-foreground">Ad Soyad</Label>
                            <div className="font-medium">{session?.user?.name || "-"}</div>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">E-posta</Label>
                            <div className="font-medium">{session?.user?.email}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Addresses */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Adreslerim
                        </CardTitle>
                        <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
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
                                        <Label htmlFor="title">Adres Başlığı (Ev, İş vb.)</Label>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((address) => (
                                    <div key={address.id} className="border rounded-lg p-4 relative group">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="font-bold flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                {address.title}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                onClick={() => handleDeleteAddress(address.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>{address.addressLine}</p>
                                            <p>{address.district} / {address.city}</p>
                                            <p>{address.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-muted-foreground mb-4">Henüz kayıtlı adresiniz yok.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
