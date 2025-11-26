import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // 1. Değişiklik: Promise eklendi
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
        }

        // 2. Değişiklik: params await edildi
        const { id } = await params;

        const body = await request.json()
        const { title, subtitle, image, link, order, isActive } = body

        const slider = await prisma.slider.update({
            where: {
                id: id, // params.id yerine await edilmiş 'id' kullanıldı
            },
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
        console.error("Slider güncelleme hatası:", error)
        return NextResponse.json(
            { error: "Slider güncellenemedi" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // 3. Değişiklik: Promise eklendi
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
        }

        // 4. Değişiklik: params await edildi
        const { id } = await params;

        await prisma.slider.delete({
            where: {
                id: id, // params.id yerine await edilmiş 'id' kullanıldı
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Slider silme hatası:", error)
        return NextResponse.json(
            { error: "Slider silinemedi" },
            { status: 500 }
        )
    }
}