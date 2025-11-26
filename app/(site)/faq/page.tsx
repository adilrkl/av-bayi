import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    const faqs = [
        {
            question: "Siparişim ne zaman kargoya verilir?",
            answer: "Siparişleriniz genellikle 24 saat içinde kargoya verilir. Hafta sonu ve resmi tatillerde verilen siparişler ilk iş günü işleme alınır."
        },
        {
            question: "İade ve değişim koşulları nelerdir?",
            answer: "Satın aldığınız ürünleri, kullanılmamış ve orijinal ambalajı bozulmamış olması şartıyla 14 gün içinde iade edebilir veya değiştirebilirsiniz."
        },
        {
            question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
            answer: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeleriniz 256-bit SSL sertifikası ile korunmaktadır."
        },
        {
            question: "Tüfek satın almak için hangi belgelere ihtiyacım var?",
            answer: "Yivsiz av tüfeği satın almak için 'Yivsiz Tüfek Satın Alma Belgesi'ne sahip olmanız gerekmektedir. Bu belgeyi Emniyet Müdürlüğü veya Jandarma Komutanlığı'ndan alabilirsiniz."
        },
        {
            question: "Kargo ücreti ne kadar?",
            answer: "1000 TL ve üzeri alışverişlerinizde kargo ücretsizdir. Bu tutarın altındaki siparişlerinizde sabit kargo ücreti uygulanır."
        }
    ]

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-heading font-bold mb-8 text-center">Sıkça Sorulan Sorular</h1>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
