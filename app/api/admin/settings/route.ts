import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // Ensure this path is correct

export async function GET() {
    try {
        const settings = await prisma.settings.findFirst()
        return NextResponse.json(settings || {})
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        // Basic admin check - ideally should be more robust
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()

        // Upsert settings (create if not exists, update if exists)
        // Since we only want one settings row, we can find the first one or create new
        const existingSettings = await prisma.settings.findFirst()

        let settings
        if (existingSettings) {
            settings = await prisma.settings.update({
                where: { id: existingSettings.id },
                data: body
            })
        } else {
            settings = await prisma.settings.create({
                data: body
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error("Settings update error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
