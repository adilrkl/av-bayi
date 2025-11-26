import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    })

    if (!adminUser) {
        console.log('Admin user not found. Please create an admin user first.')
        return
    }

    const blogCount = await prisma.blogPost.count()

    if (blogCount < 3) {
        console.log(`Found ${blogCount} blog posts. Seeding up to 3...`)

        const postsToCreate = 3 - blogCount

        for (let i = 0; i < postsToCreate; i++) {
            await prisma.blogPost.create({
                data: {
                    title: `Örnek Blog Yazısı ${blogCount + i + 1}`,
                    slug: `ornek-blog-yazisi-${blogCount + i + 1}`,
                    content: 'Bu bir örnek blog yazısıdır. Avcılık ve doğa sporları hakkında içerikler buraya eklenecektir.',
                    excerpt: 'Avcılık ve doğa sporları hakkında kısa bir özet.',
                    authorId: adminUser.id,
                    publishedAt: new Date(),
                }
            })
        }
        console.log('Blog posts seeded successfully.')
    } else {
        console.log('Blog posts already exist.')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
