import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        // Sadece admin'ler silebilir
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { url } = body

        if (!url) {
            return new NextResponse("URL is required", { status: 400 })
        }

        // URL'den public_id'yi çıkar
        // Örnek: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/my_image.jpg
        // public_id: folder/my_image

        const regex = /\/v\d+\/(.+)\.[a-z]+$/;
        const match = url.match(regex);

        if (!match) {
            return new NextResponse("Invalid URL format", { status: 400 })
        }

        const publicId = match[1];

        const result = await cloudinary.uploader.destroy(publicId)

        return NextResponse.json(result)
    } catch (error) {
        console.error("[CLOUDINARY_DELETE]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
