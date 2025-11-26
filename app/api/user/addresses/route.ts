import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id }
        })

        return NextResponse.json({ success: true, data: addresses })
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { title, addressLine, city, district, zipCode, phone } = body

        if (!title || !addressLine || !city || !district || !phone) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
        }

        const address = await prisma.address.create({
            data: {
                userId: session.user.id,
                title,
                addressLine,
                city,
                district,
                zipCode: zipCode || "",
                phone
            }
        })

        return NextResponse.json({ success: true, data: address })
    } catch (error) {
        console.error("Address creation error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ success: false, error: "Missing address ID" }, { status: 400 })
        }

        // Verify address belongs to user
        const address = await prisma.address.findUnique({
            where: { id }
        })

        if (!address || address.userId !== session.user.id) {
            return NextResponse.json({ success: false, error: "Address not found or unauthorized" }, { status: 404 })
        }

        await prisma.address.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Address deletion error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
