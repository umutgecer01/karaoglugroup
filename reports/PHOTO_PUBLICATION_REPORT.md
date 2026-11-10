# Fotoğraf açıklamalarının kaldırılması ve onaylı canlı yayın

10 Kasım 2026. Kullanıcı, fotoğrafların altındaki açıklamaların kaldırılmasını ve son sürümün `https://karaoglugroupnet.netlify.app/tr/` adresinde canlıya alınmasını açıkça istedi.

Tarım ve İnşaat detay galerilerindeki görünür figcaption kaldırıldı. Ekran okuyucuların kullandığı TR/EN/AR alt metinleri, dokuz yeni fotoğraf, responsive AVIF/WebP/JPEG kaynakları ve diğer sektörler korundu. Formlar kapalı kalır; gerçek mesaj/CV gönderilmez.

Hedef yalnızca `karaoglugroupnet`, Project ID `b4753086-eb94-4a7e-b5f5-7270835fab3a`. Mevcut kilitli production deployment `6af18e98278ff0906ad9ca6a` yayın öncesi baseline'dır. Ayrı production-context build ve hash manifesti hazırlanır; aynı projeye draft olarak yüklenir. Aday doğrulanmadan yayın değiştirilmez. Onaylı geçişte yalnızca doğrulanan adayın lock işlemiyle atomik yayın ve yeniden kilitleme kullanılır; unlock, main merge, GitHub production workflow, DNS/secret/repo bağlantısı değişikliği yapılmaz.

Önceki fotoğraf entegrasyonunun 594 responsive kontrolü ve üçer tekrarlı performans sonuçları [ayrı rapordadır](PHOTO_INTEGRATION_REPORT.md); bu açıklama kaldırma değişikliğinin yeniden yapılmış performans ölçümleri olarak sunulmaz.

## Gerçek yayın sonucu

**YAYINLANDI:** [Türkçe canlı site](https://karaoglugroupnet.netlify.app/tr/). 10 Kasım 2026 **17:35:29 İstanbul**.

- Uygulama kaynak commit'i: `d528863e546e621f7054327872e978f2dce5061e`, release dalına normal push ile kaydedildi.
- Yeni published deployment: `6af32b94cd530321a64bf6c1`. API published ID ve published_at doğrulandı; **locked=true**. Önceki yayın kilidi kaldırılmadı; doğrulanan aday `POST /deploys/{id}/lock` ile yayımlanıp kilitlendi.
- Node 22.23.4: build, **29/29** regresyon, **4/4** production statik test, lint/security ve npm audit **0 bulgu**. Uzak push CI, PR CI, Security ve CodeQL aynı kaynak commit'inde başarılı. Otomatik PR önizlemesi `6af32b0163a573f7d7b54e9e` kaynak SHA'sıyla eşleşti.
- Ayrı production-context pakette 208 dosya SHA-256 manifestine alındı. Yayından önce TR/EN/AR ana sayfaları ile Tarım/İnşaat sayfaları ve tüm JS/CSS dosyaları uzak adayla karşılaştırıldı. HTML'de sadece Netlify Forms açılış etiketi normalleştirmesine izin verildi. Preview noindex paketi canlıya taşınmadı.
- Canlı TR/EN/AR ana sayfaları HTTP 200 ve index/follow; yerel production HTML ile eşleşiyor. Gerçek canlı tarayıcıda **36/36** galeri görseli ve **15/15** mobil/masaüstü yerleşim/ana sayfa sıralama kontrolü geçti. Yeni fotoğrafların görünür açıklaması yok; alt metinler mevcut. Runtime exception yok. Türkçe masaüstü ekran görüntüsü ayrıca açılarak incelendi.
- Yayın sonrası canlı HTTP taraması: **54/54** sayfada dil/yön, canonical, hreflang, H1, indexleme ve kapalı form kontrolleri; **163/163** dahili kaynak; üç bilinmeyen adreste gerçek **404**; sitemap/robots, güvenlik başlıkları ve cache kontrolleri başarılı. İki geçici istek yeniden denendi, son sonuçta **0 hata**. Kanıt: `reports/photo-publication/live-http.json`. Yayın sonrası yeni Lighthouse veya 594'lük tam responsive matris tekrarı yapılmadı; bu sürüm için yukarıdaki hedefli tarayıcı testleri çalıştırıldı.
- Önizleme testinin ilk denemesinde navigasyon tamamlanmadan eski DOM okundu; test bekleme koşulu hedef URL ve tamamlanmış altı görseli bekleyecek şekilde düzeltildi. Yeniden kontrol ve canlı kontrol başarılı; uygulama kaynak kodunda buna yönelik değişiklik gerekmedi.
- Git build/preview ayarları, repo/main bağlantısı, domain/DNS/secrets ve ikincil proje korundu. Main'e merge/push ve production GitHub workflow dispatch yapılmadı. Forms=false, gerçek gönderim **0**.

Yerel kanıtlar `reports/photo-publication/` altında; raw JSON/PNG ve paketler Git/publish dışındadır. Bu raporun tamamlanma kaydı ve AGENTS production baseline güncellemesi uygulama commit'inden sonraki belge commit'inde tutulur; canlı uygulamanın kaynağı yukarıdaki d528863'tür. Yeni fiziksel cihaz, saha INP veya form teslimat testi yapılmadı. Sonraki canlı sürümler ayrı kullanıcı onayı gerektirir.
