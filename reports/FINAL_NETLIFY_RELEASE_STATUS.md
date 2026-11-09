# KARAOĞLU GROUP — Onaylı release push ve son preview doğrulaması

> 9 Kasım güncellemesi: Kullanıcı onayıyla eski Netlify projesinin otomatik Git build'leri durduruldu ve `c45a5c0` production paketi mevcut canlı adreste yayımlandı. [Güncel production raporu](PRODUCTION_DEPLOYMENT_REPORT.md). Aşağıdaki içerik 8 Kasım release/preview kaydıdır.

8 Kasım 2026 — Europe/Istanbul

**Release push ve yeni GitHub/Netlify kontrolleri tamamlandı. CodeQL başarılı. Production için YAYINDAN ÖNCE EKSİKLER VAR.**

## GitHub ve deployment

Kullanıcının **“Evet, yalnızca release dalına push yap”** onayıyla `c45a5c06146da44b3d129c2156b2f1c425de2f80` normal push ile gönderildi. Önceki `740ac32` commit'i geçmişte korundu; amend/rebase/force push yapılmadı.

| Çıktı | Doğrulanan durum |
| --- | --- |
| [Release dalı](https://github.com/umutgecer01/karaoglugroup/tree/release/karaoglu-final-2026-11-08) | HEAD `c45a5c06146da44b3d129c2156b2f1c425de2f80` |
| [Düzeltme commit'i](https://github.com/umutgecer01/karaoglugroup/commit/c45a5c06146da44b3d129c2156b2f1c425de2f80) | 10 dosya; dört CodeQL bulgusuna yönelik düzeltmeler, testler ve hazırlık raporu |
| [PR #1](https://github.com/umutgecer01/karaoglugroup/pull/1) | Açık, **draft**; yeni commit ve güncel sonuçlarla açıklaması yenilendi |
| [Güncel Netlify Preview](https://deploy-preview-1--karaoglugroup.netlify.app/) | Netlify status'ü başarılı, bot yorumu yeni commit SHA'sını doğruluyor |
| [Yeni deployment](https://app.netlify.com/projects/karaoglugroup/deploys/6af03984e2f91d352b9f166c) | `6af03984e2f91d352b9f166c` |
| [Drawer içermeyen deployment bağlantısı](https://6af03984e2f91d352b9f166c--karaoglugroup.netlify.app/tr/) | GET 200, noindex, Drawer script'i yok; tam test paketi ayrıca bu permalink'te tekrarlanmadı |
| Uzak main | **Değişmedi:** `47ba0c370e8f291faff198f895c503547b95b65f` |
| Yerel release çalışma ağacı | Temiz; yeni source commit'i oluşturulmadı |

Production merge/deployment, main push, domain/DNS, Netlify site bağlantısı ve secret değişikliği yapılmadı. Release push yalnızca mevcut geliştirme projesinde preview güncelledi.

## CodeQL sonucu

Dört eski bulgunun ortak veri akışları güvenli kod değişiklikleriyle düzeltildi:

- HTML entity çözümleme tek geçişli; nested entity yeniden çözümlenmiyor.
- Tarayıcı testindeki rota/dil değerleri çalıştırılabilir kod metnine eklenmiyor; CDP fonksiyon argümanlarında taşınıyor.
- URL/storage kaynaklı dil metni href'e aynen iletilmiyor; sabit `tr/en/ar` değerlerinden seçim yapılıyor. Menü ve logo bulguları ortak yardımcı üzerinden giderildi.
- Rota/hash lookup'larında prototype özellikleri kabul edilmiyor.

Uyarı bastırma veya query/workflow güvenlik kısıtını azaltma yapılmadı. [Ayrıntılı veri akışı, değişen dosyalar ve yerel test raporu](NETLIFY_RELEASE_FIX_REPORT.md).

| Uzak kontrol | Yeni commit sonucu |
| --- | --- |
| [CodeQL findings check](https://github.com/umutgecer01/karaoglugroup/runs/128682971022) | **Başarılı — yeni bulgu yok** |
| [CodeQL workflow](https://github.com/umutgecer01/karaoglugroup/actions/runs/42465116508) | Başarılı |
| [PR CI](https://github.com/umutgecer01/karaoglugroup/actions/runs/42465116488) | Başarılı |
| [Push CI](https://github.com/umutgecer01/karaoglugroup/actions/runs/42465112988) | Başarılı |
| [Security workflow](https://github.com/umutgecer01/karaoglugroup/actions/runs/42465116481) | Başarılı |
| Netlify deploy-preview | Başarılı |
| Netlify Header / Redirect rules | Başarılı; 8 header ve 1 redirect kuralı |
| Netlify Pages changed | Neutral; başarısız değil |

Yerel CodeQL 2.27.4, `javascript-queries@2.5.0` standart paketinde 89 sorgu yürüttü ve **0 bulgu** verdi. İlgili üç query ID'sinin analiz kapsamında olduğu doğrulandı. GitHub API release ref'i için **0 açık Code Scanning bulgusu** döndürdü; uzak findings check'i de başarılı. Önceki raporlardaki dört açık bulgu bilgisi eski `740ac32` analizine aittir.

Actions runtime sürüm geçişi uyarıları sürüyor; uygulamanın Node 22 build/test sonucuyla karıştırılmadı. Güncel check/annotation kanıtı: [remote-fix-latest.json](codeql-fix/remote-fix-latest.json).

## Gerçek yeni preview testleri

Önceki deployment'ın sonucu kopyalanmadı; testler yeni commit'in gerçek Netlify preview adresinde yeniden çalıştırıldı. Tarayıcı QA katmanı GET/HEAD dışındaki istekleri engelledi.

| Test | Yeni deployment sonucu |
| --- | --- |
| TR/EN/AR HTML / SEO | **54/54** sayfa 200; dil/yön, tek H1, canonical, hreflang ve preview noindex başarılı |
| Responsive | **594/594**; 54 sayfa × 11 genişlik, 320–1920 px; yatay taşma yok |
| Dahili URL / görseller | **102 kaynak** başarılı; görünür kırık görsel yok |
| Dil değiştirme | **51/51** aynı sayfada geçiş; URL, başlık, içerik, lang/dir ve canonical eşleşiyor |
| Menü/form/galeri | **38/38**; üç dilde mobil menü/Escape, masaüstü menü, iletişim geçişi, kapalı formlar, otomatik yatay galeri ve legacy hash bağlantıları |
| Galeri görselleri | Kartlara `object-fit: cover` ile oturuyor; otomatik hareket var, pause düğmesi yok |
| Video | Gerçek tıklamayla oynatma, poster 200, native kontrol ve görünür alan dışında pause başarılı |
| İletişim bağlantıları | Telefon href'i ve yeni sekme korumaları başarılı; gerçek arama/mesaj gönderilmedi |
| 404 | Kök, EN ve AR altında üç bilinmeyen URL **gerçek HTTP 404** |
| Security headers | Gerçek yanıtlarda CSP, HSTS, nosniff, frame DENY, referrer, permissions ve COOP doğrulandı |
| Cache | HTML yeniden doğrulama, hash'li assets bir yıl immutable ve görseller 30 gün kuralları doğrulandı |
| Console / runtime | Son responsive ve smoke denetimleri başarılı; uygulama runtime exception'ı yok |

Kanıtlar: [HTTP/SEO/header/cache](codeql-fix/preview/http.json), [responsive](codeql-fix/preview/page-audit.json), [dil/video](codeql-fix/preview/behavior.json), [38 smoke kontrolü](codeql-fix/preview/smoke.json), [permalink HTTP](codeql-fix/preview/permalink.json).

TR mobil, EN masaüstü ve AR mobil ekran görüntüleri açılarak incelendi. Site hero görselleri ve yerleşimi korunuyor. Netlify Drawer'ın CSP nedeniyle oluşan gri alanı preview alias'ında sürüyor; uygulama görseli hatası olarak gösterilmedi. İlk tarayıcı denemesi Chrome debug portu henüz açılmadığı için bağlantı alamadı; sonraki çalışma yukarıdaki sonuçlarla başarıyla tamamlandı.

Node 22.23.4 ile önceki yerel hazırlıkta temiz `npm ci`, production/preview build, **10/10** regresyon, production/preview **4/4** statik test, lint ve audit **0** geçti. **110/110** form dahil etkileşim testi yalnızca yerel taklit POST yanıtlarıyla yapıldı; yeni preview üzerinde yapılan smoke paketi 38 kontroldür. GitHub CI temiz kurulum, build, lint/security, regresyon ve production statik testlerini uzakta tekrar çalıştırdı; CodeQL ayrı analiz yaptı. Responsive ve 110 etkileşim paketinin GitHub Actions tarafından çalıştırıldığı iddia edilmedi.

Gerçek telefon donanımı, Safari/Firefox/Edge, ekran okuyucu ve yeni LCP/INP ölçümü yapılmadı; önceki yerel performans sayıları yeni deployment sonucu olarak sunulmuyor.

## Doğru production hedefi ve kalan işlemler

**Kullanıcının teyit ettiği hedef `https://karaoglugroupnet.netlify.app/` adresidir.** `karaoglugroup` geliştirme/önizleme için kalır. Canonical/sitemap/site URL politikası eski production adresinde korundu.

- Eski adresin public GET yanıtı 200; site API sorgusu 401. Eski **Project ID hâlâ doğrulanamadı**. İki adresin site kimlikleri eşit diye bir iddia yapılmadı.
- Yeni preview projesi API ile doğrulandı: `karaoglugroup`, ID `80b58d06-0cbb-432c-8193-17d34ba776df`. Bu ID eski projenin production secret'ına yazılmadı.
- Eski ID'yi almak için yetkili panelde **karaoglugroupnet → Project configuration → General → Project details → Project information → Project ID**. Ardından mevcut repo/branch/build ve GitHub production secret eşleşmesi salt okunur olarak incelenmeli. [Hazırlanmış bağlantı adımları](NETLIFY_RELEASE_FIX_REPORT.md).
- Drawer için yalnızca yeni preview projesinde **Project configuration → Developer settings → Continuous deployment → Collaboration tools → Configure → Disable Netlify Drawer** adımı hazır; panel erişimi olmadığından uygulanmadı. Production CSP gevşetilmedi.
- `VITE_NETLIFY_FORMS_ENABLED=false` kaldı. Gerçek mesaj/CV gönderilmedi. Form alıcıları, teslimat, CV saklama/erişim ve KVKK onayı tamamlanmadan form aktivasyonu yapılmamalı.
- Kurumsal içerik/görsel hakları ve hukuki teyitler ile hedef cihaz/tarayıcı kontrolleri sürüyor.
- Main'e merge, eski proje bağlantısını değiştirme ve production deployment için ayrı açık onay gerekir; bu aşamada yapılmadı.

**Karar: YAYINDAN ÖNCE EKSİKLER VAR.** Kod güvenlik düzeltmeleri, release push ve güncel preview kontrolleri başarılı. Production için kalan temel engel eski Netlify projesinin yetkili kimlik/bağlantı doğrulaması ve kurumsal/hukuki süreçlerdir. Canlı site değiştirilmedi.
