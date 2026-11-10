# Tarım ve İnşaat görsel entegrasyonu

10 Kasım 2026. Mevcut release dalında çalışıldı. Canlı yayın yapılmadı; formlar kapalıdır. Kaynaklar kullanıcının sağladığı dokuz dosyadır; çekim yeri, tarihi, şirket mülkiyeti veya bağımsız gerçeklik doğrulaması hakkında iddia eklenmedi.

## 1. Değiştirilen Tarım görselleri

Eski üç görselin tüm aktif referansları kaldırıldı. Altı yeni görsel kullanıldı. Detay sayfasında ilk görsel T3, ana sayfa tarım kartında ilk görsel T4'tür. Galerinin detay sırası T3, T1, T2, T4, T5, T6; üç dilde aynıdır.

| Kod | Yüklenen dosyanın saat/sıra son eki | Yeni dosya kökü | İçerik |
| --- | --- | --- | --- |
| T1 | 16_36_04-1.png | agriculture-harvest-yellow | Sarı biçerdöver ve sarı kamyona tahıl aktarımı |
| T2 | 16_36_06-2.png | agriculture-sunflower-field | Ayçiçeği tarlası ve biçerdöver |
| T3 | 16_36_08-3.png | agriculture-grain-transfer | Kırmızı biçerdöver ve yeşil kamyon |
| T4 | 16_36_09-4.png | agriculture-wheat-harvest | Buğday hasadında kırmızı biçerdöver |
| T5 | 16_36_10-5.png | agriculture-fertilizer-storage | Depoda gübre çuvalları |
| T6 | 16_36_12-6.png | agriculture-roadside-harvest | Yol kenarında ürün aktarımı |

## 2. Yeni eklenen İnşaat görselleri

| Kod | Yüklenen dosyanın saat/sıra son eki | Yeni dosya kökü | İçerik |
| --- | --- | --- | --- |
| I1 | 16_36_13-7.png | construction-tower-interior | Dairesel beton yapı içi ve mavi merdivenler |
| I2 | 16_36_15-8.png | construction-tower-exterior | Aynı yapının dış görünümü |
| I3 | 16_36_16-9.png | construction-generator-installation | Vinç ve jeneratörlü saha kurulumu |

Mevcut üç fotoğrafın arkasına eklendiler. Proje sahipliği/üstlenilen iş iddiası yazılmadı.

## 3. Dosya yapısı

Tarım kaynakları `public/images/agriculture/real/`, İnşaat kaynakları `public/images/construction/real/` altında. Tablodaki köklerden JPEG fallback, genişlik son ekli WebP ve AVIF dosyaları üretildi. Merkezi galeri ve medya manifesti kullanıldı. Orijinaller Downloads altında korunuyor; SHA-256 doğrulamalı ek yedek `.audit/photo-integration-2026-11-10/originals/` altında, Git/publish dışında.

## 4. Optimizasyon

Dokuz PNG toplam 26.643.124 bayttır. 31 WebP, 31 AVIF ve 9 JPEG fallback üretildi; 71 dosyanın tamamı decode edilerek boyutları doğrulandı. Portrelerde 480/768/1086, yataylarda 480/768/1200/1448 px kullanıldı; kaynaklar 1600 px'e büyütülmedi. JPEG kalite 90, WebP 84, AVIF 60; codec ölçekleri doğrudan eşdeğer değildir.

Dokuz görselin 768 px WebP toplamı 1.274.258, AVIF toplamı 796.372 bayt; AVIF bu çözünürlükte yaklaşık %37,5 daha küçüktür. Bu dosya boyutu karşılaştırmasıdır, algısal kalite eşitliği ölçümü değildir. JPEG fallback toplamı 3.581.273 bayt. Tarayıcı uygun kaynak ve boyutu `picture/srcset/sizes` üzerinden seçiyor.

Renk, gökyüzü, araç, kişi veya yapı değiştirilmedi; perspektif ve filtre uygulanmadı. Doğal görünüm korundu. Çıktılarda EXIF/XMP bulunmadığı kontrol edildi. Görsellerde boyutlar tanımlı; Tarım ilk görseli eager/high, alt görseller lazy. Detayda contain, ana sayfa kartında görsel bazında object-position ile cover kullanılıyor.

