# Karaoğlu Group - Canlı Netlify Yayını

## Canlı Adres

```text
https://karaoglugroupnet.netlify.app/
```

Bu proje React + Vite ile hazırlanır ve Netlify üzerinde `dist/` çıktısından yayınlanır.

## GitHub Akışı

- Repository: `https://github.com/umutgecer01/karaoglugroup.git`
- Ana branch: `main`
- CI: `.github/workflows/ci.yml`
- Güvenlik kontrolü: `.github/workflows/security.yml`
- Netlify deploy: `.github/workflows/netlify-deploy.yml`

## Netlify Deploy

GitHub Actions ile production deploy çalışması için repository secrets alanında şu değerler tanımlı olmalıdır:

```text
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

Secrets tanımlıysa `main` branch'e yapılan push sonrasında GitHub Actions build alır ve Netlify production adresine deploy eder.

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

Son güncelleme: 1 Temmuz 2026
