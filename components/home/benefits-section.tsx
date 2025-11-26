import { Truck, ShieldCheck, Headphones, RefreshCw } from "lucide-react"
import { prisma } from "@/lib/prisma"

const defaultBenefits = [
    {
        icon: Truck,
        title: "Ücretsiz Kargo",
        description: "500 TL ve üzeri alışverişlerde kargo bedava.",
    },
    {
        icon: ShieldCheck,
        title: "Güvenli Ödeme",
        description: "256-bit SSL sertifikası ile %100 güvenli ödeme.",
    },
    {
        icon: Headphones,
        title: "7/24 Destek",
        description: "Uzman ekibimizle her zaman yanınızdayız.",
    },
    {
        icon: RefreshCw,
        title: "Kolay İade",
        description: "14 gün içinde koşulsuz iade garantisi.",
    },
]

export async function BenefitsSection() {
    const settings = await prisma.settings.findFirst()
    const customBenefits = settings?.homepageBenefits ? JSON.parse(settings.homepageBenefits) : []

    const benefits = defaultBenefits.map((benefit, index) => {
        const custom = customBenefits[index]
        return {
            ...benefit,
            title: custom?.title || benefit.title,
            description: custom?.description || benefit.description
        }
    })

    return (
        <section className="py-12 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="p-3 bg-white/10 rounded-full">
                                <benefit.icon className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                                <p className="text-primary-foreground/80 text-sm">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
