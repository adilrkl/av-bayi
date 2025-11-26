import { prisma } from "@/lib/prisma"
import { SliderForm } from "@/components/admin/slider-form"
import { notFound } from "next/navigation"

export default async function EditSliderPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const slider = await prisma.slider.findUnique({
        where: {
            id: id,
        },
    })

    if (!slider) {
        notFound()
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Slayt Düzenle</h1>
            <SliderForm slider={slider} />
        </div>
    )
}
