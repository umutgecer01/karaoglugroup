# Kurumsal içerik, SEO ve erişilebilirlik alt denetimi

9 Kasım 2026. İncelenen başlangıç release HEAD `d4287c5`; kaynak incelemesi ve mevcut production build çıktısı kullanıldı. Bu belge yeni production yayını, yeni alan performansı, tam WCAG sertifikası veya hukuki uygunluk onayı değildir. Bu çalışma boyunca ticari şirket bilgileri ve medya dosyaları değiştirilmedi.

## A. Gerçekten uygulanan ve doğrulanan işler

### Kaynak/HTML SEO ve medya incelemesi

- Mevcut build'deki **54 HTML** sayfası incelendi. Kaynak metadata hesabında her dil içinde yinelenen title/description yok; her sayfada tek H1 var; `<img>` etiketlerinde eksik `alt` niteliği yok. Boş dekoratif alt metinler “eksik” sayılmadı. Organization JSON-LD JSON olarak ayrıştırılabiliyor.
- Canonical/hreflang/robots üretim mantığı, üç dil ve RTL yönü kaynakta incelendi. Bunlar yeni gerçek HTTP/Google indeksleme sonucunun yerine konmadı; ana operasyon raporundaki yerel/preview/production sonuçları ayrı değerlendirilir.
- Kaynak galeri metinleri TR/EN/AR içerik nesneleriyle eşleştiriliyor. JPEG/WebP varyantları, lazy loading, hero preload, video source'un kullanıcı tıklamasıyla eklenmesi ve `preload=none` korundu.
- Ham kaynak/build denetimi: `reports/master-operations/corporate-source-audit.json` (Git dışında). Bu ilk çıktı footer değişikliği öncesindeki build'e aittir; yeni build sayılarıymış gibi yeniden etiketlenmedi.

### Görünümü değiştirmeyen teknik düzeltmeler

Footer'ın üç bölüm başlığı aynı `footer-title` sınıfıyla H4'ten H2'ye taşındı. İlk build'de 51/54 sayfada görülen seviye atlamalarının önemli bir kaynağı global footer'dı. Bu işlem diğer sayfa içi H2/H3/H4 yapılarını bütünüyle onayladığımız anlamına gelmez; yeni build üzerinde kalan seviye atlamaları ayrıca incelenmelidir. Görsel sınıflar değiştirilmedi.

Mevcut gizlilik/tercihler penceresine **kalıcı “Hareketi azalt / Reduce motion / تقليل الحركة”** tercihi eklendi. Galeri üzerine kaldırılmış pause düğmesi geri getirilmedi. Tercih, galerinin otomatik hareketini ve dekoratif animasyonları kapatır; statik galeriyi elle yatay kaydırılabilir bırakır. Tercih pencere kapanınca etkin kalır ve tarayıcı depolaması açıksa yeniden yüklemede korunur. Depolama engelliyse aynı ziyarette bellekte çalışır. Cihazın reduced-motion tercihi her zaman üstün tutulur; uygulamadaki kapatma seçimi cihaz ayarını geçersiz kılamaz.

Neden gerekli: Hover/focus sırasında geçici duraklama mevcut olsa da odağın ayrılmasıyla tekrar başlayan hareket, tek başına W3C'nin kalıcı pause mekanizması açıklamasını karşılamaz. Yeni tercih sayfanın başka bölümüne geçildiğinde de hareketi kapalı tutar. [W3C SC 2.2.2 açıklaması](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide).

`scripts/motion-preference.test.mjs` **5/5** geçti: yeniden yüklemede saklanan tercih; OS tercihinin üstünlüğü ve dinamik değişimi; engelli depolamada aynı ziyaret belleği; geçersiz depolama değerinin yalnızca sabit boolean CSS durumuna dönüşmesi; dinleyici aboneliğinin kaldırılması. Bu sayılar tarayıcı/ekran okuyucu doğrulaması yerine sunulmaz; ana QA bu yeni kontrolü tarayıcıda ayrıca test etmelidir.

## B. Teknik olarak hazır

- [Kurumsal içerik teyit tablosu](../CORPORATE_CONTENT_REVIEW.md): gerçek iddialar, kaynaklar ve yetkili onay sırası.
- [Medya hakları/teknik envanteri](../MEDIA_RIGHTS_REVIEW.md): 16 logo dışı orijinal JPEG/JPG, logo ve MP4; dosya kökeni ve şirket ilişkisi için gereken bilgiler.
- [Search Console adımları](../SEARCH_CONSOLE_GUIDE.md): doğru kök URL-prefix, onaylı sahiplik doğrulaması, sitemap, URL Inspection ve soft-404 kontrolü. Google hesabında işlem yapılmadı.
- Mevcut reduced-motion CSS yolu ve yeni tercih alternatifleri hazırlanmıştır; tam WCAG 2.2 AA iddiası yoktur.

## C. Onay veya bilgi gerekiyor

`1000+`, `30+`/`+30`, `1993`, başkan adı/unvanı, resmî tüzel unvan, şirket e-postası, alıcılar, güncel adres/telefon ve faaliyet/proje iddiaları için bağımsız kayıt edinilmedi. Daha önce verilmiş içerik yayın izniyle bu bağımsız teyit ayrıldı; mevcut gerçek bilgileri kullanıcı onayı olmadan değiştirmedik.

Görseller “şirkete ait gerçek tesis”, “stok” veya “AI üretimi” olarak kesin sınıflandırılmadı. Kullanım hakkı, çekim/üretim kaynağı ve şirket ilişkisi teyit bekliyor. PDF/MP4 dosyalarının teknik olarak varlığı hak belgesi değildir.

Mevcut gizlilik metnindeki kendi açıklamasına göre tam onaylı KVKK metni mevcut değil. Veri sorumlusu, amaç, alıcı/aktarım, saklama/silme, kariyer/CV erişimi ve başvuru kanalı için şirket/hukuk süreci gerekiyor. Yeni hukuki metin yayımlanmadı.

## Kapsam dışında veya tamamlandı denmeyenler

- Yeni gerçek cihaz, Safari/Firefox/Edge, ekran okuyucu ve ayrıntılı renk-kontrast ölçümü bu alt denetimde yapılmadı. Tam WCAG uygunluğu garantilenmez.
- Videoda `<track>` görülmedi; sesin/anlatımın ve görsel bilginin eşdeğer metin/altyazı/betimleme gereksinimi içerik bazında incelenmedi. Native controls bulunması tam medya erişilebilirliği kanıtı değildir.
- Bazı WebP dosyaları JPEG'den büyük; yeni encode veya görsel kalite düşürme yapılmadı. Yeni LCP/CLS/INP/Lighthouse sonucu bu alt denetimden üretilmedi.
- Başlık seviyesinin atlaması otomatik olarak WCAG başarısızlığı ilan edilmedi; anlamsal sayfa hiyerarşisi için gerçek inceleme gerekir.
- Search Console sahiplik doğrulaması/sitemap gönderimi ve hukuki/medya hakları teyidi yapılmadı.
