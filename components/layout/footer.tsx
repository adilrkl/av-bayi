import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"

import { prisma } from "@/lib/prisma"

export async function Footer() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: {
            products: {
                _count: 'desc'
            }
        },
        take: 5
    })

    const settings = await prisma.settings.findFirst()

    return (
        <footer className="bg-[#1a1a1a] text-gray-300 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: About */}
                    <div>
                        <h3 className="font-heading text-2xl font-bold text-white mb-4">
                            {settings?.siteName || "EMKAAV"}
                        </h3>
                        <p className="text-sm leading-relaxed mb-6">
                            Türkiye'nin en kapsamlı av malzemeleri mağazası. Kaliteli ürünler, güvenli alışveriş ve uzman desteği ile hizmetinizdeyiz.
                        </p>
                        <div className="flex space-x-4">
                            {settings?.facebookUrl && (
                                <Link href={settings.facebookUrl} target="_blank" className="hover:text-secondary transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                            )}
                            {settings?.instagramUrl && (
                                <Link href={settings.instagramUrl} target="_blank" className="hover:text-secondary transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                            )}
                            {settings?.twitterUrl && (
                                <Link href={settings.twitterUrl} target="_blank" className="hover:text-secondary transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-heading text-lg font-bold text-white mb-4">Hızlı Bağlantılar</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-secondary transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/contact" className="hover:text-secondary transition-colors">İletişim</Link></li>
                            <li><Link href="/blog" className="hover:text-secondary transition-colors">Blog</Link></li>
                            <li><Link href="/faq" className="hover:text-secondary transition-colors">Sıkça Sorulan Sorular</Link></li>
                            <li><Link href="/privacy" className="hover:text-secondary transition-colors">Gizlilik Politikası</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Categories */}
                    <div>
                        <h4 className="font-heading text-lg font-bold text-white mb-4">Kategoriler</h4>
                        <ul className="space-y-2 text-sm">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link href={`/category/${category.slug}`} className="hover:text-secondary transition-colors">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="font-heading text-lg font-bold text-white mb-4">İletişim</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
                                <span>{settings?.contactAddress || "Adres bilgisi girilmemiş"}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                                <span>{settings?.contactPhone || "Telefon bilgisi girilmemiş"}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                                <span>{settings?.contactEmail || "Email bilgisi girilmemiş"}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} {settings?.siteName || "KALE Av"}. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center space-x-4">
                        {/* Payment Icons Placeholder */}
                        <div className="h-8 w-12 bg-gray-700 rounded flex items-center justify-center text-xs">Visa</div>
                        <div className="h-8 w-12 bg-gray-700 rounded flex items-center justify-center text-xs">Master</div>
                        <div className="h-8 w-12 bg-gray-700 rounded flex items-center justify-center text-xs">Troy</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
