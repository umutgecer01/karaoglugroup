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

Gerçek Netlify taslağının `/tr/` ana sayfasında Lighthouse 13.6.0, Chrome 157, Node 22; mobil varsayılan simülasyon ve masaüstü preset ile profil başına üç soğuk navigasyon yapıldı. Medyanlar:

| Ölçüm | 9 Kasım önceki önizleme | Bu fotoğraf taslağı |
| --- | --- | --- |
| Mobil LCP | 2,035 sn | **1,992 sn** |
| Masaüstü LCP | 0,559 sn | **0,492 sn** |
| Mobil / masaüstü CLS | 0 / 0,0064 | **0 / 0,0064** |
| Mobil / masaüstü performans puanı | 99 / 99 | **97 / 100** |
| Mobil / masaüstü aktarım | 800.511 / 764.931 bayt | **846.640 / 771.644 bayt** |

LCP hedefi iki profilde de 2,5 saniyenin altında. Mobil puan iki azaldı; aktarım yaklaşık %5,8 arttı. Sonuçlar farklı günlerde alınmış laboratuvar ölçümleridir; kontrollü aynı-oturum A/B veya saha verisi değildir. Tek bir puandan genel hız artışı iddia edilmez. Geçerli mobil LCP örnekleri 2,016 / 1,992 / 1,964; masaüstü 0,492 / 0,396 / 0,538 sn. Her iki profilde medyan TBT 0 ms. İlk ikinci mobil denemede Lighthouse `NO_NAVSTART` trace hatası verdi; başarısız kayıt saklandı, yalnızca o deneme tekrar edildi ve başarılı üç örneğin medyanı alındı. Erişilebilirlik/best practices puanları 100; SEO 63, preview noindex/robots korumasıyla birlikte değerlendirilmelidir. Production SEO hatasız veya saha INP başarılı sonucu çıkarılmadı.

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

Yerel ayrıntılı JSON/PNG kanıtları `reports/photo-integration/` altında tutulur ve Git'e eklenmez. Yeni gerçek cihaz, Safari/Firefox, form teslimatı ve saha INP ölçümü yapılmadı. Yerel sonuçlar uzak yayın sonucu sayılmıyor.

Gerçek Netlify taslağında: **36/36** galeri görseli, **15/15** mobil/masaüstü yerleşim ve ana sayfa kaynak sıralama kontrolü; **71/71** görselin HTTP 200, dosya hash eşliği ve 30 günlük cache kontrolü başarılı. AVIF MIME doğru; TR/EN/AR kök sayfalarında canonical/hreflang/noindex ve güvenlik başlıkları; üç dil altında bilinmeyen adreslerde HTTP 404; sitemap/robots erişimi ve eski Tarım kaynağının 404 yanıtı doğrulandı. Tam 594 responsive paketinin uzak taslakta tekrar çalıştırıldığı iddia edilmez; bu paket son yerel kaynak üzerinde çalıştı.

## 11. Değiştirilen dosyalar

`ResponsiveImage.jsx`, `Services.jsx`, `ServicesPreview.jsx`; `serviceGallery.js`, `generatedMedia.json`; TR/EN/AR çevirileri; `optimize-media.mjs` (iç içe medya kayıtlarını koruma), `serve-audit.mjs` (AVIF MIME); dokuz eski Tarım çıktısı ve 71 yeni görsel; bu rapor ve `MEDIA_RIGHTS_REVIEW.md` güncellemesi.

## 12. Yayın için kalan işlemler

Kaynak commit'i `eef87c4d9ba02b03bc22e04293d037add55f6ea9` için aynı eski Netlify projesinde yalnızca taslak oluşturuldu: [İncelenen önizleme](https://6af328b0f1de1e9bed25263f--karaoglugroupnet.netlify.app/tr/). Site ID `b4753086-eb94-4a7e-b5f5-7270835fab3a`, deployment `6af328b0f1de1e9bed25263f`, durum ready, context deploy-preview, published_at boş. Paket noindex ve formlar kapalı oluşturuldu; manifestte çıktı hash'leri tutuldu. Bu kalıcı deployment bağlantısında Drawer görsel müdahalesi görülmedi; CSP gevşetilmedi.

Canlı deployment `6af18e98278ff0906ad9ca6a` değişmedi ve kilitli kaldı. Main merge, production deploy, proje bağlantısı, secret, DNS değişikliği yapılmadı. `VITE_NETLIFY_FORMS_ENABLED=false` korundu. [Release dalı](https://github.com/umutgecer01/karaoglugroup/tree/release/karaoglu-final-2026-11-08) ve [draft PR #1](https://github.com/umutgecer01/karaoglugroup/pull/1) üzerinden kayıt devam eder. Git bağlantılı PR önizlemesi ayrıca son push SHA'sıyla eşleştirilmeli; yukarıdaki taslak fotoğraf kaynak commit'ine aittir.

Kişiler, görünür plakalar ve üçüncü taraf markalar için insan tarafından kullanım izni/gizlilik incelemesi gerekir. Dosya adları gerçek şirket tesisi veya hak sahipliği kanıtı değildir. Yayın için bu fotoğrafları kapsayan yeni açık kullanıcı onayı gerekir; eski sürüme verilen canlı yayın onayı bu sürüme taşınmadı.
