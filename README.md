# Karaoğlu Group Website

React + Vite tabanlı kurumsal Karaoğlu Group web sitesi.

## Kurulum

```bash
npm ci
npm run dev
```

## Production Build

```bash
npm run build
```

Build çıktısı `dist/` klasörüne üretilir.

Build, React statik ön üretimiyle 54 yerelleştirilmiş HTML sayfası oluşturur. `/tr/`, `/en/` ve mevcut Arapça içerik için `/ar/` yolları desteklenir. Eski hash bağlantıları tarayıcıda karşılık gelen yeni yola taşınır. Bilinmeyen yollar Netlify'da `404.html` ile 404 döner; sayfa bazlı SPA fallback gerekmiyor.

## Son kalite kontrolü ve form yapılandırması

```bash
npm run lint:security
npm test
npm run build
```

Windows PowerShell script politikası `npm` komutunu engellerse `npm.cmd` kullanın. Netlify ve mevcut CI Node 22 kullanır; yerel denetim Node 26.13.0 ile çalıştırıldı. Yeni uygulama bağımlılığı eklenmedi.

Formlar, alıcı ve Netlify Forms yapılandırması doğrulanana kadar gönderime kapalıdır; kullanıcı telefon/WhatsApp kanalına yönlendirilir. `.env.example` yalnızca public yapılandırmayı gösterir. Yetkili önizleme testinde form algılama, alıcı, spam klasörü ve CV erişimi doğrulandıktan sonra build ortamına `VITE_NETLIFY_FORMS_ENABLED=true` ekleyin. Gerçek test mesajı için ayrıca onay alın. GitHub Actions ile derleniyorsa bu public değişkeni ilgili workflow'nun build ortamına da eklemek gerekir; Netlify panelindeki değişkenler bağımsız GitHub build'ine otomatik taşınmaz. CV üst sınırı 7 MB'dır; Netlify Forms'un 8 MB toplam istek sınırı için pay bırakılır. Gizli anahtarları `VITE_` değişkenlerine koymayın.

Denetim sonuçları ve açık yayın engelleri: [Production readiness raporu](reports/PRODUCTION_READINESS_REPORT.md). Tarayıcı QA tekrarı için [QA yönergeleri](reports/QA.md).

Son release kontrolü: [FINAL_RELEASE_REPORT.md](reports/FINAL_RELEASE_REPORT.md). Formlar için güncel panel/onay sırası: [NETLIFY_PANEL_STEPS.md](reports/NETLIFY_PANEL_STEPS.md). `netlify.toml` içinde de `VITE_NETLIFY_FORMS_ENABLED=false` tutulur; bu değer Netlify panelindeki aynı isimli değere göre önceliklidir. Form teslimatı ve aktivasyon onayı olmadan değiştirmeyin.

Build sonrasında form HTML'i, yerelleştirilmiş metadata ve sitemap denetimi için `node --test scripts/release-static.test.mjs` çalıştırılabilir. `RELEASE_REPORT_DIR=reports/final-release` ortam değişkeni, tarayıcı testlerinin tarihsel raporları ezmeden yeni kanıtları ayrı dizine yazmasını sağlar.

## Proje Yapısı

- `src/data/translations.js` dil dosyalarını birleştiren küçük giriş noktasıdır.
- `src/data/translations/tr.js`, `en.js` ve `ar.js` içerikleri dil bazında ayrılmıştır.
- Netlify üretim yayını için tek dağıtım yapılandırması `netlify.toml` dosyasıdır.
- Canlı site adresi `site.config.mjs` içinde merkezi olarak tanımlanır.

## GitHub ve Netlify Entegrasyonu

Canlı Netlify adresi:

```text
https://karaoglugroupnet.netlify.app/
```

Bu adres build sırasında `index.html`, `robots.txt` ve `sitemap.xml` çıktılarıyla senkronlanır. Gerekirse `VITE_SITE_URL` ortam değişkeniyle override edilebilir.

GitHub Actions üzerinde CI, güvenlik kontrolü ve Netlify deploy iş akışı hazırdır.

- Repository: `https://github.com/umutgecer01/karaoglugroup.git`
- `main` branch'e push edildiğinde build ve güvenlik kontrolleri çalışır.
- `.github/workflows/netlify-deploy.yml`, `dist/` çıktısını Netlify production ortamına gönderir.
- Deploy için GitHub repository secrets alanında `NETLIFY_AUTH_TOKEN` ve `NETLIFY_SITE_ID` tanımlı olmalıdır.
- Netlify build ayarı `netlify.toml` içinde `npm run build` ve `dist` olarak yapılandırılmıştır.

## Mobil Uyum

Arayüz Tailwind responsive breakpoint'leriyle hazırlanmıştır. Ana kontrol noktaları:

- Mobil menü ve dil seçici
- Responsive grid/kart yapıları
- Filo kiralama video alanı
- Sabit mobil aksiyon barı
- Yatay taşma kontrolü

## SEO

`index.html`, `public/robots.txt` ve `public/sitemap.xml` canlı Netlify adresiyle uyumludur. Kalıcı özel domain bağlandığında `site.config.mjs` veya `VITE_SITE_URL` güncellenmelidir; `npm run build` öncesinde `npm run sync:site` otomatik çalışır.
