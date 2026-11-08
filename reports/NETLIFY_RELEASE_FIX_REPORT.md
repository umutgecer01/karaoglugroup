# KARAOĞLU GROUP — Final Netlify release düzeltmeleri

8 Kasım 2026 — Europe/Istanbul

**Durum: Dört CodeQL bulgusu için güvenli düzeltmeler ve yerel testler tamamlandı. Yerel release düzeltmeleri push onayını bekliyor. Production'a hazır değil.**

Çalışma dalı: `release/karaoglu-final-2026-11-08`. Temel commit: `740ac322007895becd31108feac441bc95108110`. Mevcut sürüm, görseller ve otomatik faaliyet galerisi korunuyor; tasarım değiştirilmedi.

## 1. CodeQL veri akışı ve düzeltmeler

| Önceki konum | Gerçek veri akışı | Uygulanan düzeltme ve kanıt |
| --- | --- | --- |
| `scripts/release-static.test.mjs:11` | Üretilen HTML metadata'sı → zincirleme entity çözümleme → test karşılaştırması. `&amp;lt;` iki kez çözülebiliyordu. Üretim DOM sink'i değildi, fakat test yanlış bir eşleşmeyi kabul edebilirdi. | `scripts/html-entities.mjs` içindeki tek geçişli regex/callback ile yalnızca bir katman çözülüyor. İç içe ve bilinmeyen entity'ler için regresyon testi eklendi. |
| `scripts/release-behavior.mjs:24` | Rota/dil değeri → JSON.stringify → CDP `Runtime.evaluate` kod metni. JSON serileştirmesi, veriyi koddan ayıran bir taşıma protokolü değildir. | Dinamik rota ve dil karşılaştırmaları sabit fonksiyonlarla `Runtime.callFunctionOn` üzerinden yapılıyor. Değerler CDP `arguments[].value` içinde taşınıyor; fonksiyon metnine eklenmiyor. `scripts/browser-call.mjs` yardımcı fonksiyonu ve tırnak/backtick/yeni satır içeren saldırı örnekli testi eklendi. Gerçek tarayıcıda 51 dil geçişi geçti. |
| `src/components/Header.jsx:43` | URL/query/storage kaynaklı dil → `normalizeLanguage` → `pagePath` → menü href'i. Önceki doğrulama kabul edilen girdi metnini aynen geri döndürüyordu. | `src/utils/i18n.js` artık yalnızca sabit `'tr'`, `'en'`, `'ar'` değerleri döndürüyor. URL kaynaklı metin href'e taşınmıyor. Ortak yardımcı düzeltilerek Header dışındaki aynı akışlar da korunuyor. |
| `src/components/Header.jsx:54` | Aynı dil akışı → logo ana sayfa href'i. | Aynı sabit dil seçimi ile giderildi. `pagePath` ve legacy hash lookup'unda own-property denetimleri de eklendi; `constructor`/`__proto__` rota sayılmıyor. Bütün rota/dil kombinasyonları ve kötü niyetli örneklerde origin korunuyor. |

Header dosyasına yüzeysel bir uyarı bastırma eklenmedi; iki href bulgusunun ortak kaynağı düzeltildi. CodeQL sorgusu, exclude kuralı, severity, suppression veya workflow güvenlik politikası değiştirilmedi.

### Gerçek yerel CodeQL taraması

- GitHub'ın resmî `github/codeql-cli-binaries` sürümünden **CodeQL CLI 2.27.4** indirildi. ZIP SHA256: `a7ab5f73a8f440c3269f6660deb1d34f76005e756ccdf58c84c5ff88355453db`; release asset digest'iyle doğrulandı.
- `codeql/javascript-queries@2.5.0`, `javascript-code-scanning.qls` kullanıldı. **89 sorgu yürütüldü; SARIF sonucu: 0 bulgu.**
- Gerekli üç query ID'sinin paket kapsamına girdiği ayrıca doğrulandı: `js/double-escaping`, `js/bad-code-sanitization`, `js/client-side-unvalidated-url-redirection`.
- Düzeltilen iki yardımcı, `src/components/Header.jsx`, `src/utils/i18n.js` ve ilgili test betikleri veritabanı kaynak arşivinde doğrulandı.
- Bu sonuç gerçek yerel CodeQL analizidir. **Yeni commit henüz push edilmediği için GitHub PR üzerindeki eski dört bulgu bu aşamada kapanmış sayılmaz.** Yeni uzak analiz ancak onaylı push sonrasında değerlendirilecek.

Ham yerel kanıtlar `reports/codeql-fix/` altında tutulur ve Git'e eklenmez: `local-codeql.sarif`, `validation-summary.json`, `page-audit.json`, `interaction-audit.json`. SARIF için `.gitignore` kuralı eklendi.

## 2. Node 22 testleri

Node **22.23.4** kullanıldı.

