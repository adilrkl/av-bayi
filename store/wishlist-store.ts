import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
    productId: string
    name: string
    price: number
    image?: string
    slug: string
    discountPrice?: number | null
    stock: number
}

interface WishlistState {
    items: WishlistItem[]
    addItem: (item: WishlistItem) => void
    removeItem: (productId: string) => void
    isInWishlist: (productId: string) => boolean
    clearWishlist: () => void
    totalItems: () => number
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const items = get().items
                const existingItem = items.find(item => item.productId === newItem.productId)

                if (!existingItem) {
                    set({ items: [...items, newItem] })
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter(item => item.productId !== productId) })
            },
            isInWishlist: (productId) => {
                return get().items.some(item => item.productId === productId)
            },
            clearWishlist: () => set({ items: [] }),
            totalItems: () => get().items.length,
        }),
        {
            name: 'wishlist-storage',
        }
    )
)
