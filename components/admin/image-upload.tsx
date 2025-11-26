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
    value: string[]
}

export function ImageUpload({
    disabled,
    onChange,
    onRemove,
    value
}: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                                disabled={disabled}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
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
                    console.log("Upload success!", result)
                    if (result?.info?.secure_url) {
                        const url = result.info.secure_url
                        console.log("Image URL:", url)
                        onChange(url)
                        toast.success("Resim başarıyla yüklendi!")
                    }
                }}
                options={{
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                }}
            >
                {({ open }) => {
                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={() => {
                                console.log("Opening Cloudinary widget...")
                                open()
                            }}
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
