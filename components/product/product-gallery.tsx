"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: string | any // Handle JSON string or array
}

export function ProductGallery({ images }: ProductGalleryProps) {
    let imageList: string[] = []
    try {
        imageList = typeof images === 'string' ? JSON.parse(images) : images
    } catch (e) {
        imageList = []
    }

    const [selectedImage, setSelectedImage] = useState(imageList[0] || null)

    if (!selectedImage) {
        return (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                Görsel Yok
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="aspect-square bg-white border rounded-lg overflow-hidden relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={selectedImage}
                    alt="Product"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {imageList.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                            "relative w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden transition-all",
                            selectedImage === img ? "ring-2 ring-primary border-transparent" : "hover:border-primary/50"
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
