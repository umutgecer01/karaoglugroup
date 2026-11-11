# Karaoğlu Group — Eksiklerin giderilmesi ve gerçek tarayıcı QA

11 Kasım 2026. Çalışma tabanı: `9fc9426`, release dalı. Başlangıç çalışma ağacı temizdi. Mevcut kullanıcı değişiklikleri ve 10 Kasım denetim düzeltmeleri korunuyor. Production yayını, unlock, main push/merge, DNS, secret veya site bağlantısı değişikliği yapılmıyor. Formlar kapalı; gerçek veri gönderilmiyor.

## İlerleme kaydı

- Node 22.23.4 ve gerçek Chrome 157 CDP oturumu hazır. Ayrı `.audit/fix-qa/chrome-profile` kullanılıyor.
- Axe-core 4.14.0 ve Lighthouse 13.6.0 dev bağımlılıkları kuruldu; kurulum sonrası npm audit 0 bulgu.
- Önceki medya değişiklikleri yeniden üretilmedi; mevcut filo fotoğrafı ve video korundu. Ekli örnek kodlar incelenerek projeye uyarlanıyor; patch körlemesine uygulanmadı.
- Başlangıç build'i 54 sayfa üretti. Mobil form ön kontrolü: 3 dil × 3 form × 9 genişlik = 81 senaryo; 42 yerleşim sorunu. 320 px ekran görüntüsünde iki sütuna sıkışan kariyer paneli doğrulandı.
- Ana neden: CSS'te sonradan gelen `.career-layout` ve `.contact-layout` iki sütun kuralı mobil tek sütun kuralını eziyor. Mobil override, alan/card min-width, CV dosya adı, padding ve buton genişlikleri düzeltildi.
- Düzeltme sonrası 81 form senaryosu: 0 yerleşim sorunu, 0 ağ yazma isteği. Uzun sentetik CV adı, validation hataları ve küçültülmüş viewport odak kontrolü uygulandı. Fiziksel yazılım klavyesi testi değildir.
- Ana sayfaya mevcut tasarım/çevirilerle filo bölümü eklendi. Filo PNG fallback'i korunarak 480/768/1024 px WebP/AVIF kaynakları üretildi; orijinal fotoğraf 1024×768 (önce kodda yanlış 1536×1024 yazıyordu).

## MOBİL KARİYER VE İLETİŞİM FORMU DÜZELTMELERİ

Değişen dosyalar: Career.jsx, Contact.jsx, QuickContact.jsx, FormField.jsx, index.css. 320, 360, 375, 390, 414, 430, 480, 768 ve 1440 px ölçüldü. 1024 px altında tek sütun panel; telefonlarda tek sütun alanlar; min-width:0, border-box, tam genişlik; okunabilir hata/onay metni ve uzun CV adı satır kırma kuralları. Önce/sonra görüntüler yerel `reports/fix-qa/` dizininde.

## Devam edecek doğrulamalar

54×11 responsive matris, axe-core, klavye/menü, üç dil/medya, mocked form etkileşimleri, Lighthouse, final build/security ve GitHub/Netlify önizleme henüz bu rapor yazıldığı anda tamamlanmadı. Sonuçlar çalıştırıldıkça bu belgeye kaydedilecek. Hukuki/medya izinleri, CV alıcısı/saklama/KVKK ve fiziksel cihaz/ekran okuyucu doğrulaması şirket/insan incelemesi gerektirir; teknik testler bu onayları sağlamaz.

### Ara sonuç — tamamlama çalışması sürüyor

