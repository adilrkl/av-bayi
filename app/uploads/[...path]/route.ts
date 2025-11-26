import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathParams } = await params
        const filename = pathParams.join("/")
        const filePath = path.join(process.cwd(), "public/uploads", filename)

        // Security check: ensure the file is within the uploads directory
        const uploadsDir = path.join(process.cwd(), "public/uploads")
        if (!filePath.startsWith(uploadsDir)) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        try {
            await fs.access(filePath)
        } catch {
            return new NextResponse("File not found", { status: 404 })
        }

        const fileBuffer = await fs.readFile(filePath)
        const ext = path.extname(filename).toLowerCase()

        let contentType = "application/octet-stream"
        switch (ext) {
            case ".png":
                contentType = "image/png"
                break
            case ".jpg":
            case ".jpeg":
                contentType = "image/jpeg"
                break
            case ".gif":
                contentType = "image/gif"
                break
            case ".webp":
                contentType = "image/webp"
                break
            case ".svg":
                contentType = "image/svg+xml"
                break
        }

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        })
    } catch (error) {
        console.error("Error serving file:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
