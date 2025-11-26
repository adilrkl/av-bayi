"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ContactFormProps {
    settings: any
}

export function ContactForm({ settings }: ContactFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Mesajınız gönderildi. En kısa sürede size dönüş yapacağız.")
                setFormData({ name: "", email: "", subject: "", message: "" })
            } else {
                toast.error("Mesaj gönderilirken bir hata oluştu.")
            }
        } catch (error) {
            toast.error("Bir hata oluştu.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-heading font-bold text-center mb-12">İletişim</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-muted/30 p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Bize Ulaşın</h2>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Adres</h3>
                                <p className="text-muted-foreground">
                                    {settings?.contactAddress || "Adres bilgisi bulunamadı."}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Telefon</h3>
                                <p className="text-muted-foreground">
                                    {settings?.contactPhone || "Telefon bilgisi bulunamadı."}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">E-posta</h3>
                                <p className="text-muted-foreground">
                                    {settings?.contactEmail || "E-posta bilgisi bulunamadı."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-muted h-[300px] rounded-2xl flex items-center justify-center text-muted-foreground">
                        Harita Alanı
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card border rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Mesaj Gönderin</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Ad Soyad</label>
                                <Input
                                    id="name"
                                    placeholder="Adınız Soyadınız"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">E-posta</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">Konu</label>
                            <Input
                                id="subject"
                                placeholder="Mesajınızın konusu"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Mesajınız</label>
                            <Textarea
                                id="message"
                                placeholder="Mesajınızı buraya yazın..."
                                className="min-h-[150px]"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? "Gönderiliyor..." : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Gönder
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