- 594 responsive ve 173 dahili kaynak kontrolü geçti; 108 taklit form/menü etkileşimi ve 51 dil geçişi geçti. 6 klavye senaryosu başarılı. İlk dil/klavye denemelerinde test senkronizasyonu/Enter char olay eksikliği giderildi; uygulama menü davranışına gereksiz müdahale edilmedi.
- Axe: 63/63 tarama, 0 otomatik ihlal; 37 eksik değerlendirme kaydı (aria-prohibited-attr, video-caption, color-contrast) insan incelemesi gerektiriyor. Bu sayı 37 doğrulanmış kusur anlamına gelmez; WCAG sertifikası iddia edilmez. İlk taramada bulunan küçük turuncu metin kontrastları düzeltildi.
- İlk sıkıştırmasız yerel Lighthouse medyan LCP: mobil 6,043 sn / masaüstü 1,184 sn; puan 78/97. Bunlar production ölçümü değildir. Waterfall'da mevcut üç yeni inşaat JPEG'i büyük kaynak olarak tespit edildi; orijinalleri koruyarak AVIF/WebP hazırlanıyor. Nihai source ve Netlify preview ölçümleri bekleniyor.
- Netlify API: production `6af3680cd9b11a5369e06045`, kilitli ve değişmedi. Canlı TR/EN/AR yanıtları, güvenlik başlıkları ve üç gerçek 404 kontrolü başarılı; yeni düzeltmeler henüz canlıda değil.
- Yetkili GitHub salt okunur API: production environment 404, main branch protection 404, repo seviyesinde NETLIFY_AUTH_TOKEN adı yok. Secret değeri okunmadı. Manuel production workflow'un guardları korundu; environment/reviewer/secret/protection kurulumu ayrıca onay gerektirir. Bu ayarlar otomatik değiştirilmedi.

### Son yerel kalite kapıları — 11 Kasım, 10:30 İstanbul

Son medya optimizasyonlarından sonra Windows runner yeniden başarıyla tamamlandı (exit 0). Build + 29/29 regresyon + 4/4 statik + security/lint/audit 0; 81 mobil form senaryosu ve 3 ek 320 px CV hata durumu; 594 responsive kontrol ve 189 kaynak; 108 taklit etkileşim ve 51 dil geçişi; 6 klavye senaryosu; 63/63 axe taraması, 0 otomatik ihlal başarılı. 37 eksik değerlendirme kaydı manuel inceleme olarak açık tutuldu. Son kaynakta 45 galeri görseli ve 12 filo görünümü tarayıcıda doğrulandı; PNG fallback isteği 0. TR/EN/AR filo ve mobil form ekran görüntüleri açılarak incelendi.

Mevcut üç ek inşaat fotoğrafı da (truck-yard / generator-truck / service-trucks) korunup responsive WebP/AVIF manifestine alındı. Galerinin mevcut 4:3 cover düzeni değiştirilmedi; kodda bulunan üç ek araç fotoğrafı ve önceki inşaat görselleri silinmedi. Son GitHub PR/CI ve Netlify önizleme performansı bu noktada henüz doğrulanmış değildir; kayıt ve önizleme aşaması devam eder. Production için yeni yayın onayı verilmemiştir.

### ARIA incelemesi sonrası son test turu

Services, ServicesPreview ve Career içindeki etiketli kapsayıcılara uygun `role="group"` eklendi. Tüm Windows test paketi yeniden başarılı tamamlandı: 29 regresyon, 4 statik, security/lint/audit 0, 45 galeri / 12 filo görünümü, 81 form + 3 CV hata senaryosu, 594 responsive / 189 kaynak, 108 etkileşim, 51 dil geçişi, 6 klavye ve 63 axe taraması. Otomatik ihlal 0; eksik değerlendirme kayıtları **37'den 10'a** indi (6 video-caption ve 4 renk kontrastı incelemesi). Video-caption kaydı, ses kanalı olmayan ve görsel metin alternatifi eklenen video için otomatik değerlendirilemeyen durumdur; sahte altyazıyla kapatılmadı.

GitHub yazma erişimi mevcut güvenli Credential Manager oturumuyla doğrulandı. GitHub uygulaması PR oluştururken 403 verdi; mevcut yerel oturumla kullanıcıdan şifre/token istenmeden [draft PR #10](https://github.com/umutgecer01/karaoglugroup/pull/10) açıldı. Production kilidi korunarak aynı projede PR önizlemesi oluşturuluyor. Son commit'e ait uzak kontroller ve gerçek Netlify performansı ayrıca eklenecek.