## 5. Mobil sonuçlar

54 sayfa × 11 genişlik: 320–1920 px aralığında **594/594** kontrol geçti. Yatay taşma ve görünür kırık görsel yok. 390 px ekran görüntüleri incelendi. Fiziksel telefon ve dokunmatik donanım testi yapılmadı.

## 6. Masaüstü sonuçlar

1440 px detay ve ana sayfa ekran görüntüleri incelendi. Portre biçerdöver ve beton yapı detayda tamamen gösteriliyor. Ana sayfanın otomatik yatay galerisi korunuyor; hareket tarayıcıda doğrulandı, duraklatma düğmesi eklenmedi. Diğer sektörlerin merkezi galeri verileri başlangıç sürümüyle aynı.

## 7. Dil kontrolleri

TR/EN/AR'da aynı kaynak ve sıralama kullanılıyor. 36 detay görseli, 27 yeni başlık/alt metin ve 15 yerleşim/ana sayfa kontrolü geçti. Arapça RTL ve locale anahtar eşliği mevcut testlerde başarılı.

## 8. Silinen eski referanslar

`agriculture-1/2/3.jpg` ve bunların `-640.webp`, `-1408.webp` türevleri: toplam dokuz kullanılmayan dosya referans taramasından sonra yedeklenip kaldırıldı. Aktif src/public kaynaklarında eski Tarım yolları kalmadı. Tarihsel raporlar geçmiş kanıtı olarak korundu.

## 9. Korunan İnşaat görselleri

`construction-1.jpg`, `construction-2.jpg`, `construction-3.jpg`, mevcut türevleri, sıraları ve metinleri korundu. İnşaat toplam altı görseldir. Otomotiv, Petrol ve Kiralama fotoğrafları değiştirilmedi.

## 10. Build ve testler

Node 22.23.4: build başarılı; regresyon **29/29**, production statik kontroller **4/4**, lint/security ve npm audit başarılı, bilinen audit bulgusu **0**. Son kaynak üzerinde 594 responsive kontrol, 163 dahili kaynak kontrolü, SEO/dil/404 taraması geçti; runtime/console hatası yok. 71 medya çıktısı doğrulandı. Gerçek form gönderilmedi.

Yerel ayrıntılı JSON/PNG kanıtları `reports/photo-integration/` altında tutulur ve Git'e eklenmez. Yeni gerçek cihaz, Safari/Firefox, form teslimatı ve saha INP ölçümü yapılmadı. Netlify önizleme/performance sonucu aşağıya ayrıca işlenecek; yerel sonuçlar uzak yayın sonucu sayılmıyor.

## 11. Değiştirilen dosyalar

`ResponsiveImage.jsx`, `Services.jsx`, `ServicesPreview.jsx`; `serviceGallery.js`, `generatedMedia.json`; TR/EN/AR çevirileri; `optimize-media.mjs` (iç içe medya kayıtlarını koruma), `serve-audit.mjs` (AVIF MIME); dokuz eski Tarım çıktısı ve 71 yeni görsel; bu rapor ve `MEDIA_RIGHTS_REVIEW.md` güncellemesi.

## 12. Yayın için kalan işlemler

Çalışma release dalında ve aynı eski Netlify projesinin önizlemesinde doğrulanacak. Production `b4753086-eb94-4a7e-b5f5-7270835fab3a` için yayın kilidi korunur. Main merge, production deploy, proje bağlantısı, secret, DNS değişikliği yapılmaz. `VITE_NETLIFY_FORMS_ENABLED=false` korunur.

Kişiler, görünür plakalar ve üçüncü taraf markalar için insan tarafından kullanım izni/gizlilik incelemesi gerekir. Dosya adları gerçek şirket tesisi veya hak sahipliği kanıtı değildir. Yayın için bu fotoğrafları kapsayan yeni açık kullanıcı onayı gerekir; eski sürüme verilen canlı yayın onayı bu sürüme taşınmadı.
