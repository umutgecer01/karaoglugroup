# Başlangıç durum raporu — 8 Kasım 2026

## Mevcut yapı

React 19, Vite 6.4.5, JavaScript/JSX, Tailwind 3, Lucide; TypeScript yok. 29 bileşen, TR/EN/AR çeviri dosyaları, hash tabanlı 14 görünüm, beş faaliyet detayı modal olarak sunuluyor. Netlify Forms iletişim ve CV formları, yerel JPEG görseller, tek MP4 mevcut. Tasarımın lacivert/turuncu kimliği ve şirket bilgileri korunacak.

Başlangıç `npm.cmd run build` ve `npm.cmd run lint:security`: başarılı. Ana JS 273.44 kB (gzip 85.09 kB), CSS 69.61 kB (gzip 13.51 kB). Ayrıntılı dosya boyutu/SHA256 envanteri `initial-file-inventory.json` içinde. `.audit` dizininde kaynak ve ilk build kopyası tutuldu. Çalışma dizininde `.git` bulunmadı; Git PATH üzerinde yok. Mevcut dosyalar temel alınarak ilerleniyor; geçmiş değiştirilmedi.

## Öncelikler

| Öncelik | Bulgu | Plan |
| --- | --- | --- |
| P0 | Üç formda await sonrası `event.currentTarget.reset()` null hedefe erişebilir; sunucu kabulünden sonra hata gösterilebilir. | Form referansını sakla, tekrar gönderimi kilitle, sahte yerel başarıyı engelle. |
| P0 | Netlify form algılama, bildirim alıcısı ve gerçek teslimat yerelden doğrulanamıyor. | Canlı veri göndermeden mock testleri; yayın engeli olarak raporla. |
| P1 | `replaceState` sayfa geçmişini siliyor; dil URL'de güncellenmiyor. | Kalıcı sayfa/dil URL'leri, geri/ileri, eski hash uyumluluğu. |
| P1 | Sitemap yalnızca ana sayfa; hash görünümleri arama motorlarına ayrı sayfa sunmuyor. | Yerelleştirilmiş yollar ve statik ön üretim. |
| P1 | Ana görsel lazy JS/Reveal arkasında; DeferredMount boş alanları yerleşim kaymasına yol açabilir. | Hero'yu erken sun; içeriği HTML'de üret. |
| P1 | Galerilerde srcset yok; tarım görselleri 396–463 kB. | Kaliteyi koruyan WebP ve mobil varyantları. |
| P1 | Video görünür alandan çıkınca durmuyor, kullanıcının durdurma kontrolü yok. | İstek üzerine native kontrollü oynatma. |
| P1 | Gizlilik penceresinde modal semantiğine rağmen odak yönetimi yok. Faaliyet modalında klavye/odak yönetimi yok. | Native dialog ile Escape, odak, arka plan ve scroll davranışı. |
| P2 | İngilizce görünümde title/description, 404, hero alt/caption, dil etiketi, menü ve yukarı butonu Türkçe. | Mevcut çevirileri tamamla; dil bazlı OG/canonical/hreflang. |
| P2 | Organization logo alanı logo yerine fotoğraf kullanıyor. | Gerçek logo dosyasını kullan. |
| P2 | Proje/referans ve görsel kökenlerinin doğrulaması için şirket kanıtı yok. | Yeni iddia üretmeden eksik bilgi listesi. |
| P3 | Gerçek cihaz, saha INP ve Netlify/CDN doğrulaması. | Yerel tarayıcı sonuçlarından ayrı raporla. |

Henüz ölçülmeyen Lighthouse, LCP, CLS, INP değerleri N/A. Hukuki içerik, şirket bilgileri ve fotoğraf kökenleri doğrulanmış kabul edilmiyor. Otomatik yayın veya gerçek form gönderimi yapılmayacak.
