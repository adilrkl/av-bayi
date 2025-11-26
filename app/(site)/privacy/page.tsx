export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-heading font-bold mb-8">Gizlilik Politikası</h1>

            <div className="prose prose-gray max-w-none dark:prose-invert">
                <p>Son Güncelleme: 25 Kasım 2025</p>

                <h2>1. Giriş</h2>
                <p>
                    KALE Av Malzemeleri ("Şirket", "biz", "bizi" veya "bizim") olarak, gizliliğinize önem veriyoruz.
                    Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda kişisel verilerinizi nasıl topladığımızı,
                    kullandığımızı ve koruduğumuzu açıklar.
                </p>

                <h2>2. Toplanan Bilgiler</h2>
                <p>
                    Hizmetlerimizi kullanırken aşağıdaki bilgileri toplayabiliriz:
                </p>
                <ul>
                    <li>Kimlik Bilgileri (Ad, soyad)</li>
                    <li>İletişim Bilgileri (E-posta adresi, telefon numarası, adres)</li>
                    <li>İşlem Bilgileri (Sipariş geçmişi, ödeme bilgileri)</li>
                    <li>Teknik Bilgiler (IP adresi, tarayıcı türü, cihaz bilgileri)</li>
                </ul>

                <h2>3. Bilgilerin Kullanımı</h2>
                <p>
                    Topladığımız bilgileri aşağıdaki amaçlarla kullanabiliriz:
                </p>
                <ul>
                    <li>Siparişlerinizi işlemek ve teslim etmek</li>
                    <li>Müşteri hizmetleri desteği sağlamak</li>
                    <li>Size özel teklifler ve kampanyalar sunmak (izniniz dahilinde)</li>
                    <li>Web sitemizi ve hizmetlerimizi geliştirmek</li>
                    <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                </ul>

                <h2>4. Bilgi Paylaşımı</h2>
                <p>
                    Kişisel verilerinizi, yasal zorunluluklar veya hizmet sağlayıcılarımızla (kargo firmaları, ödeme altyapıları vb.)
                    işbirliği gerektiren durumlar dışında üçüncü taraflarla paylaşmayız.
                </p>

                <h2>5. Güvenlik</h2>
                <p>
                    Verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri (SSL şifreleme vb.) kullanmaktayız.
                    Ancak, internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olmadığını unutmayınız.
                </p>

                <h2>6. İletişim</h2>
                <p>
                    Gizlilik politikamızla ilgili sorularınız için <a href="/contact" className="text-primary hover:underline">İletişim</a> sayfamızdan bize ulaşabilirsiniz.
                </p>
            </div>
        </div>
    )
}
