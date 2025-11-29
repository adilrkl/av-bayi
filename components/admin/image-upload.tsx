"use client"

import { useEffect, useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
    disabled?: boolean
    onChange: (value: string) => void
    onRemove: (value: string) => void
    onReorder?: (value: string[]) => void
    value: string[]
}

export function ImageUpload({
    disabled,
    onChange,
    onRemove,
    onReorder,
    value
}: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    const onMove = (index: number, direction: 'left' | 'right') => {
        const newImages = [...value]
        if (direction === 'left') {
            if (index === 0) return
            [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]]
        } else {
            if (index === newImages.length - 1) return
            [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
        }

        if (onReorder) {
            onReorder(newImages)
        }
    }

    const handleDelete = async (url: string) => {
        try {
            setIsDeleting(true)
            const response = await fetch("/api/cloudinary/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            })

            if (!response.ok) {
                throw new Error("Failed to delete image")
            }

            onRemove(url)
            toast.success("Resim silindi")
        } catch (error) {
            toast.error("Resim silinirken bir hata oluştu")
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url, index) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden group">
                        <div className="z-10 absolute top-2 right-2 flex gap-1">
                            <Button
                                type="button"
                                onClick={() => handleDelete(url)}
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                                disabled={disabled || isDeleting}
                            >
                                <Trash className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Reorder Buttons */}
                        <div className="z-10 absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                type="button"
                                onClick={() => onMove(index, 'left')}
                                variant="secondary"
                                size="icon"
                                className="h-6 w-6"
                                disabled={disabled || index === 0}
                            >
                                &lt;
                            </Button>
                            <Button
                                type="button"
                                onClick={() => onMove(index, 'right')}
                                variant="secondary"
                                size="icon"
                                className="h-6 w-6"
                                disabled={disabled || index === value.length - 1}
                            >
                                &gt;
                            </Button>
                        </div>

                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {index === 0 ? "Ana Resim" : `${index + 1}. Resim`}
                        </div>

                        <img
                            className="object-cover w-full h-full"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                signatureEndpoint="/api/cloudinary/sign"
                onSuccess={(result: any) => {
                    if (result?.info?.secure_url) {
                        onChange(result.info.secure_url)
                    }
                }}
                options={{
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                    multiple: true,
                    maxFiles: 10
                }}
            >
                {({ open }) => {
                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={() => open()}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Resim Yükle
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}
