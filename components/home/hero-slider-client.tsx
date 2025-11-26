"use client"

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

type Slide = {
    id: string
    title: string
    subtitle: string | null
    image: string
    link: string | null
    order: number
}

type HeroSliderClientProps = {
    slides: Slide[]
}

export function HeroSliderClient({ slides }: HeroSliderClientProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    if (slides.length === 0) {
        return null
    }

    return (
        <div className="relative group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide) => (
                        <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-[500px] md:h-[600px]">
                            {/* Background Image */}
                            <div className="absolute inset-0 bg-stone-900 flex items-center justify-center">
                                {slide.image && (
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
                                <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight">
                                        {slide.title}
                                    </h2>
                                    {slide.subtitle && (
                                        <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    {slide.link && (
                                        <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white border-none text-lg px-8 py-6 rounded-full">
                                            <Link href={slide.link}>Keşfet</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={scrollPrev}
            >
                <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={scrollNext}
            >
                <ChevronRight className="h-8 w-8" />
            </Button>
        </div>
    )
}
