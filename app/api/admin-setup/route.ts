import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const secret = searchParams.get('secret')

    // Basit güvenlik önlemi: Sadece bu key'i bilen çalıştırabilir
    if (secret !== 'railway-fix-2024') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        })

        return NextResponse.json({
            success: true,
            message: `User ${updatedUser.email} is now ADMIN`,
            user: { email: updatedUser.email, role: updatedUser.role }
        })
    } catch (error) {
        console.error('Admin setup error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
