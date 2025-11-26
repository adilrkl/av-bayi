"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner" // Assuming sonner is used, or use another toast lib

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        siteName: "",
        facebookUrl: "",
        instagramUrl: "",
        twitterUrl: "",
        tiktokUrl: "",
        contactEmail: "",
        contactPhone: "",
        contactAddress: "",
        announcementText: "",
        homepageBenefits: [
            { title: "Ücretsiz Kargo", description: "500 TL ve üzeri alışverişlerde kargo bedava." },
            { title: "Güvenli Ödeme", description: "256-bit SSL sertifikası ile %100 güvenli ödeme." },
            { title: "7/24 Destek", description: "Uzman ekibimizle her zaman yanınızdayız." },
            { title: "Kolay İade", description: "14 gün içinde koşulsuz iade garantisi." }
        ]
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings")
            if (res.ok) {
                const data = await res.json()
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    homepageBenefits: data.homepageBenefits
                        ? JSON.parse(data.homepageBenefits)
                        : prev.homepageBenefits
                }))
            }
        } catch (error) {
            console.error("Failed to fetch settings", error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSettings(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...settings,
                    homepageBenefits: JSON.stringify(settings.homepageBenefits)
                })
            })

            if (res.ok) {
                toast.success("Ayarlar güncellendi")
            } else {
                toast.error("Bir hata oluştu")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Site Ayarları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Adı</Label>
                                <Input
                                    id="siteName"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">İletişim Email</Label>
                                <Input
                                    id="contactEmail"
                                    name="contactEmail"
                                    value={settings.contactEmail || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">İletişim Telefon</Label>
                                <Input
                                    id="contactPhone"
                                    name="contactPhone"
                                    value={settings.contactPhone || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="announcementText">Duyuru Metni (Yeşil Bar)</Label>
                                <Input
                                    id="announcementText"
                                    name="announcementText"
                                    value={settings.announcementText || ""}
                                    onChange={handleChange}
                                    placeholder="Örn: Tüm ürünlerde %50'ye varan indirimler!"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="contactAddress">Adres</Label>
                                <Input
                                    id="contactAddress"
                                    name="contactAddress"
                                    value={settings.contactAddress || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="facebookUrl">Facebook URL</Label>
                                <Input
                                    id="facebookUrl"
                                    name="facebookUrl"
                                    value={settings.facebookUrl || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instagramUrl">Instagram URL</Label>
                                <Input
                                    id="instagramUrl"
                                    name="instagramUrl"
                                    value={settings.instagramUrl || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                                <Input
                                    id="twitterUrl"
                                    name="twitterUrl"
                                    value={settings.twitterUrl || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tiktokUrl">TikTok URL</Label>
                                <Input
                                    id="tiktokUrl"
                                    name="tiktokUrl"
                                    value={settings.tiktokUrl || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">Anasayfa Özellikleri (Kargo, Ödeme vb.)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {settings.homepageBenefits.map((benefit, index) => (
                                    <div key={index} className="space-y-4 p-4 border rounded-lg">
                                        <h4 className="font-medium text-sm text-muted-foreground">Özellik {index + 1}</h4>
                                        <div className="space-y-2">
                                            <Label>Başlık</Label>
                                            <Input
                                                value={benefit.title}
                                                onChange={(e) => {
                                                    const newBenefits = [...settings.homepageBenefits]
                                                    newBenefits[index].title = e.target.value
                                                    setSettings(prev => ({ ...prev, homepageBenefits: newBenefits }))
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Açıklama</Label>
                                            <Input
                                                value={benefit.description}
                                                onChange={(e) => {
                                                    const newBenefits = [...settings.homepageBenefits]
                                                    newBenefits[index].description = e.target.value
                                                    setSettings(prev => ({ ...prev, homepageBenefits: newBenefits }))
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