| Komut / kontrol | Sonuç |
| --- | --- |
| `npm ci` | Başarılı; 209 paket, audit 0 |
| `npm run build` | Başarılı; production ve deploy-preview context'leri; 54 yerelleştirilmiş sayfa + root + 404.html |
| `npm test` | **10/10**; 3 yeni güvenlik regresyon testi dahil |
| `npm run lint:security` | Başarılı, 0 uyarı |
| `npm run security:check` | Başarılı; npm audit **0 açık** ve lint geçti |
| `node --test scripts/release-static.test.mjs` | Production **4/4**, preview **4/4**; sonunda production build yeniden doğrulandı |
| Responsive | **594/594**, 54 sayfa × 11 genişlik; TR/EN/AR, 320–1920 px |
| Dahili kaynak / görsel kontrolü | **101 kaynak** başarılı, görünür kırık görsel ve console hatası yok |
| Etkileşim | **110/110**, menü, geçmiş, kapalı form ve taklit form validation/500/200 senaryoları |
| Dil / SEO | **51/51** aynı sayfada dil değişimi; başlık, lang, dir, canonical ve içerik eşleşmesi |
| Statik SEO | 54 sayfa meta/hreflang; 51 canonical içerik sayfalı sitemap, robots, preview noindex doğrulandı |
| 404 | Yerel bilinmeyen yol gerçek 404; statik 404 çıktısı ve route round-trip testleri geçti |
| Video / iletişim | Gerçek tıklamayla oynatma, poster, native kontroller, görünür alan dışında pause, telefon href'i ve dış bağlantı korumaları başarılı |
| CodeQL | Gerçek yerel tarama **0 bulgu** |

İlk yeni rota testinin regex'i geçerli `/404/` yolundaki rakamları kabul etmiyordu; test beklentisi düzeltildi ve son paket 10/10 geçti. İlk CodeQL ZIP açma işlemi Windows uzun yol sınırına takıldı; doğrulanmış arşiv kısa bir geçici yola açılarak CLI ve analiz başarıyla çalıştırıldı. Bunlar giderildi; başarısız ilk denemeler son başarılı sonuç olarak gösterilmedi.

İletişim testlerinin etkin form bölümü yalnızca ayrı yerel Vite QA sürecinde geçici ortam değişkeniyle ve tarayıcı içinde taklit POST yanıtlarıyla yürütüldü; test süreci kapatıldı. Kaynak/build/deploy form ayarları false olarak korundu. Gerçek mesaj veya CV gönderilmedi. Gerçek cihaz, Safari/Firefox/Edge, ekran okuyucu ve yeni saha/LCP ölçümü bu turda test edilmedi.

## 3. Netlify production hedefi ve erişim sınırı

**Kullanıcının teyit ettiği production hedefi: `https://karaoglugroupnet.netlify.app/`.** Yeni `karaoglugroup` projesi yalnızca geliştirme/önizleme için kullanılacak. Production URL, canonical, sitemap, `.env.example`, `netlify.toml` ve workflow hedefleri değiştirilmedi.

| Adres / kontrol | Gerçek sonuç |
| --- | --- |
| `https://karaoglugroupnet.netlify.app/` | Public GET **200**, mevcut Karaoğlu Group başlığı; yönlendirmeyle yeni adrese taşınmadı |
| Eski adresin Netlify site API sorgusu | **401 Unauthorized**; yerel Netlify oturumu/token veya bağlı Netlify aracı bulunmuyor |
| Eski projenin Project ID'si | **Doğrulanamadı; uydurulmadı** |
| `https://karaoglugroup.netlify.app/` | Public ana adres GET **404**; bu, eski production hedefi olarak seçilmesi için gerekçe değildir |
| Yeni projenin Netlify site API sorgusu | **200**; name `karaoglugroup`, Project ID **`80b58d06-0cbb-432c-8193-17d34ba776df`**, ssl_url `https://karaoglugroup.netlify.app` |
| İki adres aynı site ID'sine mi ait? | Eski proje kimliğine yetkili erişim olmadığı için **kimlik eşitliği kesin doğrulanamadı**. HTTP davranışı veya isim benzerliği aynı site kanıtı sayılmadı. |

### Eski Project ID'yi panelden alma

