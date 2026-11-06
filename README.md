# Karaoğlu Grup Website

React + Vite tabanlı kurumsal Karaoğlu Grup web sitesi.

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

## GitHub Entegrasyonu

`.github/workflows/ci.yml` ile GitHub Actions üzerinde otomatik build kontrolü aktiftir.

- `main` branch'e push edildiğinde build çalışır.
- `main` branch'e açılan pull request'lerde build çalışır.
- Deploy için Netlify veya Vercel `npm run build` komutunu ve `dist` çıktısını kullanır.

## Mobil Uyum

Arayüz Tailwind responsive breakpoint'leriyle hazırlanmıştır. Ana kontrol noktaları:

- Mobil menü ve dil seçici
- Responsive grid/kart yapıları
- Filo kiralama video alanı
- Sabit mobil aksiyon barı
- Yatay taşma kontrolü

## SEO

`public/robots.txt` ve `public/sitemap.xml` canlı site indekslemesine uygun yapıdadır. Canlı domain değişirse `public/sitemap.xml` içindeki URL güncellenmelidir.
