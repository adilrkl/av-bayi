"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/admin/image-upload"

type SliderFormProps = {
    slider?: {
        id: string
        title: string
        subtitle: string | null
        image: string
        link: string | null
        order: number
        isActive: boolean
    }
}

export function SliderForm({ slider }: SliderFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: slider?.title || "",
        subtitle: slider?.subtitle || "",
        image: slider?.image || "",
        link: slider?.link || "",
        order: slider?.order || 0,
        isActive: slider?.isActive ?? true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = slider
                ? `/api/admin/sliders/${slider.id}`
                : "/api/admin/sliders"

            const method = slider ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/admin/sliders")
                router.refresh()
            }
        } catch (error) {
            console.error("Slider kaydedilemedi:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{slider ? "Slayt Düzenle" : "Yeni Slayt"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Başlık</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Alt Başlık</Label>
                        <Input
                            id="subtitle"
                            value={formData.subtitle}
                            onChange={(e) =>
                                setFormData({ ...formData, subtitle: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Resim</Label>
                        <ImageUpload
                            value={formData.image ? [formData.image] : []}
                            disabled={loading}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            onRemove={() => setFormData({ ...formData, image: "" })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="link">Link (Opsiyonel)</Label>
                        <Input
                            id="link"
                            value={formData.link}
                            onChange={(e) =>
                                setFormData({ ...formData, link: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="order">Sıra</Label>
                        <Input
                            id="order"
                            type="number"
                            value={formData.order}
                            onChange={(e) =>
                                setFormData({ ...formData, order: parseInt(e.target.value) })
                            }
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) =>
                                setFormData({ ...formData, isActive: e.target.checked })
                            }
                            className="h-4 w-4"
                        />
                        <Label htmlFor="isActive">Aktif</Label>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/sliders")}
                        >
                            İptal
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
