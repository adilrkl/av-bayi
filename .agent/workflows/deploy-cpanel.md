---
description: cPanel'de Node.js ile deployment yapma
---

# cPanel Node.js Deployment Rehberi

Bu rehber, Next.js projenizi cPanel'de Node.js desteği olan bir hosting üzerinde nasıl deploy edeceğinizi adım adım anlatır.

## Ön Gereksinimler

- [ ] cPanel hesabınızda Node.js Application Manager erişimi
- [ ] MySQL veritabanı erişimi
- [ ] SSH veya FTP erişimi
- [ ] Domain veya subdomain hazır

## 1. Local Hazırlık

### 1.1. Build Testi
Local'de production build testini yapın:
```bash
npm run build
npm start
```

Eğer hatalar varsa düzeltin.

### 1.2. Database Konfigürasyonu Güncelleme
SQLite yerine MySQL kullanmak için `prisma/schema.prisma` dosyasını düzenleyin:

```prisma
datasource db {
  provider = "mysql"  // "sqlite" yerine "mysql"
  url      = env("DATABASE_URL")
}
```

### 1.3. Environment Variables Hazırlama
`.env.production` dosyası oluşturun:
```env
# cPanel'deki MySQL bilgileriniz
DATABASE_URL="mysql://kullanici_adi:sifre@localhost:3306/veritabani_adi"

# NextAuth konfigürasyonu
NEXTAUTH_URL="https://yoursite.com"
NEXTAUTH_SECRET="guclu_random_string_32_karakter"

# Diğer environment variables
```

## 2. cPanel'de Hazırlık

### 2.1. MySQL Veritabanı Oluşturma
1. cPanel → **MySQL Databases**
2. Yeni veritabanı oluşturun: `kullanici_avbayi`
3. Yeni kullanıcı oluşturun ve şifre belirleyin
4. Kullanıcıyı veritabanına ekleyin (tüm yetkiler)
5. Bağlantı bilgilerini kaydedin

### 2.2. Node.js Application Oluşturma
1. cPanel → **Setup Node.js App**
2. **Create Application** tıklayın
3. Ayarlar:
   - **Node.js version**: 18.x veya üzeri
   - **Application mode**: Production
   - **Application root**: `av_bayi` (veya istediğiniz klasör adı)
   - **Application URL**: domain.com veya subdomain.com
   - **Application startup file**: `server.js` (oluşturacağız)

## 3. Dosyaları Yükleme

### 3.1. Gerekli Dosyaları Hazırlama
Şu dosyaları **yüklemeyeceksiniz**:
- `node_modules/` (sunucuda kurulacak)
- `.next/` (sunucuda build edilecek)
- `dev.db` (SQLite dosyası)
- `.git/` (opsiyonel)

### 3.2. FTP/SSH ile Yükleme
**Yüklenecek dosyalar:**
```
av_bayi/
  ├── app/
  ├── components/
  ├── lib/
  ├── prisma/
  ├── public/
  ├── store/
  ├── types/
  ├── .env
  ├── next.config.ts
  ├── package.json
  ├── tsconfig.json
  ├── components.json
  ├── postcss.config.mjs
  ├── eslint.config.mjs
  └── server.js (YENİ - oluşturacağız)
```

