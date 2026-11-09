# Karaoğlu Group Website

React + Vite tabanlı kurumsal Karaoğlu Group web sitesi.

Güncel operasyon belgeleri: [son kapsamlı durum](reports/KARAOGLU_FINAL_OPERATIONS_REPORT.md), [yayın rehberi](DEPLOYMENT_GUIDE.md), [GitHub/Netlify mimarisi](GITHUB_NETLIFY_ARCHITECTURE.md), [yayın checklist](PRODUCTION_RELEASE_CHECKLIST.md), [geri dönüş](ROLLBACK_GUIDE.md), [form işletimi](FORM_OPERATIONS_GUIDE.md), [kurumsal teyit](CORPORATE_CONTENT_REVIEW.md), [medya hakları](MEDIA_RIGHTS_REVIEW.md) ve [Search Console](SEARCH_CONSOLE_GUIDE.md).

Ana çalışma klasörü bu dizindir; Git geçmişi ve `origin` bağlantısı buradadır. Güncel uygulama `src/` ve `public/` üzerinden build edilir. Kardeş `release/` klasörü eski checkout'tur; yeni düzenlemeleri burada yapın.

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

Windows PowerShell script politikası `npm` komutunu engellerse `npm.cmd` kullanın. Netlify, CI ve güncel yerel doğrulamalar Node 22 kullanır.

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
- Geliştirme dalı `release/karaoglu-final-2026-11-08`, inceleme kaydı PR #1'dir. Commit ve push sonrasında CI/CodeQL çalışır, `karaoglugroupnet` Netlify projesi yeni Deploy Preview üretir; mevcut canlı deployment kilitli kalır.
- Tamamlanan değişikliği test edip kaydetmek ve GitHub'a göndermek için: `npm run sync:preview -- "Değişikliği açıklayan mesaj"`. PowerShell'de gerekirse `npm.cmd` kullanın. Script main/yanlış remote gönderimini, yerel araçları/credentials ve ham test çıktılarının kaydını engeller. GitHub kimlik doğrulaması yoksa token istemeden durur.
- Script dosya kaydında arka planda çalışmaz; tamamlanan değişiklik için çağrılır. Codex çalışma kuralı `AGENTS.md` içinde her tamamlanan değişiklikte bu akışı uygulamasını belirtir. Commit geçmişi GitHub'da, preview/build geçmişi Netlify'da saklanır.
- Preview ve production aynı `karaoglugroupnet` projesindedir, ID `b4753086-eb94-4a7e-b5f5-7270835fab3a`. Git build açık, canlı deployment kilitlidir; yeni build canlı içeriği otomatik değiştirmez. Diğer `karaoglugroup` projesi (`80b58d06-0cbb-432c-8193-17d34ba776df`) silinmeden korundu.
- `.github/workflows/netlify-deploy.yml` **yalnızca manuel** çalıştırılır; main push otomatik production yayını tetiklemez. Production için ayrıca açık kullanıcı onayı gerekir. Repo bağlantısı, secrets veya main merge bu senkronizasyonun parçası değildir.
- GitHub Actions production credentials/environment henüz kurulmadı; hazırmış gibi değerlendirmeyin. Onaylı yayın mevcut yetkili Netlify CLI oturumuyla, doğru eski Project ID ve ayrı production-context paketle ve ayrıca onaylanmış yayın kilidi yönetimiyle yapılabilir. Kilit otomatik kaldırılmaz.
- Netlify build ayarı `netlify.toml` içinde `npm run build` ve `dist` olarak yapılandırılmıştır.

Son canlı yayın: [PRODUCTION_DEPLOYMENT_REPORT.md](reports/PRODUCTION_DEPLOYMENT_REPORT.md). Formlar teslimat/KVKK ve ayrı aktivasyon onayına kadar `false` kalır.

## Mobil Uyum

Arayüz Tailwind responsive breakpoint'leriyle hazırlanmıştır. Ana kontrol noktaları:

- Mobil menü ve dil seçici
- Responsive grid/kart yapıları
- Filo kiralama video alanı
- Sabit mobil aksiyon barı
- Yatay taşma kontrolü

## SEO

`index.html`, `public/robots.txt` ve `public/sitemap.xml` canlı Netlify adresiyle uyumludur. Kalıcı özel domain bağlandığında `site.config.mjs` veya `VITE_SITE_URL` güncellenmelidir; `npm run build` öncesinde `npm run sync:site` otomatik çalışır.
