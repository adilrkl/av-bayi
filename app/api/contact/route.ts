import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, subject, message } = body

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
        }

        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message
            }
        })

        return NextResponse.json({ success: true, data: contactMessage })
    } catch (error) {
        console.error("Contact message error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        // Basic admin check (role based check should be better but for now checking if user exists)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, data: messages })
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
