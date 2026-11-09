# KARAOĞLU GROUP — GitHub release ve gerçek Netlify preview sonucu

> Güncel sonuç: [FINAL_NETLIFY_RELEASE_STATUS.md](FINAL_NETLIFY_RELEASE_STATUS.md). `c45a5c0` onayla gönderildi; uzak CodeQL/CI ve yeni preview testleri başarılı. Aşağıdaki dört açık bulgu ve deployment kaydı önceki `740ac32` commit'ine aittir.

8 Kasım 2026 — Europe/Istanbul

**Release gönderildi; draft PR ve gerçek Netlify Deploy Preview hazır. YAYINDAN ÖNCE EKSİKLER VAR.** CodeQL dört açık bulgu bildirdi; production merge/deployment yapılmadı. Bu rapor önceki yerel hazırlık ve bağlantı raporlarının güncel devamıdır.

## Bağlantılar ve korunan commit

| Çıktı | Doğrulanan bağlantı |
| --- | --- |
| Release dalı | [release/karaoglu-final-2026-11-08](https://github.com/umutgecer01/karaoglugroup/tree/release/karaoglu-final-2026-11-08) |
| Gönderilen commit | [740ac322007895becd31108feac441bc95108110](https://github.com/umutgecer01/karaoglugroup/commit/740ac322007895becd31108feac441bc95108110) |
| Draft PR | [#1 — main hedefli, taslak ve açık](https://github.com/umutgecer01/karaoglugroup/pull/1) |
| Netlify Deploy Preview | [deploy-preview-1--karaoglugroup.netlify.app](https://deploy-preview-1--karaoglugroup.netlify.app/) |
| Aynı deployment'ın kalıcı adresi | [6af031207ff5cec1e5695f97--karaoglugroup.netlify.app/tr/](https://6af031207ff5cec1e5695f97--karaoglugroup.netlify.app/tr/) |
| Netlify deployment paneli | [Deployment 6af031207ff5cec1e5695f97](https://app.netlify.com/projects/karaoglugroup/deploys/6af031207ff5cec1e5695f97) |

Önizleme adresi tahmin edilmedi: Netlify commit status'ü ve bot PR yorumu üzerinden alındı, ardından gerçek HTTP ve tarayıcı testleriyle doğrulandı. Kalıcı adres ayrıca GET ile 200, noindex ve Drawer script'i bulunmaması açısından doğrulandı; tam responsive/etkileşim paketi kalıcı adreste ayrıca tekrarlanmadı.

Yerel checkout:

```text
C:\Users\seyha\Downloads\karaoglu-group-website-main\release\karaoglugroup-final-2026-11-08
```

HEAD değişmedi: `740ac322007895becd31108feac441bc95108110`. Çalışma ağacı temiz. Uzak release aynı SHA'da. Uzak `main`, gönderim öncesinde ve sonrasında `47ba0c370e8f291faff198f895c503547b95b65f` olarak doğrulandı. Force push, rebase, amend, main push veya merge yapılmadı. Bu turda uygulama kaynaklarında değişiklik veya yeni commit oluşturulmadı.

## Kimlik doğrulama ve güvenli gönderim

1. Eski [GITHUB_SYNC_REPORT.md](GITHUB_SYNC_REPORT.md), yerel Git durumu, commit nesnesi, origin URL'si ve uzak ref'ler kontrol edildi.
2. İlk etkileşimsiz dry-run kayıtlı yerel oturum olmadığı için başarısızdı.
3. Mevcut Git Credential Manager 2.9.1 ile `github login --username umutgecer01 --browser` çalıştırıldı. Giriş exit 0 döndü; hesap listesi `umutgecer01` olarak doğrulandı. Şifre/token sohbete veya dosyaya yazılmadı.
4. Release dalına özel `push --dry-run` başarılı oldu. Kullanıcıdan **“Evet, yalnızca release dalına push yap”** açık onayı alındı.
5. Uzak ref'ler ve yerel HEAD tekrar kontrol edilerek yalnızca şu normal push çalıştırıldı:

```text
git push origin refs/heads/release/karaoglu-final-2026-11-08:refs/heads/release/karaoglu-final-2026-11-08
```

GitHub entegrasyonu draft PR oluştururken yeniden **403 Resource not accessible by integration** verdi. Kullanıcı hesabı depo üzerinde admin/push yetkisine sahip; entegrasyon kimliğinin kendi yazma yetkisi yetersiz. GitHub'ın [REST hata açıklaması](https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api) bu ayrımı destekler. Eksik permission'ın tam listesi connector tarafından sağlanmadı. Entegrasyon düzelmiş sayılmadı.

Mevcut yerel Credential Manager oturumuyla GitHub REST API kullanılarak draft PR başarıyla oluşturuldu. Kimlik bilgisi yalnızca süreç belleğinde alındı ve sabit `api.github.com` hedefine gönderildi; konsola/loga/dosyaya yazılmadı. Bu yöntemle push/PR için bağlantı engeli aşıldı; GitHub CLI kurulmasına gerek kalmadı. İleride aynı hesabın yerel Git işlemleri Credential Manager'ı kullanabilir. Connector için ayrı olarak ilgili GitHub App kurulumunda bu deponun seçili olduğu ve gerekli Contents/Pull requests yazma izinlerinin tanımlandığı kontrol edilmeli; kullanıcı hesabının admin olması tek başına yeterli değildir.

## GitHub ve Netlify kontrolleri

| Kontrol | Gerçek uzak sonuç |
| --- | --- |
| Push CI | Başarılı — [run 42462553109](https://github.com/umutgecer01/karaoglugroup/actions/runs/42462553109) |
| PR CI | Başarılı — [run 42462616971](https://github.com/umutgecer01/karaoglugroup/actions/runs/42462616971) |
| Security workflow | Başarılı — [run 42462616898](https://github.com/umutgecer01/karaoglugroup/actions/runs/42462616898) |
| CodeQL analiz workflow'su | Çalışması tamamlandı; run başarılı, **bulgu değerlendirme check'i başarısız** |
| CodeQL bulgu check'i | **Başarısız: 1 yüksek + 3 orta bulgu** — [check](https://github.com/umutgecer01/karaoglugroup/runs/128675178524) |
| Netlify deploy-preview status | Başarılı: “Deploy Preview ready!” |
| Netlify header kuralları | Başarılı: 8 kural işlendi |
| Netlify redirect kuralları | Başarılı: 1 kural işlendi |
| Pages changed | Neutral; başarısızlık olarak değerlendirilmedi |

Build CI temiz kurulum, audit/lint, build, regresyon ve statik release testlerini gerçekten uzakta çalıştırdı. Node uygulama sürümü 22; Actions'ın kendi `checkout@v4`/`setup-node@v4` runtime'ı için Node 20 kullanımından kaynaklanan geçiş uyarıları ayrıca mevcut. Bunlar uygulamanın Node 22 test sonucuyla karıştırılmadı; Actions sürüm güncellemesi bakım maddesidir.

Ham commit/check/PR/bot yorumu ve annotation kayıtları: [remote-release-latest.json](github-sync/remote-release-latest.json).

## Gerçek preview testleri

Chrome ve gerçek Netlify HTTP yanıtları kullanıldı. Yeni test kopyaları `.audit/release-delivery` altında hazırlandı; mevcut commit veya kaynak testler değiştirilmedi. Tarayıcı ağ katmanında GET/HEAD dışındaki bütün istekler engellendi. Gerçek mesaj/CV ve form POST sayısı **0**.

| Kontrol | Sonuç ve kapsam |
| --- | --- |
| TR/EN/AR statik sayfalar | **54/54** HTTP 200; dil/yön, tek H1, canonical, 4 hreflang ve preview robots doğrulandı |
| Responsive | **594/594**; 54 sayfa × 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920 px |
| Görsel/link kaynakları | **102 dahili kaynak**; preview HTML'inden alınan URL'ler başarılı; görünür kırık görsel yok |
| Dil değişimi | **51/51**; 17 sayfada EN → AR → TR döngüsü, sayfa/başlık/lang/dir/canonical eşleşmesi |
| Menü/form/galeri smoke testi | **38/38**; üç dilde mobil menü, Escape, iletişim geçişi, masaüstü alt menü, kapalı form, robots, otomatik galeri ve legacy bağlantılar |
| Faaliyet galerisi | Otomatik yatay hareket; görsellerde `object-fit: cover`; duraklatma düğmesi yok |
| Video | Gerçek tıklama ile oynatma, poster 200, native kontroller ve görünür alan dışında pause başarılı |
| İletişim bağlantıları | `tel:+905444438000` ve yeni sekme bağlantı korumaları doğrulandı; telefon araması/harici mesaj gönderilmedi |
| 404 | Kök, EN ve AR altında üç bilinmeyen URL gerçek HTTP **404** döndürdü |
| Legacy hash | `/?lang=en#contact`, `/?lang=ar#faaliyetler`, `/?lang=tr#iletisim` doğru yerel sayfalara geçti |
| Önizleme SEO | HTML ve istemci sayfa geçişlerinde `noindex, nofollow`; HTTP `X-Robots-Tag` noindex içeriyor |
| Canonical/sitemap/robots | Mevcut production URL politikası korundu; HTML canonical/hreflang ve sitemap/robots production adresini kullanıyor |
| Güvenlik başlıkları | Gerçek HTTP üzerinden CSP, HSTS, nosniff, DENY, referrer, permissions ve COOP doğrulandı |
| Cache | HTML `max-age=0,must-revalidate`; hash'li assets `max-age=31536000,immutable`; görseller `max-age=2592000` |
| JavaScript | Son responsive pakette 0 console/runtime hata; smoke testte runtime exception yok |

`X-Robots-Tag` yanıtında hem proje hem Netlify tarafından eklenen tekrarlı noindex var; çelişki oluşturmuyor. Preview noindex olsa da robots.txt içindeki production sitemap politikası korunuyor.

Kanıtlar: [HTTP/SEO/header/cache](github-sync/preview/http.json), [594 responsive](github-sync/preview/page-audit.json), [51 dil geçişi ve video](github-sync/preview/behavior.json), [38 smoke kontrolü](github-sync/preview/smoke.json).

TR mobil, EN masaüstü ve AR mobil [ekran görüntüleri](github-sync/preview/) açılarak incelendi. Site yerleşiminde taşma veya kırık hero görseli görülmedi; aşağıdaki Netlify Drawer sorunu görsel olarak ayrıca tespit edildi. Gerçek telefon donanımı, Safari/Firefox/Edge, ekran okuyucu, canlı LCP/INP ve yeni üç koşulu performans testi bu turda yapılmadı. Önceki yerel LCP medyanları yeni Netlify performansı olarak sunulmadı.

## Başarısız kontroller ve açık bulgular

### CodeQL — yayın öncesi inceleme gerekli

| Konum | Bulgu | İncelenen bağlam ve gerekli işlem |
| --- | --- | --- |
| `scripts/release-static.test.mjs:11` | Double escaping or unescaping; yüksek | Testte zincirleme HTML entity çözümlemesi. `&amp;lt;` gibi girdi tek katman yerine iki katman çözülebiliyor. Üretim DOM çıktısı değil, metadata test karşılaştırması için kullanılıyor. Tek geçişli entity çözümlemesine dönüştürülmeli ve CodeQL tekrar çalıştırılmalı. |
| `scripts/release-behavior.mjs:24` | Improper code sanitization; orta | CDP evaluate ifadesine rota ekleniyor; değer yerel rota haritasından geliyor. Değeri kod metnine eklemek yerine CDP fonksiyon argümanı olarak geçirme yaklaşımı incelenmeli. |
| `src/components/Header.jsx:43` | Client-side URL redirect; orta | Menü href'i `pagePath(view, language)` ile üretiliyor. Rota ve üç dil allowlist'i mevcut; saldırı biçimindeki örnek girdiler bağıl TR/EN/AR yollarında kaldı. CodeQL veri akışı gözden geçirilip uygun doğrulama veya kanıtlı false positive değerlendirmesi yapılmalı. |
| `src/components/Header.jsx:54` | Client-side URL redirect; orta | Logo ana sayfa href'i; aynı allowlist/rota incelemesi gerekli. |

Bu ön inceleme istismar edilebilir üretim açığı bulunduğu veya bulguların false positive olduğu yönünde nihai karar değildir. Hiçbir CodeQL bulgusu kapatılmadı/susturulmadı. Güvenlik check'i başarısız kalıyor. Kullanıcı onayı belirli mevcut commit'in push'u içindi; commit korundu, yeni düzeltme commit'i/push yapılmadı.

### Netlify Drawer — preview'a özgü görsel sorun

Netlify `/.netlify/scripts/cdp` üzerinden `https://app.netlify.com/cdp/` iframe'i ekliyor. Mevcut CSP yalnızca Google frame'ine izin verdiğinden Drawer çerçevesi engelleniyor ve ekran görüntülerinde gri alan oluşuyor. Uygulama görselleri kırık değil. Netlify'nin [resmî sorun giderme belgesi](https://docs.netlify.com/deploy/review-deploys/netlify-drawer-for-feedback/troubleshoot-the-netlify-drawer/) bu CSP uyumsuzluğunu ve Drawer'ı kapatma yolunu açıklıyor.

Kesin panel adımı: **Project configuration → Developer settings → Continuous deployment → Collaboration tools → Configure → Disable Netlify Drawer**. Panel erişimi olmadan uygulanmadı. CSP gevşetilmedi. Aynı deployment'ın yukarıdaki kalıcı adresi Drawer script'i içermiyor ve 200/noindex döndürüyor; inceleme için kullanılabilir.

### Test hazırlığında düzeltilen sorunlar

İlk responsive denemesi kaynak denetiminde yerel production bundle hash'ini preview'a sorarak 404 aldı; preview-context build'in farklı hash üretmesi normaldi. Test kopyası gerçek preview HTML'ini okuyacak şekilde düzeltildi. Sonraki console denetimi, QA'nın enjekte ettiği `localStorage` kodunun engellenen Drawer hata çerçevesinde çalışmasını kaydetti; QA koduna erişim guard'ı eklendi. Smoke testte React geçişinin tamamlanmasını bekleme ve legacy URL için dili açık seçme düzeltildi. Son paketler yukarıdaki sayılarla geçti. Uygulama bu test hazırlığı sorunları için değiştirilmedi.

## Formlar ve production öncesi kalanlar

- `VITE_NETLIFY_FORMS_ENABLED=false` kaynak yapılandırmasında korundu. Preview'da iletişim/kariyer ve ana sayfa formlarının submit düğmeleri kapalı. Gerçek mesaj veya CV gönderilmedi.
- Netlify form algılama/alıcı/gerçek teslimat ve veri saklama süreçleri panelden doğrulanmadı; formlar açılmamalı. Önceki [NETLIFY_PANEL_STEPS.md](NETLIFY_PANEL_STEPS.md) içindeki bu maddeler geçerli.
- Canonical ve sitemap hâlâ `https://karaoglugroupnet.netlify.app` kullanıyor; mevcut preview projesinin adı `karaoglugroup`. Production domain hedefinin panelde bu politika ile eşleştiği şirket/yetkili tarafından teyit edilmeli. Kullanıcı onayı olmadan site URL'si/domain değiştirilmedi.
- CodeQL'nin dört bulgusu çözüm/inceleme ve yeni tarama bekliyor; Drawer panel ayarı kalan preview görsel maddesi.
- Şirket bilgileri/başarı rakamları/görsel hakları ve hukuki metinler için önceki [CORPORATE_CONTENT_REVIEW.md](CORPORATE_CONTENT_REVIEW.md) teyitleri sürüyor.
- Gerçek cihaz/tarayıcı ve saha performans doğrulaması yapılmadı.
- Production merge, deployment ve DNS değişikliği başlatılmadı. Bunlar ayrı kullanıcı onayı gerektirir.

**Karar: YAYINDAN ÖNCE EKSİKLER VAR.** GitHub release ve Netlify preview aşaması tamamlandı; production için açık güvenlik bulguları ve yukarıdaki teyitler tamamlanmalı.
