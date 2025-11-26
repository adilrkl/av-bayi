import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clean up existing data
    await prisma.product.deleteMany({})
    await prisma.category.deleteMany({})

    // Create Categories
    const categoriesData = [
        { name: 'Av Tüfekleri', slug: 'av-tufekleri', image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Av Fişekleri', slug: 'av-fisekleri', image: 'https://images.unsplash.com/photo-1550155851-4f1035928436?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Av Malzemeleri', slug: 'av-malzemeleri', image: 'https://images.unsplash.com/photo-1598522194578-ef45c4bad2c4?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Havalı Silahlar', slug: 'havali-silahlar', image: 'https://images.unsplash.com/photo-1572511443047-72211cd6186c?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Optik & Elektronik', slug: 'optik-elektronik', image: 'https://images.unsplash.com/photo-1599522316574-7254b5b92e79?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Kamp Malzemeleri', slug: 'kamp-malzemeleri', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Tabanca Ekipmanları', slug: 'tabanca-ekipmanlari', image: 'https://images.unsplash.com/photo-1585562104134-11e84c3b7c96?auto=format&fit=crop&q=80&w=1000' },
        { name: 'Modifiye', slug: 'modifiye', image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1000' },
        { name: 'İkinci El Av Tüfekleri', slug: 'ikinci-el-av-tufekleri', image: 'https://images.unsplash.com/photo-1583096114844-065dc6a79540?auto=format&fit=crop&q=80&w=1000' },
    ]

    const createdCategories: Record<string, any> = {}

    for (const cat of categoriesData) {
        const created = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { image: cat.image, name: cat.name },
            create: cat,
        })
        createdCategories[cat.slug] = created
    }

    // Subcategories (Example for Av Tüfekleri)
    if (createdCategories['av-tufekleri']) {
        await prisma.category.upsert({
            where: { slug: 'yari-otomatik' },
            update: { name: 'Yarı Otomatik', parentId: createdCategories['av-tufekleri'].id },
            create: { name: 'Yarı Otomatik', slug: 'yari-otomatik', parentId: createdCategories['av-tufekleri'].id },
        })
        await prisma.category.upsert({
            where: { slug: 'superpoze' },
            update: { name: 'Süperpoze', parentId: createdCategories['av-tufekleri'].id },
            create: { name: 'Süperpoze', slug: 'superpoze', parentId: createdCategories['av-tufekleri'].id },
        })
    }

    // Create Products
    const products = [
        // Av Tüfekleri
        {
            name: 'Super Hunter 12G Yarı Otomatik Av Tüfeği',
            slug: 'super-hunter-12g',
            description: 'Yüksek performanslı, dayanıklı ve hafif alaşımlı gövdeye sahip yarı otomatik av tüfeği. Her türlü hava koşulunda güvenilir atış imkanı sunar.',
            price: 18500,
            stock: 15,
            categoryId: createdCategories['av-tufekleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1625631980836-274577e39073?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'Pro Hunter Süperpoze',
            slug: 'pro-hunter-over-under',
            description: 'Klasik tasarım, ceviz kundak ve işlemeli gövde. Dengeli ve hassas atışlar için mükemmel seçim.',
            price: 24000,
            stock: 8,
            categoryId: createdCategories['av-tufekleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1000']),
        },
        // Av Fişekleri
        {
            name: 'Magnum 12 Cal. Fişek (25\'li Paket)',
            slug: 'magnum-12-cal-ammo',
            description: 'Yüksek etkili, uzun menzilli av fişeği. Ördek ve kaz avı için idealdir.',
            price: 450,
            stock: 100,
            categoryId: createdCategories['av-fisekleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1550155851-4f1035928436?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'Trap Fişeği 24gr (25\'li Paket)',
            slug: 'trap-ammo-24gr',
            description: 'Atıcılık sporu için özel olarak üretilmiş, düşük geri tepmeli trap fişeği.',
            price: 320,
            stock: 200,
            categoryId: createdCategories['av-fisekleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&q=80&w=1000']),
        },
        // Av Malzemeleri
        {
            name: 'Tactical Camo Avcı Yeleği',
            slug: 'tactical-camo-vest',
            description: 'Çok cepli, dayanıklı kumaştan üretilmiş, kamuflaj desenli avcı yeleği. Mühimmat ve ekipmanlarınız için geniş depolama alanı.',
            price: 1250,
            stock: 50,
            categoryId: createdCategories['av-malzemeleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1598522194578-ef45c4bad2c4?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'Su Geçirmez Avcı Botu',
            slug: 'waterproof-hunting-boots',
            description: 'Zorlu arazi koşullarına uygun, su geçirmez ve nefes alabilir membranlı avcı botu.',
            price: 3800,
            stock: 30,
            categoryId: createdCategories['av-malzemeleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000']),
        },
        // Havalı Silahlar
        {
            name: 'AirMaster 5.5mm Havalı Tüfek',
            slug: 'airmaster-55mm-air-rifle',
            description: 'Yüksek çıkış hızı ve isabet oranı sunan, kırma namlulu havalı tüfek. Hobi atıcılığı için ideal.',
            price: 4500,
            stock: 20,
            categoryId: createdCategories['havali-silahlar'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1572511443047-72211cd6186c?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'CO2 Blowback Havalı Tabanca',
            slug: 'co2-blowback-air-pistol',
            description: 'Gerçekçi geri tepme hissi veren, metal gövdeli CO2 tüplü havalı tabanca.',
            price: 3200,
            stock: 15,
            categoryId: createdCategories['havali-silahlar'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1000']),
        },
        // Optik & Elektronik
        {
            name: 'Eagle Eye 3-9x40 Dürbün',
            slug: 'eagle-eye-scope',
            description: 'Uzun mesafeli atışlar için tasarlanmış, net görüntü sağlayan, su ve buğu geçirmez optik dürbün.',
            price: 4250,
            stock: 25,
            categoryId: createdCategories['optik-elektronik'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1599522316574-7254b5b92e79?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'Gece Görüş Dürbünü NV-200',
            slug: 'night-vision-nv200',
            description: 'Karanlıkta net görüş sağlayan, dijital gece görüş dürbünü. Kayıt özelliği ile av anılarınızı ölümsüzleştirin.',
            price: 12000,
            stock: 5,
            categoryId: createdCategories['optik-elektronik'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1563606676878-5a26a5754948?auto=format&fit=crop&q=80&w=1000']),
        },
        // Kamp Malzemeleri
        {
            name: '4 Mevsim Kamp Çadırı (3 Kişilik)',
            slug: '4-season-camping-tent',
            description: 'Zorlu hava koşullarına dayanıklı, su geçirmez ve kolay kurulabilen 3 kişilik kamp çadırı.',
            price: 5500,
            stock: 10,
            categoryId: createdCategories['kamp-malzemeleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'Termal Uyku Tulumu (-10C)',
            slug: 'thermal-sleeping-bag',
            description: 'Soğuk havalarda vücut ısısını koruyan, hafif ve kompakt uyku tulumu.',
            price: 2800,
            stock: 30,
            categoryId: createdCategories['kamp-malzemeleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1526725702345-bdda2b97ef73?auto=format&fit=crop&q=80&w=1000']),
        },
        // Tabanca Ekipmanları
        {
            name: 'Polimer Tabanca Kılıfı',
            slug: 'polymer-gun-holster',
            description: 'Hızlı çekim imkanı sunan, kilitli mekanizmaya sahip dayanıklı polimer tabanca kılıfı.',
            price: 850,
            stock: 40,
            categoryId: createdCategories['tabanca-ekipmanlari'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1585562104134-11e84c3b7c96?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'Tabanca Temizlik Seti',
            slug: 'gun-cleaning-kit',
            description: 'Tüm tabanca modelleri için uygun, kapsamlı bakım ve temizlik seti.',
            price: 450,
            stock: 60,
            categoryId: createdCategories['tabanca-ekipmanlari'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1000']),
        },
        // Modifiye
        {
            name: 'Taktik El Kundağı',
            slug: 'tactical-handguard',
            description: 'Aksesuar montajı için ray sistemine sahip, ergonomik taktik el kundağı.',
            price: 1500,
            stock: 20,
            categoryId: createdCategories['modifiye'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1615587782505-52d3aa77326a?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'Ayarlanabilir Dipçik',
            slug: 'adjustable-stock',
            description: 'Kullanıcı boyuna göre ayarlanabilen, darbe emici özellikli taktik dipçik.',
            price: 2200,
            stock: 15,
            categoryId: createdCategories['modifiye'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1583096114844-065dc6a79540?auto=format&fit=crop&q=80&w=1000']),
        },
        // İkinci El Av Tüfekleri
        {
            name: 'İkinci El Klasik Çifte (Bakımlı)',
            slug: 'used-classic-double-barrel',
            description: 'Özenle kullanılmış, bakımları yapılmış, koleksiyonluk değerde klasik çifte av tüfeği.',
            price: 18000,
            stock: 1,
            categoryId: createdCategories['ikinci-el-av-tufekleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1583096114844-065dc6a79540?auto=format&fit=crop&q=80&w=1000']),
        },
        {
            name: 'İkinci El Yarı Otomatik (Az Kullanılmış)',
            slug: 'used-semi-auto',
            description: 'Sadece bir sezon kullanılmış, sıfır ayarında yarı otomatik av tüfeği.',
            price: 12500,
            stock: 1,
            categoryId: createdCategories['ikinci-el-av-tufekleri'].id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1000']),
        }
    ]

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {
                images: product.images,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                categoryId: product.categoryId
            },
            create: product,
        })
    }

    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
