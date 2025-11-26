import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSliders() {
    // Delete existing sliders
    await prisma.slider.deleteMany({})

    // Create the hardcoded sliders
    const sliders = [
        {
            title: "Yeni Sezon Av Tüfekleri",
            subtitle: "En son teknoloji ile üretilen tüfekleri keşfedin.",
            image: "/images/hero/hero-1.jpg",
            link: "/category/av-tufekleri",
            order: 1,
            isActive: true
        },
        {
            title: "Premium Fişek Koleksiyonu",
            subtitle: "Yüksek performanslı fişeklerde özel indirimler.",
            image: "/images/hero/hero-2.jpg",
            link: "/category/av-fisekleri",
            order: 2,
            isActive: true
        },
        {
            title: "Doğa Yürüyüşü Ekipmanları",
            subtitle: "Her koşula uygun giyim ve aksesuarlar.",
            image: "/images/hero/hero-3.jpg",
            link: "/category/kamp-malzemeleri",
            order: 3,
            isActive: true
        }
    ]

    for (const slider of sliders) {
        await prisma.slider.create({
            data: slider
        })
    }

    console.log('✅ Sliders seeded successfully!')
}

seedSliders()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
