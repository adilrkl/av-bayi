"use client"

import { useSession, signOut } from "next-auth/react"
import { redirect, usePathname } from "next/navigation"
import Link from "next/link"
import { User, MapPin, Package, LogOut } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const pathname = usePathname()

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login?callbackUrl=/profile"
        }
    }, [status])

    if (status === "loading") {
        return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>
    }

    if (!session) {
        return null
    }

    const handleLogout = () => {
        signOut({ callbackUrl: "/" })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                {session.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold">{session.user?.name}</div>
                                <div className="text-xs text-muted-foreground">{session.user?.email}</div>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <Link
                                href="/profile"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    pathname === "/profile" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                )}
                            >
                                <User className="h-4 w-4" />
                                Profil Bilgileri
                            </Link>
                            <Link
                                href="/profile/orders"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    pathname === "/profile/orders" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                )}
                            >
                                <Package className="h-4 w-4" />
                                Siparişlerim
                            </Link>
                            <Link
                                href="/profile/addresses"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    pathname === "/profile/addresses" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                )}
                            >
                                <MapPin className="h-4 w-4" />
                                Adreslerim
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive transition-colors text-left">
                                <LogOut className="h-4 w-4" />
                                Çıkış Yap
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}