### 3.3. Server.js Oluşturma
cPanel için özel `server.js` dosyası oluşturun (local'de):

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

## 4. cPanel'de Deployment

### 4.1. Environment Variables Ayarlama
1. cPanel → **Setup Node.js App** → Uygulamanızı seçin
2. **Environment Variables** bölümüne gidin
3. Her bir değişkeni ekleyin:
   ```
   DATABASE_URL = mysql://...
   NEXTAUTH_URL = https://yoursite.com
   NEXTAUTH_SECRET = ...
   ```

### 4.2. Dependencies Kurma
SSH ile bağlanın veya cPanel Terminal kullanın:

```bash
cd av_bayi
source /home/kullanici/nodevenv/av_bayi/18/bin/activate
npm install
```

> **Not:** cPanel otomatik olarak Node.js için virtual environment oluşturur. `source` komutunu cPanel'deki Node.js App Manager'da görebilirsiniz.

### 4.3. Prisma Setup
```bash
# Prisma client oluştur
npx prisma generate

# Database migration çalıştır
npx prisma migrate deploy

# (Opsiyonel) Seed data yükle
npx prisma db seed
```

### 4.4. Next.js Build
```bash
npm run build
```

Bu işlem birkaç dakika sürebilir. `.next` klasörü oluşacak.

### 4.5. Application Başlatma
1. cPanel → **Setup Node.js App** → Uygulamanıza dön
2. **Restart** butonuna tıklayın
3. Application otomatik başlayacak

## 5. Domain/Subdomain Ayarları

### 5.1. Subdomain ile
cPanel'de subdomain oluşturduysanız, otomatik olarak bağlanır.

### 5.2. Ana Domain ile
1. cPanel → **Domains** → Ana domaininizi seçin
2. Document Root'u Node.js application klasörüne yönlendirin
3. `.htaccess` dosyası oluşturun (cPanel otomatik yapabilir)

## 6. SSL Sertifikası (HTTPS)

1. cPanel → **SSL/TLS Status**
2. Domain seçin → **AutoSSL** çalıştırın
3. Veya **Let's Encrypt** kullanın

## 7. Verification (Test)

### 7.1. Application Durumunu Kontrol
```bash
# SSH ile
source /home/kullanici/nodevenv/av_bayi/18/bin/activate
cd av_bayi
node server.js
```

### 7.2. Browser'da Test
1. `https://yoursite.com` adresini açın
2. Ana sayfa yüklenmeli
3. Login/Register test edin
4. Admin panel test edin
5. Ürün ekleme/düzenleme test edin

### 7.3. Log Kontrolü
cPanel → **Setup Node.js App** → **Application Logs** bölümünden hataları kontrol edin

## 8. Sorun Giderme

### Problem: "Internal Server Error"
**Çözüm:**
- Environment variables doğru mu kontrol edin
- Application logs kontrol edin
- `npm run build` hatasız tamamlandı mı?

### Problem: Database bağlantı hatası
**Çözüm:**
- `DATABASE_URL` doğru mu?
- MySQL kullanıcısının yetkileri var mı?
- `prisma generate` ve `prisma migrate deploy` çalıştırıldı mı?

### Problem: Port 3000 already in use
**Çözüm:**
- cPanel'de restart yapın
- SSH'den process'i kontrol edin: `ps aux | grep node`
- Gerekirse kill edin: `pkill -f node`

### Problem: 502 Bad Gateway
**Çözüm:**
- Application çalışıyor mu kontrol edin
- cPanel Node.js App Manager'da restart yapın
- nginx/apache konfigürasyonu doğru mu?

## 9. Güncelleme (Update)

Kod değişiklikleri yaptığınızda:

```bash
# 1. Yeni dosyaları FTP/SSH ile yükleyin
# 2. SSH'ye bağlanın
source /home/kullanici/nodevenv/av_bayi/18/bin/activate
cd av_bayi

# 3. Dependencies güncelle (gerekirse)
npm install

# 4. Database migration (gerekirse)
npx prisma migrate deploy

# 5. Rebuild
npm run build

# 6. Application restart (cPanel'den veya)
touch tmp/restart.txt  # Passenger için
```

## 10. Performance İyileştirmeleri

### 10.1. PM2 Kullanımı (Eğer SSH erişiminiz varsa)
```bash
npm install -g pm2
pm2 start server.js --name av-bayi
pm2 save
pm2 startup
```

### 10.2. Image Optimization
`next.config.ts` dosyasında:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'yoursite.com',
    },
  ],
}
```

### 10.3. Caching
`.htaccess` veya nginx config'de browser caching aktifleştirin.

## 📋 Checklist

- [ ] MySQL veritabanı oluşturuldu
- [ ] `schema.prisma` MySQL'e güncellendi
- [ ] `.env.production` dosyası hazırlandı
- [ ] `server.js` dosyası oluşturuldu
- [ ] Dosyalar cPanel'e yüklendi
- [ ] Environment variables ayarlandı
- [ ] `npm install` çalıştırıldı
- [ ] `prisma generate` ve `migrate deploy` çalıştırıldı
- [ ] `npm run build` başarılı
- [ ] Application restart edildi
- [ ] SSL sertifikası kuruldu
- [ ] Site browser'da test edildi

## 🎉 Tebrikler!

Projeniz cPanel'de başarıyla deploy edildi!

**Faydalı Linkler:**
- cPanel Documentation: https://docs.cpanel.net/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Production: https://www.prisma.io/docs/guides/deployment
