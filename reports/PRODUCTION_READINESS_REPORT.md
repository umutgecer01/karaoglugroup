# KARAOĞLU GROUP — Production Readiness Report

**Tarih:** 8 Kasım 2026, Europe/Istanbul  
**Karar: YAYINDAN ÖNCE DÜZELTİLMESİ GEREKENLER VAR**

Teknik iyileştirmeler mevcut proje üzerinde uygulandı. Canlı siteye yayın, Git push, DNS değişikliği veya gerçek form gönderimi yapılmadı. Netlify hesabının sunucu tarafındaki form/bildirim ayarları, onaylı hukuki metinler ve şirket içeriklerinin kanıtları bu yerel projede bulunmuyor. Bu nedenle tam yayın onayı verilmiyor.

## 1. Başlangıçta tespit edilen eksikler

[Başlangıç raporu](INITIAL_AUDIT.md), [dosya/SHA256 envanteri](initial-file-inventory.json) ve [medya envanteri](media-before.json) korundu. Başlangıç build ve lint başarılıydı; bunlar işlevlerin doğru çalıştığını tek başına göstermiyordu.

- **P0:** Üç formda `await` sonrasında `event.currentTarget` kullanımı; sunucu kabulünden sonra bile hata durumuna düşme riski. Gerçek Netlify form teslimatı doğrulanmamıştı.
- **P1:** Sayfa geçişlerinde `replaceState` nedeniyle geçmiş kaybı; dil ve URL uyumsuzluğu; hash görünümlerinin ayrı HTML içeriği/sitemap kaydı olmaması; erişilebilir olmayan modal odak yönetimi; gereksiz video indirmesi ve durdurma kontrolü eksikliği.
- **P2:** İngilizce görünümde sabit Türkçe SEO/404/menü/hero metinleri; Organization logosunun fotoğrafa işaret etmesi; responsive görsel kaynaklarının eksikliği.
- **P3:** Canlı CDN/gerçek cihaz/alan verisi ölçümleri ve çevrimiçi güncel bağımlılık taraması.

İncelenen kurulu sürümler: React/React DOM 19.2.7, Vite 6.4.5, Tailwind 3.4.19, Lucide 0.468.0, ESLint 10.14.0. JavaScript/JSX kullanılıyor; TypeScript yok. Yeni uygulama bağımlılığı eklenmedi, paket sürümü/lockfile güncellenmedi. Mevcut Arapça içerik korundu; Almanca yayımlanmadı.

## 2. Düzeltilen tasarım sorunları

Marka logosu, renkleri, mevcut lacivert/turuncu tasarım ve şirket iletişim bilgileri korundu. Navbar gerçek bağlantılarla çalışıyor; kurumsal alt menü native `details/summary` ile klavyeden açılabiliyor. Mobil kontroller ve menü bağlantıları en az 44 px yüksekliğe sahip. Form alanları mobilde 16 px metinle sunuluyor; iOS odak yakınlaştırması riski azaltıldı.

Sürekli kayan görsel bandı kullanıcı tarafından kaydırılabilir statik galeriye dönüştürüldü. Tekrarlanan dekoratif kopya gizlendi. Giriş animasyonları kaldırılarak içerik ilk anda görünür hale getirildi. Mevcut kurumsal metinler ve başarı rakamları silinmedi; doğrulanması gereken iddialar aşağıda listelendi.

## 3. Görsel optimizasyonları

16 mevcut fotoğraf için 640 px ve kaynak boyutunu aşmayan en fazla 1408 px WebP varyantları üretildi. `picture/source`, `srcset`, `sizes`, gerçek boyutlar ve uygun yükleme öncelikleri kullanılıyor. Asıl JPEG'ler uyumluluk/yedek için korunuyor. Bu yüzden **depo toplam boyutu arttı**; kazanım tarayıcının seçtiği dosyanın transfer boyutundadır.

