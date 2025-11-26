"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, User, ShoppingCart, Heart, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { useSession } from "next-auth/react"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"

interface Category {
    id: string
    name: string
    slug: string
    children?: Category[]
}

interface MainHeaderProps {
    categories?: Category[]
}

export function MainHeader({ categories = [] }: MainHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { data: session } = useSession()
    const cartCount = useCartStore((state) => state.totalItems())
    const wishlistCount = useWishlistStore((state) => state.totalItems())
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="border-b border-border bg-background py-4 relative z-50">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden mr-2"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>

                        <Link href="/" className="flex-shrink-0">
                            <h1 className="font-heading text-3xl font-bold text-primary tracking-tighter">
                                KALE<span className="text-secondary">AV</span>
                            </h1>
                        </Link>

                        <Link href="/cart" className="relative md:hidden">
                            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-secondary text-[10px]">
                                0
                            </Badge>
                        </Link>
                    </div>

                    <div className="hidden md:block flex-1 max-w-xl w-full relative">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Ürün, kategori veya marka ara..."
                                className="w-full pl-4 pr-10 rounded-full border-2 border-input focus-visible:ring-primary"
                            />
                            <Button
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-secondary hover:bg-secondary/90 text-white"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/wishlist" className="relative group">
                            <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                                <Heart className="h-6 w-6" />
                                <span className="text-xs mt-1">Favorilerim</span>
                            </div>
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-secondary text-[10px]">
                                0
                            </Badge>
                        </Link>

                        <Link href="/login" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
                            <User className="h-6 w-6" />
                            <span className="text-xs mt-1">Giriş Yap</span>
                        </Link>

                        <Link href="/cart" className="relative group">
                            <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="text-xs mt-1">Sepetim</span>
                            </div>
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-secondary text-[10px]">
                                0
                            </Badge>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="border-b border-border bg-background py-4 relative z-50">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
                <div className="flex items-center justify-between w-full md:w-auto">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden mr-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <h1 className="font-heading text-3xl font-bold text-primary tracking-tighter">
                            KALE<span className="text-secondary">AV</span>
                        </h1>
                    </Link>

                    {/* Mobile Cart Icon (Visible on mobile) */}
                    <Link href="/cart" className="relative md:hidden">
                        <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                        <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-secondary text-[10px]">
                            {cartCount}
                        </Badge>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden md:block flex-1 max-w-xl w-full relative">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const form = e.target as HTMLFormElement
                        const input = form.elements.namedItem('q') as HTMLInputElement
                        if (input.value.trim()) {
                            window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`
                        }
                    }} className="relative">
                        <Input
                            type="text"
                            name="q"
                            placeholder="Ürün, kategori veya marka ara..."
                            className="w-full pl-4 pr-10 rounded-full border-2 border-input focus-visible:ring-primary"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-secondary hover:bg-secondary/90 text-white"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {/* Actions (Desktop) */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/wishlist" className="relative group">
                        <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                            <Heart className="h-6 w-6" />
                            <span className="text-xs mt-1">Favorilerim</span>
                        </div>
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-secondary text-[10px]">
                            {wishlistCount}
                        </Badge>
                    </Link>

                    {session ? (
                        <Link href="/profile" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
                            <User className="h-6 w-6" />
                            <span className="text-xs mt-1">Hesabım</span>
                        </Link>
                    ) : (
                        <Link href="/login" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
                            <User className="h-6 w-6" />
                            <span className="text-xs mt-1">Giriş Yap</span>
                        </Link>
                    )}

                    <Link href="/cart" className="relative group">
                        <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="text-xs mt-1">Sepetim</span>
                        </div>
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-secondary text-[10px]">
                            {cartCount}
                        </Badge>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-background border-b border-border shadow-lg md:hidden p-4 max-h-[80vh] overflow-y-auto">
                    <div className="mb-4">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            const form = e.target as HTMLFormElement
                            const input = form.elements.namedItem('q') as HTMLInputElement
                            if (input.value.trim()) {
                                window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`
                                setIsMobileMenuOpen(false)
                            }
                        }} className="relative mb-4">
                            <Input
                                type="text"
                                name="q"
                                placeholder="Ara..."
                                className="w-full pl-4 pr-10 rounded-full"
                            />
                            <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </form>
                    </div>

                    <nav className="space-y-4">
                        <div className="font-bold text-lg mb-2">Kategoriler</div>
                        <Accordion type="single" collapsible className="w-full">
                            {categories.map((category) => (
                                category.children && category.children.length > 0 ? (
                                    <AccordionItem key={category.id} value={category.id}>
                                        <AccordionTrigger className="py-2 text-sm uppercase tracking-wide">
                                            {category.name}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col space-y-2 pl-4">
                                                <Link
                                                    href={`/category/${category.slug}`}
                                                    className="text-sm font-bold text-primary"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    Tüm {category.name}
                                                </Link>
                                                {category.children?.map((child) => (
                                                    <Link
                                                        key={child.id}
                                                        href={`/category/${child.slug}`}
                                                        className="text-sm text-muted-foreground hover:text-foreground"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ) : (
                                    <div key={category.id} className="border-b last:border-b-0">
                                        <Link
                                            href={`/category/${category.slug}`}
                                            className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline uppercase tracking-wide"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    </div>
                                )
                            ))}
                        </Accordion>

                        <div className="border-t border-border pt-4 space-y-3">
                            {session ? (
                                <Link href="/profile" className="flex items-center space-x-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                    <User className="h-5 w-5" />
                                    <span>Hesabım</span>
                                </Link>
                            ) : (
                                <Link href="/login" className="flex items-center space-x-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                    <User className="h-5 w-5" />
                                    <span>Giriş Yap / Üye Ol</span>
                                </Link>
                            )}
                            <Link href="/wishlist" className="flex items-center space-x-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                <Heart className="h-5 w-5" />
                                <span>Favorilerim</span>
                            </Link>
                            <Link href="/blog" className="flex items-center space-x-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                <span>Blog</span>
                            </Link>
                            <Link href="/contact" className="flex items-center space-x-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                <span>İletişim</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    )
}
