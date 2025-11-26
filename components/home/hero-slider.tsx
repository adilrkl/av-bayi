import { prisma } from "@/lib/prisma"
import { HeroSliderClient } from "@/components/home/hero-slider-client"

export async function HeroSlider() {
    const slides = await prisma.slider.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            order: 'asc'
        }
    })

    return <HeroSliderClient slides={slides} />
}
