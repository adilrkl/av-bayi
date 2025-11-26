import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export async function TopBar() {
    const settings = await prisma.settings.findFirst()

    return (
        <div className="bg-primary text-primary-foreground py-2 text-sm">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
                <div className="flex items-center space-x-4 mb-2 md:mb-0">
                    {settings?.contactPhone && (
                        <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{settings.contactPhone}</span>
                        </div>
                    )}
                    {settings?.contactEmail && (
                        <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{settings.contactEmail}</span>
                        </div>
                    )}
                </div>
                {settings?.announcementText && (
                    <div className="hidden md:block text-xs font-medium tracking-wide">
                        {settings.announcementText}
                    </div>
                )}
                <div className="flex items-center space-x-6">
                    <div className="hidden md:flex items-center space-x-4 text-xs font-medium uppercase tracking-wider">
                        <Link href="/blog" className="hover:text-secondary transition-colors">
                            Blog
                        </Link>
                        <Link href="/contact" className="hover:text-secondary transition-colors">
                            İletişim
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        {settings?.facebookUrl && (
                            <Link href={settings.facebookUrl} target="_blank" className="hover:text-secondary transition-colors">
                                <Facebook className="h-4 w-4" />
                            </Link>
                        )}
                        {settings?.instagramUrl && (
                            <Link href={settings.instagramUrl} target="_blank" className="hover:text-secondary transition-colors">
                                <Instagram className="h-4 w-4" />
                            </Link>
                        )}
                        {settings?.twitterUrl && (
                            <Link href={settings.twitterUrl} target="_blank" className="hover:text-secondary transition-colors">
                                <Twitter className="h-4 w-4" />
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
