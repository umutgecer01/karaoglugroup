# Medya kökeni, kullanım hakkı ve teknik envanter

10 Kasım güncellemesi: Aşağıdaki 9 Kasım envanteri tarihsel durumdur. Eski üç Tarım kaynağı ve türevleri kaldırıldı; kullanıcının sağladığı altı Tarım ve üç ek İnşaat görseli responsive JPEG/WebP/AVIF çıktılarıyla entegre edildi. Mevcut İnşaat görselleri korundu. Yeni dosyaların kaynak, boyut, izin/gizlilik sınırları ve testleri [Fotoğraf entegrasyon raporunda](reports/PHOTO_INTEGRATION_REPORT.md) kayıtlıdır. Bu kaynaklar bağımsız olarak şirkete ait/gerçek tesis diye doğrulanmadı; kişiler, plakalar ve üçüncü taraf markaları için yayın öncesi insan kontrolü gerekir.

9 Kasım 2026. Dosya bulunması, HTTP 200 dönmesi veya fotoğrafa benzemesi kullanım hakkı ve şirkete ait gerçek tesis/araç kanıtı sayılmadı. Görseller gerçek, stok veya yapay zekâ üretimi olarak sınıflandırılmadı; bunu doğrulayacak köken belgesi bulunmadı.

## C. Şirket teyidi gereken dosyalar

| Kaynak dosyalar (`public/` altında) | Teyit konusu |
| --- | --- |
| `images/automotive-gallery-1.jpg`, `automotive-gallery-3.jpg` | Araç/saha ilişkisi, fotoğrafçı/lisans ve yayımlama izni. Mevcut bazı alt metinler Karaoğlu Otomotiv ilişkisi kuruyor; bu iddia ayrıca teyit edilmeli. |
| `images/construction-1.jpg`, `construction-2.jpg`, `construction-3.jpg` | Gerçek proje/saha ilişkisi, kişi/işletme ve kullanım izinleri. |
| `images/petrol-energy-1.jpg`, `petrol-energy-2.jpg`, `petrol-energy-3.jpg` | İstasyon/tesis sahipliği veya işletme ilişkisi, fotoğraf ve görünen üçüncü taraf marka hakları. |
| `images/agriculture-1.jpg`, `agriculture-2.jpg`, `agriculture-3.jpg` | Arazi/üretim alanı ilişkisi ve görsel kullanım hakkı; alt metinlerdeki şirket aidiyeti doğrulanmadı. |
| `images/fleet-rental-1.jpg`, `fleet-rental-2.jpg`, `fleet-rental-3.jpg` | Araçların ve sahaların işletmeyle ilişkisi, çekim ve marka izinleri. |
| `images/fleet-rental-video-poster.jpg`, `videos/fleet-rental-showcase.mp4` | Video/poster kaynağı; görüntü, varsa müzik/ses/kişi hakları; yayımlama kapsamı. |
| `images/karaoglu-why-bg.jpeg` | Sosyal paylaşım görseli kaynağı ve tesis/şirket ilişkisi. |
| `images/karaoglu-logo.jpeg`, favicon türevleri | Mevcut marka dosyaları korundu; ayrıca marka/mülkiyet belgesi edinilmedi. |

16 logo dışı orijinal JPEG/JPG, mevcut logo ve bir MP4 envanterde görüldü. WebP ve favicon türevleri kaynaklarının hak durumunu miras alır; yeni boyut/format ayrı mülkiyet kanıtı oluşturmaz. Fotoğraflara uyarı yazısı basılmadı, görseller silinmedi veya yeni görselle değiştirilmedi.

## A. Kod/dosya incelemesinde doğrulanan teknik yapı

- Hero, mevcut otomotiv görselinin 480/640/960 px WebP kaynaklarını kullanıyor; HTML preload ile `srcset`/`sizes` yaklaşımı korunuyor. Dosya varlığı ve kaynak kodu incelendi; bu rapor yeni LCP ölçümü değildir.
- `ResponsiveImage.jsx` mevcut varyantları WebP `<source>` ve JPEG fallback ile sunuyor. AVIF dosyası görülmedi; AVIF eklemek bu turda gerekli bir düzeltme olarak varsayılmadı.
- Galeri ve sayfa görsellerinde boyutlar, responsive kaynaklar ve lazy loading mevcut. Döngünün ikinci kopyası `aria-hidden` ve boş alt metinle dekoratif tutuluyor. TR/EN/AR galeri çevirileri temel galeri metinlerini override ediyor.
- Ana sayfa galerisi 16:9 kutulara `object-fit: cover` ile oturuyor. Bu bilinçli kırpma, fotoğrafın bütününün gösterileceği garantisi değildir; şirketin önemli ayrıntı/markaların görünürlüğünü ayrıca onaylaması gerekir.
- MP4 **3.138.315 bayt**; poster 1280 px WebP **46.394 bayt**. `preload="none"`, kullanıcı tıklamasından sonra `<source>`, native controls, sekme gizlenince/görünüm dışına çıkınca pause kodu mevcut. Bu alt denetimde yeni oynatma veya ses içerik testi yapılmadı.

## B. İnceleme sonrası teknik fırsatlar ve sınırlar

Bazı WebP'ler JPEG kaynağından daha büyük: örneğin `construction-1-760.webp` 249.056 bayt, `construction-1.jpg` 172.829 bayt. Dosya uzantısından otomatik performans kazancı çıkarılmamalı. Yeni encode/kaynak seçimi ancak piksel/algısal kalite karşılaştırması ve gerçek transfer ölçümüyle değerlendirilmeli; görsel kalite düşürülmedi.

Videoda `<track>` altyazı kaynağı görülmedi. Sesin/anlatımın ve görüntüde taşınan anlamın denetimi tamamlanmadan tam erişilebilirlik iddiası yapılamaz. Gerekirse şirketin onaylı içeriklerinden eşdeğer metin, altyazı veya betimleme hazırlanır. İlgili ölçütler medya türüne göre değerlendirilir. [W3C zaman tabanlı medya rehberi](https://www.w3.org/WAI/WCAG22/Understanding/time-based-media.html), [önceden kaydedilmiş altyazılar](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html).

Köken teyidi için dosya başına kaynak/çekim tarihi, hak sahibi, izin belgesi, kullanım kapsamı, gerçek şirket ilişkisi ve varsa kişi/marka izni alanları yetkili tarafından doldurulmalıdır. Bu kayıtlar gelmeden fotoğraf “şirketin gerçek tesisi” veya “AI görseli” olarak kesin ilan edilmez.
