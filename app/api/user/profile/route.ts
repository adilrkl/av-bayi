import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()
        const { name, phone, password, currentPassword } = body

        const updateData: any = {
            name,
            phone,
        }

        if (password && currentPassword) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
            })

            if (!user || !user.password) {
                return NextResponse.json(
                    { success: false, error: 'User not found' },
                    { status: 404 }
                )
            }

            const isCorrectPassword = await bcrypt.compare(
                currentPassword,
                user.password
            )

            if (!isCorrectPassword) {
                return NextResponse.json(
                    { success: false, error: 'Incorrect current password' },
                    { status: 400 }
                )
            }

            updateData.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        })

        // Remove password from response
        const { password: _, ...userWithoutPassword } = updatedUser

        return NextResponse.json({ success: true, data: userWithoutPassword })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
