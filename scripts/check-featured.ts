import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const featuredProducts = await prisma.product.findMany({
        where: { isFeatured: true },
        select: { id: true, name: true, isFeatured: true }
    })

    console.log('Featured Products in DB:', featuredProducts)

    const allProducts = await prisma.product.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, name: true, isFeatured: true }
    })

    console.log('Recent Products:', allProducts)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