| Fotoğraf seti | Önce | Sonra |
| --- | ---: | ---: |
| 16 JPEG / tam boy WebP karşılığı | 2.771.443 bayt | 2.184.930 bayt |
| Aynı setin mobil WebP karşılığı | 2.771.443 bayt | 934.338 bayt |
| Tam boy tasarruf | — | %21,2 |
| Mobil varyant tasarrufu | — | %66,3 |

Bu set toplamları ilk sayfa indirmesi değildir. [Dosya bazında boyut ve çözünürlük](media-after.json), [uygulamanın medya manifesti](../src/data/generatedMedia.json) ve ekran görüntüleri mevcuttur. Hero yüksek öncelikle yüklenir; alt galeri görselleri lazy yüklenir. Logo gerçek 588×164 oranıyla sunulur. Görsel kimliği değiştiren üretim veya yapay şirket fotoğrafı eklenmedi.

## 4. Video optimizasyonları

Tek MP4: 3.138.315 bayt, 1280×568, 10 saniye. Dosyada `avc1` örnek girişi mevcut; H.264 uyumluluğu Chrome'da kontrol edildi. `mp4a` örnek girişi bulunmadı; ses/altyazı içeriğinin kurumsal kontrolü yine gereklidir. Ayrıntılı ffprobe analizi yapılmadı.

Video otomatik indirilmez/oynatılmaz: `preload="none"`, optimize poster ve açık oynatma düğmesi kullanılır. Kaynak ancak kullanıcı isteğiyle eklenir. Native kontroller ses, ilerleme, duraklatma ve tam ekran sağlar; hız seçenekleri tarayıcıya bağlıdır. Görünür alan dışına çıkınca veya sekme gizlenince durur. Reduced-motion/veri tasarrufunda da kendiliğinden başlamaz.

MP4 yeniden kodlanmadı; dosya tasarrufu **0 bayt**. Kullanıcı oynatana kadar önlenen video indirmesi yaklaşık 3,14 MB. Codec dönüştürme aracı bulunmadığından kaliteyi belirsiz bir yeniden kodlama uygulanmadı.

## 5. Mobil uyumluluk

320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440 ve 1920 px: 54 sayfa üzerinde **594 kontrol**. Test edilen düzenlerde document yatay taşması ve ilk görünür alanda kırık görsel bulunmadı. Mobil menü aç/kapat, dışarı tıklama, Escape, odak dönüşü, dil değişimi ve gezinmede kapanma kontrolleri geçti.

Gizlilik penceresi native `dialog` kullanıyor: arka plan inert, odak pencere içinde, Escape ile kapanıyor; sayfa kaydırması kilitleniyor. Tercihler footer'dan tekrar açılabiliyor. Native dil seçici klavye ve dokunma desteği sağlıyor. Gerçek iPhone/Android cihaz testi yapılmadı.

## 6. Masaüstü ve tablet

İçerik genişliği, logo oranı, kart sıralaması ve tablet kırılımları aynı otomatik matrisle kontrol edildi. 390 px mobil ve 1440 px masaüstü ekran görüntüleri görsel olarak incelendi: [mobil](after-mobile.png), [masaüstü](after-desktop.png). Bu örnekler bütün sayfaların piksel düzeyinde görsel onayı anlamına gelmez.

## 7. Türkçe–İngilizce dil sistemi

TR varsayılan; EN ve mevcut AR destekli. `/tr/…`, `/en/…`, `/ar/…` adresleri, aynı sayfada dil geçişi, kalıcı tercih, geri/ileri ve yenileme destekleniyor. Eski `#faaliyetler`, `#baskan-mesaji` gibi bağlantılar korunup karşılık gelen yola taşınıyor. Dil yükleme hatasında son kullanılabilir dile dönülüyor ve yeniden yükleme seçeneği sunuluyor.

