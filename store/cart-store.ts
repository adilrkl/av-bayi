import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    productId: string
    name: string
    price: number
    image?: string
    quantity: number
    variant?: any
}

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    totalItems: () => number
    subtotal: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const items = get().items
                const existingItem = items.find(item => item.productId === newItem.productId)

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.productId === newItem.productId
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        )
                    })
                } else {
                    set({ items: [...items, newItem] })
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter(item => item.productId !== productId) })
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                } else {
                    set({
                        items: get().items.map(item =>
                            item.productId === productId ? { ...item, quantity } : item
                        )
                    })
                }
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            subtotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
        }),
        {
            name: 'cart-storage',
        }
    )
)
