import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
        }

        const body = await request.json()
        const { title, subtitle, image, link, order, isActive } = body

        const slider = await prisma.slider.create({
            data: {
                title,
                subtitle: subtitle || null,
                image,
                link: link || null,
                order: parseInt(order),
                isActive,
            },
        })

        return NextResponse.json(slider)
    } catch (error) {
        console.error("Slider oluşturma hatası:", error)
        return NextResponse.json(
            { error: "Slider oluşturulamadı" },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const sliders = await prisma.slider.findMany({
            orderBy: {
                order: 'asc'
            }
        })

        return NextResponse.json(sliders)
    } catch (error) {
        console.error("Sliderlar yüklenemedi:", error)
        return NextResponse.json(
            { error: "Sliderlar yüklenemedi" },
            { status: 500 }
        )
    }
}
