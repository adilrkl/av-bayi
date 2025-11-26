import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ success: true, data: orders })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()
        const { items, shippingAddress, billingAddress, couponCode, totalAmount, paymentStatus } = body

        // Start transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    totalAmount,
                    status: 'PENDING',
                    paymentStatus: paymentStatus || 'PENDING',
                    shippingAddress: JSON.stringify(shippingAddress),
                    billingAddress: JSON.stringify(billingAddress),
                    couponCode,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            variant: item.variant ? JSON.stringify(item.variant) : null,
                        })),
                    },
                },
            })

            // 2. Decrement Stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                    },
                })
            }

            // 3. Increment Coupon Usage if applicable
            if (couponCode) {
                await tx.coupon.update({
                    where: { code: couponCode },
                    data: { usedCount: { increment: 1 } },
                })
            }

            return newOrder
        })

        return NextResponse.json({ success: true, data: order })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