Sabit Türkçe UI metinleri yerelleştirildi: 404, hero alt/caption, menü, yukarı düğmesi, erişilebilirlik etiketleri, video ve harita kontrolleri. Çeviri anahtarlarının bütünlüğü test edildi; ham anahtar veya yeni UI metinlerinde bozuk karakter bulunmadı. Mevcut çeviri altyapısı korunarak ilerlenebilir; Almanca için onaylı içerik ve yeni dil/yol kayıtları gerekir.

## 8. SEO geliştirmeleri

Her build 54 HTML dosyası üretir: dil başına 17 içerik sayfası ve bir 404. Ana `/` Türkçe içeriği içerir ve `/tr/` canonical kullanır. Faaliyet detayları paylaşılabilir ayrı sayfalardır; önceki modal içerikleri ve galeriler bu sayfalarda korunmuştur. Her sayfada tek H1 ve benzersiz title test edildi. Kurumsal alt sayfalarda özel açıklamalar, dil bazlı OG/Twitter/canonical, TR/EN/AR + x-default hreflang ve 404 için noindex uygulanır.

Sitemap 51 indekslenebilir dil/sayfa adresini ve karşılıklarını içerir; 404'ler dışarıda bırakılır. Robots mevcut Netlify sitemap adresini gösterir. Organization logosu gerçek logo dosyasına düzeltildi. Google Search Console hesabına giriş, doğrulama kodu ekleme veya indeks isteği yapılmadı. Arama motoru indekslenmesi garanti edilmiyor.

