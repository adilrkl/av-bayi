import { prisma } from "@/lib/prisma"
import { ContactForm } from "@/components/contact/contact-form"

async function getSettings() {
    const settings = await prisma.settings.findFirst()
    return settings
}

export default async function ContactPage() {
    const settings = await getSettings()
    return <ContactForm settings={settings} />
}
