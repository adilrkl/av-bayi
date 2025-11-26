"use client"

import Link from "next/link"
import {
    ChevronDown,
    Crosshair,
    Disc,
    Backpack,
    Wind,
    Eye,
    Tent,
    Shield,
    Wrench,
    RefreshCw,
    CircleDot
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
    id: string
    name: string
    slug: string
    children?: Category[]
}

interface MegaMenuProps {
    categories: Category[]
}

const getCategoryIcon = (slug: string) => {
    const iconClass = "w-6 h-6 mb-2 text-primary/80 group-hover:text-primary transition-colors";
    switch (slug) {
        case 'av-tufekleri': return <Crosshair className={iconClass} />;
        case 'av-fisekleri': return <CircleDot className={iconClass} />;
        case 'av-malzemeleri': return <Backpack className={iconClass} />;
        case 'havali-silahlar': return <Wind className={iconClass} />;
        case 'optik-elektronik': return <Eye className={iconClass} />;
        case 'kamp-malzemeleri': return <Tent className={iconClass} />;
        case 'tabanca-ekipmanlari': return <Shield className={iconClass} />;
        case 'modifiye': return <Wrench className={iconClass} />;
        case 'ikinci-el-av-tufekleri': return <RefreshCw className={iconClass} />;
        default: return null;
    }
}

export function MegaMenu({ categories }: MegaMenuProps) {
    return (
        <div className="bg-white border-b border-border hidden md:block shadow-sm relative z-30">
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between">
                    <ul className="flex items-center w-full justify-between">
                        {categories.map((category) => (
                            <li key={category.id} className="group py-3">
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="flex flex-col items-center text-sm font-medium text-foreground/80 hover:text-primary transition-colors uppercase tracking-wide py-2"
                                >
                                    {getCategoryIcon(category.slug)}
                                    <span className="flex items-center">
                                        {category.name}
                                        {category.children && category.children.length > 0 && (
                                            <ChevronDown className="ml-1 h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </span>
                                </Link>

                                {/* Mega Menu Dropdown */}
                                {category.children && category.children.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white border-t border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="container mx-auto px-4 py-6">
                                            <div className="grid grid-cols-4 gap-8">
                                                {category.children.map((child) => (
                                                    <div key={child.id}>
                                                        <Link
                                                            href={`/category/${child.slug}`}
                                                            className="font-bold text-foreground hover:text-primary mb-2 block"
                                                        >
                                                            {child.name}
                                                        </Link>
                                                        {child.children && child.children.length > 0 && (
                                                            <ul className="space-y-1 mt-2">
                                                                {child.children.map(grandchild => (
                                                                    <li key={grandchild.id}>
                                                                        <Link
                                                                            href={`/category/${grandchild.slug}`}
                                                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                                        >
                                                                            {grandchild.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}
