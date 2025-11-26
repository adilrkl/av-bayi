import { TopBar } from "./top-bar"
import { MainHeader } from "./main-header"
import { MegaMenu } from "./mega-menu"
import { prisma } from "@/lib/prisma"

async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            include: {
                children: {
                    include: {
                        children: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        })
        return categories
    } catch (error) {
        console.error("Failed to fetch categories for menu", error)
        return []
    }
}

export async function Header() {
    const categories = await getCategories()

    return (
        <header className="flex flex-col w-full z-40 relative">
            <TopBar />
            <MainHeader categories={categories} />
            <MegaMenu categories={categories} />
        </header>
    )
}