1. Yetkili hesapla [Netlify Projects](https://app.netlify.com/) ekranına girin; doğru team altında **karaoglugroupnet** projesini arayın.
2. Projeyi açıp production adresinin tam olarak **`https://karaoglugroupnet.netlify.app/`** olduğunu kontrol edin. `karaoglugroup` preview projesiyle karıştırmayın.
3. **Project configuration → General → Project details → Project information → Project ID** alanını kopyalayın. Yalnızca bu ID paylaşılabilir; şifre/token gerekmez.
4. Doğru team veya proje görünmüyorsa yetkili site sahibi hesapla giriş yapın veya mevcut sahibinden erişim isteyin. Aynı adresi elde etmek için projeyi silmeyin, yeniden oluşturmayın veya yeniden adlandırmayın.

[Netlify'nin resmî API belgesi](https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/) Project ID/Site ID'nin aynı kimlik olduğunu ve panel konumunu açıklar.

### Eski projenin son sürüme bağlanması için hazırlanacak adımlar

Bu adımlar **uygulanmadı**; inceleme ve ayrı yayın onayı içindir:

1. Eski Project ID doğrulandıktan sonra mevcut repo bağlantısı, production branch, build komutu ve publish dizinini kaydedin. Repository hedefi `umutgecer01/karaoglugroup`, istenen son build `npm run build`, publish `dist`, Node `22`, site URL eski production adresi, form flag'i `false` olmalı.
2. Repo bağlı değilse veya farklıysa mevcut bağlantıyı değiştirmeden önce farkları raporlayın. Repo bağlama/branch değişikliği build tetikleyebileceğinden kullanıcı onayı olmadan değiştirmeyin.
3. GitHub Actions'taki `NETLIFY_SITE_ID` secret'ının **eski doğrulanmış Project ID** ile eşleştiği yetkili panelden kontrol edilmeli. Secret değeri GitHub'dan okunamaz; yeni preview ID'sinin production secret'ı olduğu varsayılmamalı. Bu çalışmada secret değiştirilmedi.
4. Netlify Git entegrasyonu ve production GitHub workflow'su aynı yayını iki kez tetikliyor mu kontrol edin; nihai yayın yöntemi ayrı kararlaştırılmalı. Main'e merge veya workflow_dispatch yapılmadı.
5. Yeni commit PR/preview kontrollerinden geçtikten, form/hukuki süreçler tamamlandıktan ve eski proje eşleşmesi doğrulandıktan sonra production merge/deployment için ayrı onay alın.

Site bağlantısı, production branch, hesap ayarı, proje adı, domain/DNS veya production secret'ı bu turda değiştirilmedi. Eski proje silinmedi; yeni proje production olarak seçilmedi.

## 4. Netlify Drawer

Önceki gerçek preview'daki gri alan Netlify'nin `app.netlify.com/cdp/` iframe'inden geliyor. Production CSP'nin `frame-src` listesi bu iframe'i kabul etmiyor. Sırf inceleme aracı için CSP gevşetilmedi.

**Hazır panel işlemi, henüz uygulanmadı:** Yeni **karaoglugroup** preview projesinde **Project configuration → Developer settings → Continuous deployment → Collaboration tools → Configure → Disable Netlify Drawer**. Eski production projesini değiştirmeyin. [Resmî Netlify Drawer sorun giderme belgesi](https://docs.netlify.com/deploy/review-deploys/netlify-drawer-for-feedback/troubleshoot-the-netlify-drawer/).

Mevcut eski preview deployment'ının [Drawer içermeyen kalıcı adresi](https://6af031207ff5cec1e5695f97--karaoglugroup.netlify.app/tr/) inceleme alternatifi olarak kalır; yeni commit'in yayımlandığı anlamına gelmez.

## 5. GitHub ve preview aşaması

- [Draft PR #1](https://github.com/umutgecer01/karaoglugroup/pull/1) açık ve taslak olarak kaldı.
- [Release dalı](https://github.com/umutgecer01/karaoglugroup/tree/release/karaoglu-final-2026-11-08) son uzak kontrolde hâlâ `740ac322007895becd31108feac441bc95108110` üzerinde.
- [Mevcut gerçek preview](https://deploy-preview-1--karaoglugroup.netlify.app/) Netlify status'ünde hazır, fakat **önceki commit'e ait**. Yeni düzeltmeler bu rapor aşamasında yalnızca yerelde test edildi.
- Yeni push açık onay gerektirir. Onay gelirse uzak main/release ref'leri tekrar kontrol edilerek yalnızca bu release dalına normal push yapılacak; ardından yeni commit'in CI/CodeQL/Netlify sonuçları ve gerçek preview yeniden değerlendirilecek.
- Main son kontrolde `47ba0c370e8f291faff198f895c503547b95b65f`. Main'e push, merge, force push veya production deployment yapılmadı.

## 6. Yayın kararı

**YAYINDAN ÖNCE EKSİKLER VAR.** Yerel güvenlik düzeltmeleri ve testler başarılı. Kalanlar:

1. Yeni release commit'i için kullanıcı push onayı ve ardından yeni GitHub CodeQL/CI ile gerçek Netlify preview doğrulaması.
2. Eski **karaoglugroupnet** Project ID'si ve repo/branch/production secret eşleşmesinin yetkili hesapla doğrulanması.
3. Preview Drawer panel ayarı.
4. Form alıcıları, gerçek teslimat, CV erişim/saklama ve KVKK onayı; bu süreç tamamlanmadan `VITE_NETLIFY_FORMS_ENABLED=false` kalmalı. Gerçek test gönderimi ayrıca onay gerektirir.
5. Önceki kurumsal içerik/görsel hakları ve hukuki teyitler; gerçek hedef cihaz/tarayıcı kontrolleri.
6. Production merge/deployment için ayrıca açık kullanıcı onayı. Şu anda canlı siteyi değiştiren işlem yok.
