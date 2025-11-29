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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ImageUpload } from "@/components/admin/image-upload"

const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.string().refine((val) => !isNaN(Number(val)), "Price must be a number"),
    discountPrice: z.string().optional().refine((val) => !val || !isNaN(Number(val)), "Discount price must be a number"),
    stock: z.string().refine((val) => !isNaN(Number(val)), "Stock must be a number"),
    categoryId: z.string().min(1, "Category is required"),
    brandId: z.string().optional(),
    images: z.string().min(1, "At least one image URL is required"),
    youtubeUrl: z.string().optional(),
    features: z.string().optional(),
    isFeatured: z.boolean(),
})

interface Category {
    id: string
    name: string
    children?: Category[]
}

interface ProductFormProps {
    categories: Category[]
    brands?: { id: string; name: string }[]
    initialData?: {
        id: string
        name: string
        slug: string
        description: string
        price: string
        discountPrice: string
        stock: string
        categoryId: string
        brandId?: string
        images: string
        youtubeUrl?: string
        features?: string
        isFeatured: boolean
    }
}

function flattenCategories(categories: Category[], parentName = ""): { id: string, name: string }[] {
    return categories.reduce((acc, category) => {
        const fullName = parentName ? `${parentName} > ${category.name}` : category.name
        acc.push({ id: category.id, name: fullName })
        if (category.children && category.children.length > 0) {
            acc.push(...flattenCategories(category.children, fullName))
        }
        return acc
    }, [] as { id: string, name: string }[])
}

export function ProductForm({ categories, brands = [], initialData }: ProductFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const flattenedCategories = flattenCategories(categories)

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
            description: "",
            price: "",
            discountPrice: "",
            stock: "",
            categoryId: "",
            brandId: "",
            images: "",
            youtubeUrl: "",
            features: "",
            isFeatured: false,
        },
    })

    async function onSubmit(values: z.infer<typeof productSchema>) {
        setIsLoading(true)
        try {
            const url = initialData
                ? `/api/admin/products/${initialData.id}`
                : "/api/products"

            const method = initialData ? "PATCH" : "POST"

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    price: Number(values.price),
                    discountPrice: values.discountPrice ? Number(values.discountPrice) : null,
                    stock: Number(values.stock),
                    images: values.images.split(",").map((url) => url.trim()),
                    youtubeUrl: values.youtubeUrl || null,
                    features: values.features || null,
                    brandId: values.brandId === "no-brand" ? null : values.brandId || null,
                    isFeatured: values.isFeatured,
                }),
            })

            if (!response.ok) {
                const errorData = await response.text()
                console.error("API Error:", errorData)
                throw new Error(initialData ? "Failed to update product" : "Failed to create product")
            }

            toast.success(initialData ? "Product updated successfully" : "Product created successfully")
            router.push("/admin/products")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
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
                                <FormLabel>Ürün Adı</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ürün Adı" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="brandId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marka (Opsiyonel)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Marka Seçiniz" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="no-brand">Marka Yok</SelectItem>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                {brand.name}
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
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ürün Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="product-slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ürün Açıklaması</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Ürün açıklamasını buraya yazınız..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ürün Fiyatı</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discountPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>İndirimli Fiyat (Opsiyonel)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stok</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategori Seçiniz" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {flattenedCategories.map((category) => (
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
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Resimler</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? field.value.split(",").filter(Boolean) : []}
                                        disabled={isLoading}
                                        onChange={(url) => {
                                            const currentImages = field.value ? field.value.split(",").filter(Boolean) : []
                                            const newValue = [...currentImages, url].join(",")
                                            field.onChange(newValue)
                                        }}
                                        onRemove={(url) => {
                                            const currentImages = field.value ? field.value.split(",").filter(Boolean) : []
                                            field.onChange(currentImages.filter((image) => image !== url).join(","))
                                        }}
                                        onReorder={(newImages) => {
                                            field.onChange(newImages.join(","))
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>YouTube Video URL (Opsiyonel)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ürün Özellikleri (Detaylı Açıklama)</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Ürün özelliklerini buraya yazınız..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4"
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Öne Çıkan Ürün
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Bu ürünü anasayfada "Öne Çıkanlar" listesinde göster.
                                </p>
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Oluşturuluyor..." : "Ürün Güncelle"}
                </Button>

            </form >
        </Form >
    )
}
