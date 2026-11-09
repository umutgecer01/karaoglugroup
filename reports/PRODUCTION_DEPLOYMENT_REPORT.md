# KARAOĞLU GROUP — Onaylı production yayını

9 Kasım 2026 — Europe/Istanbul

**YAYINLANDI ve kapsamdaki yayın sonrası kontroller başarılı:** [https://karaoglugroupnet.netlify.app/](https://karaoglugroupnet.netlify.app/). Kullanıcının son açık onayıyla eski projenin otomatik Git build'leri durduruldu ve doğrulanmış production paketi yayımlandı. Canlı URL'de 594 responsive, 101 kaynak, 51 dil geçişi ve 38 smoke kontrolü tamamlandı.

## Onay ve yapılan işlemler

Kullanıcı **“Evet, içerikleri ve belirtilen iki işlemi onaylıyorum”** yanıtıyla içeriklerin yayınını, eski projenin otomatik Git build'lerinin durdurulmasını ve `c45a5c0` production paketinin eski adrese yayımlanmasını onayladı.

1. Netlify kimliği/URL, mevcut production deployment, kaynak commit ve temiz Git ağacı kontrol edildi. Production paketinin tüm dosyaları SHA256 manifest'iyle karşılaştırıldı; aktif başka remote build olmadığı doğrulandı.
2. **Yalnızca `karaoglugroupnet` projesinde `build_settings.stop_builds=true` yapıldı.** Repo/branch/build/publish/domain değerlerinin korunması ve canlı deployment'ın bu aşamada değişmemesi doğrulandı.
3. Draft noindex paketi kullanılmadan, ayrı **146 dosyalık production-context paket** resmî Netlify CLI ile `--site b4753086-eb94-4a7e-b5f5-7270835fab3a --dir <production-paketi>/dist --cwd <production-paketi> --no-build --prod --json` kullanılarak gönderildi.
4. CLI exit 0; API'de yeni deployment `ready / production` ve aktif published deployment olarak doğrulandı. Yeni geliştirme projesi ayarlarının ve yayın durumunun değişmediği kontrol edildi.

Token yalnızca resmî CLI oturumu/süreç belleğinde kullanıldı; kaynak koduna, Git'e, sohbet veya loglara yazılmadı. Yeni production commit'i veya ek Git push yapılmadı.

## Yayın kimliği

| Alan | Doğrulanan değer |
| --- | --- |
| Canlı URL | [karaoglugroupnet.netlify.app](https://karaoglugroupnet.netlify.app/) |
| Gerçek proje adı | `karaoglugroupnet` |
| Project ID | `b4753086-eb94-4a7e-b5f5-7270835fab3a` |
| Yeni deployment | **`6af17892dbe0ae394ffc49ca`** |
| [Netlify deployment kaydı](https://app.netlify.com/projects/karaoglugroupnet/deploys/6af17892dbe0ae394ffc49ca) | Ready, production, published |
| [Benzersiz production deployment URL'si](https://6af17892dbe0ae394ffc49ca--karaoglugroupnet.netlify.app/) | Aynı yeni production paketi |
| Yayın zamanı | **9 Kasım 2026 10:39:08 — İstanbul** |
| Paket kaynağı | `c45a5c06146da44b3d129c2156b2f1c425de2f80` |
| Önceki production deployment | `6a462f368c237a00082c4a7b`; silinmedi |
| Otomatik Git build'leri | **Durduruldu** (`stop_builds=true`) |

Kaynak SHA, yerelde build edilen paket ve manifest'i ifade eder; manuel CLI deployment'ının Git metadata'sına farklı bir commit uydurulmadı. Kanıtlar: [production-publish.json](production-transition/production-publish.json), [production-artifact.json](production-transition/production-artifact.json), [son salt okunur Netlify API doğrulaması](production-transition/production-final-api.json).

## Korunan yapı ve yayın kanalı

- Eski Netlify repo bağlantısı **`umutgecer01/karaoglu-group-website → main`** olarak kaldı. Production'a gönderilen paket ise güncel **`umutgecer01/karaoglugroup`** release kaynağından üretildi.
- GitHub main **`47ba0c370e8f291faff198f895c503547b95b65f`**, PR #1 taslak, release HEAD **`c45a5c0`**. Main'e push/merge yapılmadı.
- GitHub secret/environment ayarları değiştirilmedi; production token'ı veya yeni site ID'si GitHub'a yazılmadı.
- Geliştirme projesi **`80b58d06-0cbb-432c-8193-17d34ba776df`** değişmedi; otomatik build'leri açık kaldı, production/base yayını oluşturulmadı.
- Domain/DNS, site adı, build/publish ayarları ve repo bağlantısı değiştirilmedi. Site veya deployment silinmedi; yeni proje açılmadı.
- Bu geçişte tek yayın kanalı **onaylı manuel CLI** oldu. Eski Git push'ları artık production'ın üzerine otomatik yayın yapamaz. Sonraki production güncellemeleri de bilinçli manuel yayın veya ayrıca onaylanmış tek otomasyon kanalı gerektirir.

## Gerçek production URL'sinde yapılan kontroller

Bu sonuçlar draft'a değil, **https://karaoglugroupnet.netlify.app/** adresindeki yeni yayına aittir. Tarayıcı testlerinde GET/HEAD dışındaki istekler engellendi; gerçek mesaj/CV gönderilmedi.

| Kontrol | Yayın sonrası sonuç |
| --- | --- |
| TR/EN/AR HTTP/SEO | **54/54** statik sayfa 200; dil/yön, tek H1, canonical ve hreflang doğrulandı |
| Indexleme | İçerik sayfalarında **index, follow**; HTTP'de preview noindex engeli yok. 404 sayfaları noindex olarak kalıyor |
| Dahili URL/görsel | **101 kaynak** HTTP kontrolünden geçti |
| Responsive | **594/594**; 54 sayfa × 11 genişlik, 320–1920 px; yatay taşma ve görünür kırık görsel yok |
| Dil değiştirme | **51/51** aynı sayfada dil geçişi; URL, başlık, içerik, lang/dir ve canonical eşleşmesi |
| Menü/form/galeri smoke | **38/38**; mobil ve masaüstü menüler, Escape, legacy hash, kapalı formlar ve otomatik yatay galeri |
| Video | Gerçek tıklamayla oynatma, poster 200, native kontroller ve görünür alan dışında pause başarılı |
| İletişim | Telefon href'i ve dış bağlantı korumaları başarılı; gerçek arama veya mesaj gönderilmedi |
| 404 | Kök, EN ve AR altında üç bilinmeyen URL **HTTP 404** |
| Sitemap / robots | Mevcut production adresi ve doğru dil yolları korunuyor |
| Security headers | Gerçek yanıtlarda CSP, HSTS, nosniff, DENY, referrer, permissions ve COOP doğrulandı |
| Cache | HTML yeniden doğrulama; hash'li assets bir yıl immutable; görseller 30 gün kuralları doğrulandı |
| Console/runtime | Son responsive ve smoke paketlerinde hata yok |

Kanıtlar: [HTTP/SEO/header/cache](production-transition/live-tests/http.json), [594 responsive ve kaynak kontrolü](production-transition/live-tests/page-audit.json), [51 dil geçişi ve video](production-transition/live-tests/behavior.json), [38 smoke kontrolü](production-transition/live-tests/smoke.json). TR mobil, EN masaüstü ve AR mobil ekran görüntüleri açılarak incelendi; hero/görseller ve yerleşim korunuyor, Drawer gri alanı yok.

İlk birleşik responsive denemesinde sayfa/boyut kontrolleri geçti; son kaynak kontrolü ağ zaman aşımıyla durdu. Tekrarda DNS ve GitHub API bağlantısı da kesildi; kısa yükleme beklemesi bir sayfada doldu. QA betiğine sınırlı GET/navigation yeniden denemeleri, daha uzun yükleme beklemesi ve sonuç checkpoint'i eklendi. Bağlantı geri geldiğinde son birleşik paket **54 sayfa / 594 kontrol / 101 kaynak / 0 console hatası** ile başarıyla tamamlandı. Giderilen test ortamı hataları ayrı kaydedildi; site kodu değiştirilmedi ve yeniden yayın yapılmadı.

## Yerel ve CI doğrulaması

9 Kasım'da Node **22.23.4** ile `npm ci`, `npm run build`, `npm test` (**10/10**), `npm run lint:security`, `npm run security:check` ve npm audit (**0 açık**) başarılı. Production ve preview HTML/SEO/form testleri **4/4** geçti. Production paketi ayrıca yeniden build edilip statik testlerden geçirildi.

`c45a5c0` için yerel CodeQL 0 bulgu; GitHub CodeQL findings/workflow, CI ve Security kontrolleri başarılı. Dört eski bulgu için suppression eklenmedi. Son salt okunur GitHub kanıtı: [github-readonly.json](production-transition/github-readonly.json).

## Formlar ve operasyon notları

**`VITE_NETLIFY_FORMS_ENABLED=false` korundu.** Canlı arayüzde gönderim düğmeleri kapalı. Gerçek mesaj veya CV gönderilmedi. Bu flag, Netlify backend alıcı/teslimat/KVKK süreçlerinin tamamlandığı anlamına gelmez; formları açmak için bu süreçler ve ayrı onay gerekir.

İçeriklerin yayınını kullanıcı son onayda kabul etti. Teknik testler şirket rakamlarının, görsel haklarının veya hukuki metinlerin bağımsız doğrulaması olarak sunulmuyor.

Gerçek telefon donanımı, Safari/Firefox/Edge, ekran okuyucu ve yeni saha LCP/INP ölçümü bu turda yapılmadı. Önceki yerel performans değerleri yeni canlı ölçüm gibi gösterilmedi.

**Durum: Onaylı production yayını ve kapsamdaki yayın sonrası doğrulama tamamlandı — YAYINDA.** Otomatik Git build'leri kapalı ve formlar kapalı olarak bırakıldı. Bu yayın için bekleyen ek izin/işlem yok; form aktivasyonu ve gelecekteki otomasyon ayrı çalışmadır.
