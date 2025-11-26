import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { items, couponCode } = await request.json()

        if (!items || !Array.isArray(items)) {
            return NextResponse.json(
                { success: false, error: 'Invalid items' },
                { status: 400 }
            )
        }

        let subtotal = 0
        const validatedItems = []
        const errors = []

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            })

            if (!product) {
                errors.push(`Product ${item.productId} not found`)
                continue
            }

            if (product.stock < item.quantity) {
                errors.push(`Product ${product.name} is out of stock (Available: ${product.stock})`)
            }

            const price = product.discountPrice ? Number(product.discountPrice) : Number(product.price)
            subtotal += price * item.quantity

            validatedItems.push({
                ...item,
                price,
                name: product.name,
                image: product.images ? JSON.parse(product.images as string)[0] : null, // Handle String/Json
            })
        }

        let discount = 0
        let coupon = null

        if (couponCode) {
            coupon = await prisma.coupon.findUnique({
                where: { code: couponCode },
            })

            if (coupon) {
                // Check expiration, usage limit, min order amount
                const now = new Date()
                if (coupon.expirationDate && coupon.expirationDate < now) {
                    errors.push('Coupon expired')
                    coupon = null
                } else if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                    errors.push('Coupon usage limit reached')
                    coupon = null
                } else if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
                    errors.push(`Minimum order amount for this coupon is ${coupon.minOrderAmount}`)
                    coupon = null
                } else {
                    if (coupon.discountType === 'PERCENTAGE') {
                        discount = subtotal * (Number(coupon.value) / 100)
                    } else {
                        discount = Number(coupon.value)
                    }
                }
            } else {
                errors.push('Invalid coupon code')
            }
        }

        const total = subtotal - discount

        return NextResponse.json({
            success: true,
            data: {
                items: validatedItems,
                subtotal,
                discount,
                total,
                coupon,
                errors,
            },
        })
    } catch (error) {
        console.error('Error validating cart:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to validate cart' },
            { status: 500 }
        )
    }
}
