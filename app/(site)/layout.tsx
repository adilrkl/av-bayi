import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import { ScrollToTop } from "@/components/ui/scroll-to-top"

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
        </div>
    )
}
