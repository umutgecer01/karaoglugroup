# Karaoğlu Group — GitHub kayıt, preview ve onaylı yayın

## Canlı Adres

```text
https://karaoglugroupnet.netlify.app/
```

Bu proje React + Vite ile hazırlanır ve Netlify üzerinde `dist/` çıktısından yayınlanır.

## GitHub Akışı

- Repository: `https://github.com/umutgecer01/karaoglugroup.git`
- Geliştirme dalı: `release/karaoglu-final-2026-11-08`; PR #1 üzerinden incelenir.
- Ana branch: `main`; doğrudan push veya otomatik merge yapılmaz.
- CI: `.github/workflows/ci.yml`
- Güvenlik kontrolü: `.github/workflows/security.yml`
- Netlify deploy: `.github/workflows/netlify-deploy.yml`

## Netlify Deploy

Tamamlanan düzenlemeyi kaydetmek için `npm run sync:preview -- "Değişiklik açıklaması"` çalıştırılır. Node 22 kontrolleri geçerse commit/push yapılır. Mevcut PR güncellenir ve Netlify geliştirme projesi `80b58d06-0cbb-432c-8193-17d34ba776df` otomatik preview oluşturur.

Güncel preview: `https://deploy-preview-1--karaoglugroup.netlify.app/`. Sonucun güncel commit'e ait olduğu PR durumundan doğrulanmalıdır.

GitHub Actions production yayını **yalnızca manuel** workflow_dispatch ile mümkündür; mevcut hesapta aşağıdaki credentials/environment kurulumu yapılmadı:

```text
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

Main push artık production deploy tetiklemez. Canlı site için her sürümde ayrıca açık kullanıcı onayı gerekir. Eski production Project ID `b4753086-eb94-4a7e-b5f5-7270835fab3a`; eski Git build'leri kapalı tutulur. Onaylı canlı sürüm ayrı production-context paketle bu açık Project ID'ye gönderilir; preview noindex paketi kullanılmaz. Secrets, repo bağlantısı veya DNS bu otomasyon tarafından değiştirilmez.

## SEO ve Canlı URL

Canlı Netlify adresi `site.config.mjs` içinde merkezi olarak tanımlıdır. Build öncesinde `npm run sync:site` çalışır ve public SEO dosyalarını aynı adrese göre günceller.

Canlı URL entegrasyonunda kullanılan dosyalar:

- `site.config.mjs`
- `scripts/sync-site-metadata.mjs`
- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `netlify.toml`
- `.github/workflows/netlify-deploy.yml`

Kalıcı özel domain bağlanırsa `site.config.mjs` veya `VITE_SITE_URL` yeni domainle güncellenmelidir.

## Çalışan İşlevler

| İşlev | Link |
|-------|------|
| Hemen Ara | `tel:+905444438000` |
| WhatsApp | `https://wa.me/905444438000` |
| Yol Tarifi | Google Maps |
| Instagram | `https://www.instagram.com/karaoglugroup01/` |
| Facebook | `https://www.facebook.com/karaogluuotomotiv/` |

## Kontrol Komutları

```bash
npm run build
npm run lint:security
```

Son güncelleme: 9 Kasım 2026. Form flag'i `VITE_NETLIFY_FORMS_ENABLED=false` olarak korunur.
