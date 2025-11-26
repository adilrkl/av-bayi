"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        addressLine: "",
        city: "",
        district: "",
        zipCode: "",
        phone: ""
    })

    const fetchAddresses = async () => {
        const res = await fetch("/api/user/addresses")
        const data = await res.json()
        if (data.success) {
            setAddresses(data.data)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setIsOpen(false)
                fetchAddresses()
                setFormData({ title: "", addressLine: "", city: "", district: "", zipCode: "", phone: "" })
            }
        } catch (error) {
            console.error("Failed to add address", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-heading font-bold">Adreslerim</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Yeni Adres Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Adres Ekle</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Adres Başlığı</Label>
                                <Input
                                    placeholder="Ev, İş vb."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Adres</Label>
                                <Input
                                    placeholder="Mahalle, Cadde, Sokak, No"
                                    value={formData.addressLine}
                                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>İl</Label>
                                    <Input
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>İlçe</Label>
                                    <Input
                                        value={formData.district}
                                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Posta Kodu</Label>
                                    <Input
                                        value={formData.zipCode}
                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telefon</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Kaydet</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <Card key={address.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                {address.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 h-16">
                                {address.addressLine}<br />
                                {address.district} / {address.city}<br />
                                {address.zipCode}
                            </p>
                            <div className="flex justify-end">
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4 mr-1" /> Sil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {addresses.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">Henüz kayıtlı adresiniz yok.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
