import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                { error: "Dosya alınmadı." },
                { status: 400 }
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_")

        // Ensure directory exists (optional, assuming public/uploads exists or create it)
        // For simplicity in this dev environment, we'll write to public/uploads
        // In production, you'd use S3 or similar.

        const uploadDir = path.join(process.cwd(), "public/uploads")

        // Create dir if not exists
        try {
            await require("fs").promises.mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // ignore
        }

        await writeFile(
            path.join(uploadDir, filename),
            buffer
        )

        return NextResponse.json({
            url: `/uploads/${filename}`,
            success: true
        })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { error: "Error uploading file." },
            { status: 500 }
        )
    }
}
