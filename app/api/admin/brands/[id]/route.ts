import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import slugify from "slugify"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // 1. Düzeltme: Promise tipi
) {
    try {
        const session = await getServerSession(authOptions)

        // 2. Düzeltme: Admin kontrolü aktif edildi
        // Eğer session yoksa veya rol ADMIN değilse 401 (Yetkisiz) hatası dönüyoruz.
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // 3. Düzeltme: params await edildi
        const { id } = await params;

        const body = await req.json()
        const { name, image } = body

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        const slug = slugify(name, { lower: true, strict: true })

        const brand = await prisma.brand.update({
            where: { id: id }, // await edilen id kullanıldı
            data: {
                name,
                slug,
                image,
            }
        })

        return NextResponse.json(brand)
    } catch (error) {
        console.error("[BRAND_PATCH]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // 1. Düzeltme: Promise tipi
) {
    try {
        const session = await getServerSession(authOptions)

        // 2. Düzeltme: Admin kontrolü aktif edildi
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // 3. Düzeltme: params await edildi
        const { id } = await params;

        const brand = await prisma.brand.delete({
            where: { id: id } // await edilen id kullanıldı
        })

        return NextResponse.json(brand)
    } catch (error) {
        console.error("[BRAND_DELETE]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}