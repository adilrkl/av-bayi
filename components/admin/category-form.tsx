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
import { ImageUpload } from "@/components/admin/image-upload"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react"

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    image: z.string().optional(),
    parentId: z.string().nullable().optional(),
})

interface Category {
    id: string
    name: string
    children?: Category[]
}

interface CategoryFormProps {
    initialData?: {
        id: string
        name: string
        slug: string
        image?: string
        parentId?: string | null
    }
}

export function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
            image: "",
            parentId: null,
        },
    })

    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories")
                const data = await response.json()
                if (data.success) {
                    setCategories(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch categories", error)
            }
        }

        fetchCategories()
    }, [])

    async function onSubmit(values: z.infer<typeof categorySchema>) {
        setIsLoading(true)
        try {
            const url = initialData
                ? `/api/admin/categories/${initialData.id}`
                : "/api/categories"

            const method = initialData ? "PATCH" : "POST"

            const submitData = {
                ...values,
                parentId: values.parentId === "null" ? null : values.parentId,
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            })

            if (!response.ok) {
                throw new Error(initialData ? "Failed to update category" : "Failed to create category")
            }

            toast.success(initialData ? "Kategori güncellendi" : "Kategori oluşturuldu")
            router.push("/admin/categories")
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori Adı</FormLabel>
                                <FormControl>
                                    <Input placeholder="Kategori Adı" {...field} />
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
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="kategori-slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Üst Kategori</FormLabel>
                            <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value || undefined}
                                defaultValue={field.value || undefined}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Üst kategori seçin (Opsiyonel)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="null">Yok (Ana Kategori)</SelectItem>
                                    {categories
                                        .filter((category) => category.id !== initialData?.id) // Prevent selecting self as parent
                                        .map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kategori Resmi</FormLabel>
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

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (initialData ? "Güncelleniyor..." : "Oluşturuluyor...") : (initialData ? "Kategori Güncelle" : "Kategori Oluştur")}
                </Button>
            </form>
        </Form>
    )
}