Statik üretim React'in [resmî statik API'si](https://react.dev/reference/react-dom/static/prerenderToNodeStream) ile yapılır. Lazy sınırlar çözüldükten sonra satır içi patch betiği içermeyen HTML üretilir; istemci hydration ile etkileşimleri bağlar. Güncel olmayan bir dağıtımdan chunk yüklenemezse sayfa hata sınırı yeniden yükleme seçeneği gösterir.

## 9. Güvenlik ve gizlilik

Güvenlik lint: başarılı. Kaynak taramasında denetlenen token kalıpları, `dangerouslySetInnerHTML`, `.innerHTML =` veya debug `console.log` bulunmadı. Bu, bütün sırların/vulnerabilitelerin yokluğuna ilişkin garanti değildir. [Kaynak denetimi](source-audit.json).

Mevcut CSP korunup görsel kaynakları self/data ile daraltıldı; form-action/connect-src self, frame-ancestors none, object-src none mevcut. HSTS, nosniff, Referrer/Permissions politikaları korundu. Gizli `.env` dosyaları Git ignore kapsamına alındı. Netlify ortam sırları veya hesap güvenliği yerelden okunamadı.

Formlar: senkron tekrar gönderim kilidi, zaman aşımı, honeypot kontrolü, e-posta/telefon doğrulaması, CV tür/boyut kontrolü, alanlara bağlı hata açıklamaları ve ilk hataya odak eklendi. CV sınırı, Netlify'nin [8 MB toplam istek sınırı](https://docs.netlify.com/manage/forms/setup/#limitations) için 7 MB'a indirildi. Client doğrulaması sunucu taraflı dosya/zararlı içerik denetiminin yerini tutmaz.

**Netlify Forms doğrulanana kadar gönderim kapalıdır.** `.env.example` içinde public `VITE_NETLIFY_FORMS_ENABLED=false` bulunur. Kullanıcıya kullanılabilir telefon/WhatsApp alternatifi açıkça gösterilir; sahte başarı üretilmez. Harita, kullanıcı yüklemeyi seçene kadar üçüncü tarafa istek göndermez. Analitik/tracking eklenmedi.

`npm audit --offline --json` sıfır kayıt döndürdü; **güncel çevrimiçi güvenlik temizliği olarak yorumlanamaz**. Kullanıcı verisini/lockfile bilgisini onaysız harici servise göndermemek için çevrimiçi audit yapılmadı. Canlıya çıkmadan güncel bağımlılık taraması kalan kontroldür. Mevcut KVKK/çerez bilgilendirmesi şirket onaylı tam hukuki metnin yerini tutmaz; hukuki uygunluk onayı verilmedi.

## 10. Netlify dağıtım hazırlığı

Build komutu `npm run build`, publish dizini `dist`, Node sürümü 22. Mevcut Netlify adresi ve workflow bağlantıları korundu. Hash'li assets uzun süre immutable cache; HTML yeniden doğrulanır. Görseller/video mevcut ayrı cache kurallarını korur. Bilinen yollar fiziksel HTML dosyalarıyla sunulur; bilinmeyen yollar `404.html` ve HTTP 404 alır.

Bu davranış yerel statik QA sunucusunda test edildi. Netlify CDN yönlendirmesi, gerçek güvenlik/cache başlıkları, HTTPS sertifikası ve Forms algılama henüz canlı önizlemede doğrulanmadı. [Netlify yönlendirme kaynağı](https://docs.netlify.com/manage/routing/redirects/redirect-options/). Domain/DNS değiştirilmedi; yeni domain ancak yetkili yapılandırma ve yeniden build ile kullanılmalıdır.

## 11. Performans ölçüm sonuçları

Son ölçüm tablosu: [PERFORMANCE.md](PERFORMANCE.md). Ham veriler: [performance.json](performance.json). Fotoğraf ve MP4 boyutları yukarıda ayrı raporlandı.

<!-- measured-performance:start -->
| Metrik | Önce | Sonra |
| --- | ---: | ---: |
| Mobil Lighthouse performans puanı | N/A | N/A |
| Masaüstü Lighthouse performans puanı | N/A | N/A |
| Mobil LCP (yerel laboratuvar) | 4,26 sn | 2,544 sn |
| Masaüstü LCP (yerel laboratuvar) | 2,944 sn | 2,78 sn |
| Mobil CLS (8 saniye) | 0 | 0 |
| Masaüstü CLS (8 saniye) | 0,002 | 0 |
| INP / saha Core Web Vitals | N/A | N/A |
| Ana JavaScript dosyası | 273,44 kB | 278,009 kB |
| Ana JavaScript gzip | 85,091 kB | 86,936 kB |
| Ana CSS dosyası | 69,611 kB | 66,592 kB |
| Ana CSS gzip | 13,511 kB | 12,943 kB |
| Mobil ilk 8 sn encoded HTML + kaynaklar | 526,914 kB | 502,018 kB |
| Masaüstü ilk 8 sn encoded HTML + kaynaklar | 1.111,045 kB | 966,852 kB |
| Mobil ilk 8 sn transfer (Performance API) | 532,614 kB | 507,418 kB |
| Masaüstü ilk 8 sn transfer (Performance API) | 1.118,245 kB | 973,452 kB |
| 16 görsel / tam boy WebP seti | 2.771,443 kB | 2.184,930 kB |
| 16 görsel / mobil WebP seti | 2.771,443 kB | 934,338 kB |
| MP4 dosya boyutu | 3.138,315 kB | 3.138,315 kB (yeniden kodlanmadı) |
<!-- measured-performance:end -->

Son koşuda LCP mobilde 2,544 sn, masaüstünde 2,780 sn ölçüldü; 2,5 sn hedefi karşılanmış sayılmıyor. Önceki tek koşularla fark gözlendiği için sabit iyileşme yüzdesi veya canlı performans garantisi verilmiyor. INP ölçülmedi.

Yöntem: yerel Chrome CDP, önce/sonra her profil için tek soğuk cache koşusu; 150 ms gecikme, 1.6 Mbps indirme, 4× CPU yavaşlatma, DPR 1, 8 saniye pencere; gizlilik tercihi önceden kayıtlı. Yerel sunucu transferi/CDN/sıkıştırma davranışı canlı siteyi temsil etmez. Lighthouse/PageSpeed puanı ve saha INP **N/A**. Laboratuvar sonucu Core Web Vitals geçiş garantisi değildir.

## 12. Değiştirilen dosyalar

[Makine tarafından oluşturulmuş değişiklik envanteri](changed-files.json): kaynak, public medya, script ve kök yapılandırmaları. Raporlar ayrıca `reports/` içine eklendi. Başlıca dosyalar:

- `src/App.jsx`, `main.jsx`, `entry-server.jsx`: yollar, yerelleştirme, HTML/hydration ve hata yönetimi.
- `src/utils/routes.js`, `metadata.js`, `netlifyForms.js`, `useFormSubmission.js`: navigasyon, SEO ve form güvenilirliği.
- Header/Footer/LanguageSwitcher, Hero/ResponsiveImage, Services/ServicesPreview, RentalSection, Contact/QuickContact/Career, FormField, Dialog/PrivacyConsent, Reveal, NotFound, ScrollTopButton, PageErrorBoundary, SectionHeading.
- TR/EN/AR çeviri dosyaları, serviceGallery ve generatedMedia manifesti; `src/index.css`.
- `scripts/prerender.mjs`, `sync-site-metadata.mjs`, yerel QA/test/medya araçları.
- `index.html`, `netlify.toml`, `site.config.mjs`, `package.json`, ESLint globals, `.gitignore`, `.env.example`, README; public sitemap/WebP/logo.

`src/data/company.js` SHA256 özeti başlangıçla aynı. Git depolama metadatası bulunmayan bu arşivde Git diff/geçmiş doğrulaması yapılamadı. Git geçmişi üzerinde işlem yapılmadı. Mevcut bağımlılıklar ve kullanıcıya ait dosyalar temel alındı.

## 13. Testler ve kanıtlar

| Kontrol | Sonuç / kanıt |
| --- | --- |
| Production build | Başarılı; 54 yerelleştirilmiş sayfa + root + 404.html |
| Güvenlik lint | Başarılı, sıfır uyarı |
| Temel regresyon testleri | 4/4; yollar, benzersiz SEO, çeviri anahtarları, medya/galeri yapısı |
| Sayfa/responsive matrisi | 54 sayfa, 594 kontrol; [JSON](page-audit.json) |
| Dahili URL ve statik kaynaklar | 99 kaynak başarılı; bilinmeyen URL 404 |
| Etkileşimler | 53 kontrol; [JSON](interaction-audit.json) |
| Formlar | TR/EN iletişim, hızlı form ve kariyer: zorunlu alan, e-posta, CV zorunluluk/tür/boyut, bekleme, çift gönderim, 500 hata, 200 kabul/reset |
| Gerçek form gönderimi | **Yapılmadı.** Yanıtlar tarayıcıda taklit edildi; alıcı teslimatı doğrulanmadı. |
| Konsol / CSP | Test edilen gezinme ve etkileşimlerde runtime istisnası yok; sayfa matrisinde konsol hatası yok |
| Chunk yükleme hatası | Contact chunk'ı yerel testte engellendi; boş ekran yerine İngilizce hata ve Reload düğmesi çıktı; [kanıt](chunk-failure.json). Bu kasıtlı hata deneyi normal gezinmenin sıfır-hata sonucundan ayrıdır. |
| Video | Ön indirme yok, açık oynatma, native kontrol, görünmezken durma geçti. Gerçek tarayıcı tıklamasından sonra zamanın ilerlemesi de doğrulandı: [kanıt](video-playback.json). |
| Tarayıcılar | Yerel kurulu Chrome; Chrome mobil emülasyonu. Edge/Firefox/Safari ve gerçek cihazlar test edilmedi. |
| Erişilebilirlik | Klavye/Escape/odak, form label/error ve başlık semantiği kontrol edildi; tam WCAG AA/ekran okuyucu/kontrast sertifikasyonu yapılmadı |

Tekrar çalıştırma komutları ve sınırlar: [QA.md](QA.md). Kontrol edilmemiş tarayıcılar veya ölçümler başarılı gösterilmedi.

## 14. Çözülemeyen / dış doğrulama gerektiren problemler

1. Netlify form algılama, bildirim alıcısı, gerçek mesaj/CV teslimatı, spam sınıflandırması ve dosya erişim politikası.
2. Şirketin onaylı KVKK, gizlilik ve çerez metinleri; veri saklama/silme süreleri ve CV işleme süreçleri.
3. Fotoğraf/video kaynakları ve kullanım hakları; hangi sahaların şirkete ait olduğunun teyidi.
4. Mevcut `1000+ Kurumsal Çözüm` gibi sayısal iddiaların kanıtı ve referans/proje yayın izinleri. İçerik uydurulmadı; mevcut iddialar otomatik doğrulanmış sayılmadı.
5. Canlı Netlify preview/CDN/HTTPS, güncel çevrimiçi dependency audit, Lighthouse/PageSpeed, saha INP ve gerçek Safari/Firefox/Edge/cihaz doğrulaması.

## 15. Kullanıcıdan/şirketten sağlanması gereken bilgiler

Yetkili form alıcısı ve Netlify Forms erişimi; şirket onaylı hukuki metinler; resmî kurumsal e-posta (kaynakta yok, uydurulmadı); yayımlanmasına izin verilen proje/referans verileri; mevcut sayısal iddiaların ve medya kökenlerinin teyidi. Özel domain kullanılacaksa yetkili domain bilgisi ve Search Console doğrulama verisi ayrıca gerekir; bunlar mevcut Netlify adresinde teknik çalışmayı engellemez.

## 16. Yayın öncesi kalan kritik işler ve release checklist

- [x] Production build, lint ve temel regresyonlar geçti.
- [x] TR/EN ve mevcut AR sayfalar, dil geçişi ve URL tutarlılığı kontrol edildi.
- [x] Menü, footer, sektör detayları, geri/ileri, yenileme ve eski hash bağlantıları kontrol edildi.
- [x] 11 genişlikte otomatik layout ve görünür medya kontrolü geçti.
- [x] Görsel varyantları, video poster/istek üzerine yükleme ve pause davranışı uygulandı.
- [x] Statik HTML, title/description/canonical/OG/hreflang, sitemap ve robots hazırlandı.
- [x] Form doğrulama ve taklit hata/başarı kontrolleri geçti; gerçek teslimatla karıştırılmadı.
- [x] Şirket bilgileri korundu, eksik kurumsal veriler listelendi.
- [x] Güvenlik başlıkları ve kaynak taraması kontrol edildi; performans sınırları raporlandı.
- [ ] **P0:** Netlify Forms alıcı/algılama ve yetkili gerçek test teslimatını doğrula; ardından `VITE_NETLIFY_FORMS_ENABLED=true` ile yeni build al. [Resmî kurulum](https://docs.netlify.com/manage/forms/setup/).
- [ ] **P0:** Şirket onaylı hukuki metinleri ve kişisel veri/CV erişim-saklama politikasını tamamla.
- [ ] **P1:** Mevcut rakamlar, referanslar ve medya haklarını şirketten teyit et; doğrulanamayanları yetkili içerik kararıyla düzelt.
- [ ] **P1:** Onaylı Netlify önizlemesinde HTTP 404, güvenlik/cache başlıkları, HTTPS ve formları doğrula.
- [ ] **P1:** Güncel çevrimiçi bağımlılık taraması ve gerçek hedef tarayıcı/cihaz/ekran okuyucu kontrollerini tamamla.
- [ ] Lighthouse/PageSpeed ve canlı saha ölçümleri al; ölçülmeyen INP için sonuç iddia etme.
- [ ] Canlı ortamda LCP ≤2,5 sn hedefini doğrula; son yerel koşu bu hedefin üstünde.
- [ ] Yetkili son yayın onayını al.

**Sonuç:** Teknik build ve yerel QA başarılıdır. Yukarıdaki P0/P1 dış doğrulama ve içerik işleri tamamlanmadan siteye “YAYINA HAZIR” onayı verilmemelidir.
