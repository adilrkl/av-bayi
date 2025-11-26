"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ImageUpload } from "@/components/admin/image-upload"

const blogPostSchema = z.object({
    title: z.string().min(1, "Başlık zorunludur"),
    slug: z.string().min(1, "Slug zorunludur"),
    content: z.string().min(1, "İçerik zorunludur"),
    excerpt: z.string().optional(),
    thumbnail: z.string().optional(),
    publishedAt: z.string().optional(),
})

interface BlogFormProps {
    initialData?: {
        id: string
        title: string
        slug: string
        content: string
        excerpt?: string
        thumbnail?: string
        publishedAt?: string
    }
}

export function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof blogPostSchema>>({
        resolver: zodResolver(blogPostSchema),
        defaultValues: initialData || {
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            thumbnail: "",
            publishedAt: new Date().toISOString().split('T')[0],
        },
    })

    async function onSubmit(values: z.infer<typeof blogPostSchema>) {
        setIsLoading(true)
        try {
            const url = initialData
                ? `/api/admin/blog/${initialData.id}`
                : "/api/admin/blog"

            const method = initialData ? "PATCH" : "POST"

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error(initialData ? "Yazı güncellenemedi" : "Yazı oluşturulamadı")
            }

            toast.success(initialData ? "Yazı başarıyla güncellendi" : "Yazı başarıyla oluşturuldu")
            router.push("/admin/blog")
            router.refresh()
        } catch (error) {
            toast.error("Bir hata oluştu")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Başlık</FormLabel>
                                <FormControl>
                                    <Input placeholder="Blog Yazısı Başlığı" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug (URL)</FormLabel>
                                <FormControl>
                                    <Input placeholder="blog-yazisi-basligi" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Özet (Kısa Açıklama)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Yazının kısa bir özeti..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>İçerik</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Yazı içeriğini buraya yazınız..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kapak Görseli</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={isLoading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="publishedAt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Yayın Tarihi</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Kaydediliyor..." : (initialData ? "Güncelle" : "Oluştur")}
                </Button>
            </form>
        </Form>
    )
}
