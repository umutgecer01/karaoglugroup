# Karaoğlu Grup — GitHub/Netlify kontrollü yayın raporu

Tarih: 12 Kasım 2026, yaklaşık 15:38, Europe/Istanbul. Bu rapor bu oturumdaki API okumaları ve yeni test çalıştırmalarını kapsar. Yeni production yayını yapılmadı; çalışan eski sürüm korunup tekrar kilitlendi. Son adayın yayını bağımsız inceleme ve production environment kurulumu nedeniyle bekliyor.

## Kaynak ve yayın kimlikleri

| Kalem | Doğrulanan durum |
| --- | --- |
| Depo/remote | `https://github.com/umutgecer01/karaoglugroup.git` |
| Güncel main | `838a208275d9fcd5c8b4083458c05ef9239c51bb` |
| Güncel release | `296af1a413e1e9c1739f11311e88b4cbcb68d7cb` |
| Başlangıç geliştirme commit'i | `6826c9cc90a91008b961a8283b3d976c8a5ab7d1` |
| Test edilen son geliştirme commit'i | `87cc6811c24f2483abf3c805ae52d625955cdcaf` |
| Geliştirme dalı | `feature/prelaunch-forms-domain-references-20261112` |
| PR #11 | Açık, incelemeye hazır; release hedefli. Bağımsız onay olmadığı için birleştirilmedi. |
| PR #10 | Açık ve taslak; main hedefli. PR #11 release'e alınmadığı için head eski release SHA'sında. Birleştirilmedi. |
| Netlify projesi | `karaoglugroupnet` |
| Site ID | `b4753086-eb94-4a7e-b5f5-7270835fab3a` |
| Gerçek production deployment | `6af3680cd9b11a5369e06045` |
| Canlı kaynağın commit'i | `838a208275d9fcd5c8b4083458c05ef9239c51bb` |
| Canlı URL | https://karaoglugroupnet.netlify.app/tr/ |
| Production durumu | API: `ready`, `locked=true`; published ID aynı kaldı. |
| Son aday preview deployment | `6af5b153404c6b37c6f3fbb6` |
| Preview kaynak SHA | `87cc6811c24f2483abf3c805ae52d625955cdcaf` |
| Preview durumu | API: `ready`, `deploy-preview`, review ID 11, `published_at=null`. Production değildir. |
| Form aktivasyonu | Global, iletişim ve kariyer bayrakları `false`; gerçek gönderim yok. |

İncelenen sabit önizleme: https://6af5b153404c6b37c6f3fbb6--karaoglugroupnet.netlify.app/tr/ . Güncel PR alias'ı: https://deploy-preview-11--karaoglugroupnet.netlify.app/tr/ . PR #10'un mevcut önizlemesi `6af4a351376079d3b4722c6b`, kaynak `296af1a413e1e9c1739f11311e88b4cbcb68d7cb`; en yeni geliştirmeleri içerdiği iddia edilmez.

## Başlangıçtaki gerçek durum ve yapılan güvenli işlemler

İlk okumada canlı deployment ve kaynak SHA beklenen değerlerle aynıydı; yayın kilidi **kapalıydı** (`locked=false`). Kullanıcının açık talimatıyla yalnızca aynı mevcut deployment için lock API uygulandı. Ardından site ve deploy API'leriyle `locked=true`, aynı published ID ve kaynak doğrulandı. Yeni içerik yayınlanmadı; unlock, `--prod` veya geçmiş silme uygulanmadı.

GitHub'ın ilk cevapları: main protection 404/“Branch not protected”; main/release etkin kurallar ve rulesets boş; environments listesi 200/0 kayıt; production environment 404; repository secrets 200/0 kayıt; iki PR'ın reviews listesi boş. Tek yetkili collaborator/PR yazarı `umutgecer01`. Repository administration yetkisi API'den doğrulandı.

**Bağımsız onay başlangıçta platformun mevcut ayarlarından kaynaklanmıyordu.** Kullanıcının ilk yayın talimatı ve depodaki `validateEnvironment` kodu bunu şart koşuyor. Kullanıcı ayrıca ikinci bağımsız hesap bulunmadığını, hesap uydurulmamasını ve güvenlik kapılarının atlanmamasını bu oturumda teyit etti. Bu nedenle bağımsız onay beklemeye alındı.

Kullanıcının eksik güvenli yapılandırmaları tamamlama yetkisiyle main ve release için koruma oluşturuldu ve GET ile doğrulandı:

- PR ve en az bir onay; stale onayların düşmesi; son push'ın farklı kişi tarafından onaylanması.
- Yöneticiler dahil koruma, güncel branch ve çözümlenmiş konuşmalar.
- `Build site`, `Security checks`, `Analyze JavaScript`, `CodeQL`, `browser-qa`, `netlify/karaoglugroupnet/deploy-preview` zorunlu kontrolleri.
- Force push ve branch silme kapalı.

Netlify `allowed_branches` başlangıçta yalnızca `main` idi. Release hedefli PR #11'in preview üretebilmesi için yalnızca `release/karaoglu-final-2026-11-08` eklendi. Repo bağlantısı, production branch, build komutu/dizini, environment değerleri, domain ve yayın baseline'ının değişmediği kontrol edildi. Git build `stop_builds=false` kaldı. Netlify [Deploy overview](https://docs.netlify.com/deploy/deploy-overview/) belgesi preview hedefinin production veya branch deploy kapsamındaki dal olması gerektiğini açıklar.

PR #11 incelemeye hazır hale getirildi. GitHub eklentisi bu GraphQL işlemine “Resource not accessible by integration” döndürdü; mevcut yetkili GitHub credential'ı ile aynı resmi API işlemi tamamlandı. Credential değerleri çıktı, dosya veya commit'e yazılmadı.

## Kod incelemesi ve düzeltmeler

PR #11'in başlangıçtaki 28 dosyası yerel Git diff üzerinden incelendi. Form türüne göre ayrı etkinleştirme, gönderim öncesi form adı kontrolü, honeypot ve CV doğrulaması korundu. Onaysız referans listesi boş, doğrulanmamış kurumsal e-posta alanları `null`. TR/EN/AR ve domain SEO hazırlığı korunuyor. Gerçek domain veya form alıcısı uydurulmadı.

Son commit ile production workflow'da iletişim/kariyer bayrakları da açıkça `false` yapıldı. Ön kontrol üç bayrağın da tam olarak `false` olmasını ve tam main SHA için `browser-qa` başarısını arıyor. Browser QA workflow'una main push tetiklemesi eklendi; böylece merge sonrası tam main SHA için kontrol üretilebilir. Bu davranışlar için başarısız durumları da kapsayan guard testleri genişletildi. Deployment checklist ve güncelliğini yitirmiş rollback başlangıç kaydı düzeltildi.

Main ve release'e doğrudan push yapılmadı. Force push, merge, production dispatch, yeni repo/site, ikinci Netlify projesine işlem, DNS/domain değişikliği veya gerçek kişisel veri gönderimi yapılmadı.

## Bu oturumda yeniden çalıştırılan testler

Windows, Node `22.23.4`, Vite `6.4.6`:

| Kontrol | Sonuç |
| --- | --- |
| `npm.cmd ci` | Başarılı; 318 paket kuruldu. |
| `npm.cmd test` | 34/34 başarılı; son güvenlik düzeltmeleri dahil. |
| `npm.cmd run security:check` | Başarılı; npm audit 0 açık, security ESLint 0 hata/uyarı. |
| `npm.cmd run build` | Production bağlamında başarılı. |
| `node --test scripts/release-static.test.mjs` | Production 5/5; ayrıca preview bağlamında 5/5. |
| `npm.cmd run qa:windows` | Tam paket başarılı; runner adımlarının tamamı exit 0. |
| Responsive | 54 sayfa × 11 genişlik = 594 kontrol; 320–1920 px. |
| Kaynak/link ve 404 | 189 iç kaynak başarılı; eksik URL gerçek HTTP 404. |
| Mobil formlar | 81 görünüm, 3 CV hata senaryosu; 0 taşma/sorun, gerçek gönderim 0. |
| Etkileşim | 108 kontrol; yalnızca yerel mock taşıması, gerçek gönderim yok. |
| Dil/video | 51 aynı-sayfa dil geçişi; kullanıcı hareketiyle video oynatma/poster/duraklatma. |
| Klavye | TR/EN/AR mobil/masaüstü 6 senaryo başarılı. |
| Erişilebilirlik | 63 axe taraması; 0 otomatik ihlal. Manuel WCAG sertifikası değildir. |
| Konsol | 54 sayfalık taramada 0 konsol/runtime hatası. |
| Medya | Yerelleştirilmiş galeri/filo ve gerçek fotoğraflar kontrol edildi; video sessiz, yerelleştirilmiş görsel açıklama var. |
| `git diff --check` | Başarılı. |

Yerel üretim build'inde 54 yerelleştirilmiş sayfa, 51 sitemap girdisi, canonical/hreflang, OG/Twitter, Organization metadata, kapalı formlar ve production'da preview `_headers` bulunmaması yeniden doğrulandı. 320 px Türkçe kariyer ve Arapça iletişim ekran görüntüleri görsel olarak da incelendi.

## Uzak GitHub kontrolleri

Son aday commit `87cc6811c24f2483abf3c805ae52d625955cdcaf` için:

- [CI / Build site](https://github.com/umutgecer01/karaoglugroup/actions/runs/43218472962): başarılı; mevcut ve önerilen domain derleme kontrolleri dahil.
- [Security](https://github.com/umutgecer01/karaoglugroup/actions/runs/43218472857): başarılı.
- [CodeQL / Analyze JavaScript](https://github.com/umutgecer01/karaoglugroup/actions/runs/43218473170): başarılı; findings check de başarılı.
- [Browser QA](https://github.com/umutgecer01/karaoglugroup/actions/runs/43218472778): başarılı; güncel PR koşusu tamamlandı.
- Aynı projedeki Netlify deploy-preview status: başarılı.

Push ve PR aynı SHA için iki Browser QA koşusu oluşturdu; eski push koşusu concurrency nedeniyle iptal edildi. İptal başarı gibi sayılmadı; güncel PR koşusu esas alınır. İlk `6826c9c` sonuçları son commit'in sonuçları olarak kullanılmadı. Main/release üzerindeki eski başarılı uzak kontroller ayrıca API'den okundu; bunlar son geliştirmelerin main'e geçtiği anlamına gelmez.

Son API kontrolünde açık Code Scanning bulgusu 0. Tam `87cc681…` SHA için CodeQL analiz kaydı `2151877143`, 87 kural, boş error alanı ile doğrulandı.

## Önizleme ve bütünlük kanıtı

Netlify API, son preview deployment'ını doğru site ve tam `87cc681…` kaynağıyla eşleştirdi. Sabit deployment URL'sinde 54 sayfa HTTP, dil, canonical, noindex meta/header ve kapalı submit butonları bakımından geçti. 32 JS/CSS ve 3 önemli görselin tamamı hem Netlify deployment dosya manifest'indeki SHA-1 ile hem aynı bağlamdaki yerel preview build'inin SHA-256 değerleriyle eşleşti: 35/35.

İlk karşılaştırmada production-context build'in JS adları preview'da aranmış ve 28 adet 404 alınmıştı. Gerçek neden `vite.config.js` içindeki `__DEPLOY_PREVIEW__` compile-time bayrağıdır: preview ve production JS hash'lerinin farklı olması beklenir. Aynı preview bağlamında yeniden build edilince dosya adları ve hash'ler birebir eşleşti. İlk başarısız karşılaştırma başarılı gibi gösterilmedi; bu kaynak uygulama hatası değildi.

Yerel production aday build'i 235 dosyalık SHA-256 manifest'iyle kaydedildi. Manifest SHA-256: `82301ab70cb35bad6ec6069226b82130e0cafae884be5264a817daf5073a4336`. Bu, onaylanmış main artifact'i veya yeni production yayını değildir. Önizleme öncesi production dosyaları `.audit/controlled-candidate-production-dist/` altında korundu.

## Performans

Bu oturumdaki Lighthouse `13.6.0`, üç soğuk gezinme/profil medyanları:

| Ortam | Mobil performans / LCP / CLS | Masaüstü performans / LCP / CLS |
| --- | --- | --- |
| Yerel sıkıştırmasız HTTP | 82 / 4,838 sn / 0 | 99 / 0,893 sn / 0,0064 |
| Sabit Netlify preview | 100 / 1,730 sn / 0 | 100 / 0,612 sn / 0,0064 |

Yerelde accessibility, best practices ve SEO tüm ölçümlerde 100. Netlify preview'da noindex nedeniyle SEO puanı production SEO puanı olarak yorumlanmaz. Bu ölçümler laboratuvar verisidir; gerçek cihaz/Safari, saha INP veya yeni production ölçümü değildir. Yerel mobil LCP iyileştirme alanıdır; ölçülmemiş sonuç 100 olarak raporlanmadı.

Preview mobil tekil performans sonuçları 100, 100, 89; medyan 100'dür, her koşu 100 değildir. TBT medyanı 63 ms. Masaüstü üç koşu 100. Preview accessibility ve best practices 100; SEO 63. SEO'da başarısız ölçüt `is-crawlable` (noindex ile indekslemeye kapalı) olarak raporlandı; preview noindex kaldırılmadı. Lighthouse'un render-blocking, image delivery ve forced reflow önerileri optimizasyon alanı olarak kalır.

## Gerçek canlı sitede yapılan kontroller

Mevcut eski production için bu oturumda GET/HEAD ile doğrulanan sayfalar:

- https://karaoglugroupnet.netlify.app/tr/
- https://karaoglugroupnet.netlify.app/en/
- https://karaoglugroupnet.netlify.app/ar/
- https://karaoglugroupnet.netlify.app/tr/iletisim/
- https://karaoglugroupnet.netlify.app/tr/kariyer/
- https://karaoglugroupnet.netlify.app/tr/portfoy/

Altısı da HTTP 200; doğru dil/canonical, dört hreflang, tek H1, index/follow ve kapalı submit butonları doğrulandı. HTML'de başvurulan 27 tekil medya/JS kaynağı HEAD ile 200 döndü. CSP, nosniff, DENY ve HSTS başlıkları var; production'da noindex HTTP header yok. Uydurma eksik URL 404 döndü. Bunlar eski yayının HTTP/statik kontrolleridir; canlı navigasyon ve formlar için yeni uzak etkileşim testi yapıldığı iddia edilmez.

## Kesin engeller ve gereken panel işlemleri

1. **Bağımsız yetkili reviewer yok.** Şirket gerçek bir kişiyi yetkilendirdiğinde GitHub Settings → Collaborators üzerinden uygun yetkiyle davet edilmeli. PR yazarı veya aynı kişinin kontrolündeki ikinci hesap bağımsız onay yerine kullanılmamalı. Bu adım beklemede; korumalar düşürülmeyecek.
2. **Production environment yok.** GitHub Settings → Environments → `production`: yetkili bağımsız Required reviewer seçilmeli, Prevent self-review açılmalı, yönetici bypass'ı kapatılmalı; deployment branch yalnızca main olmalı. Reviewer olmadan korumasız environment oluşturulmadı.
3. **Environment secret sağlanmadı.** Yetkili sahip doğru Netlify projesine erişen uygun bir `NETLIFY_AUTH_TOKEN` değerini production environment secret olarak panelden eklemeli. Yerel CLI oturumu vardır; bu, GitHub environment secret'ının kurulu olduğu anlamına gelmez. Token sohbet/log/kod üzerinden aktarılmamalı.
4. Reviewer son PR #11 head'ini ve doğrulanmış preview'u inceleyip onayladıktan sonra korumalı merge yapılabilir. Ardından release'in yeni SHA'sı için PR #10, CI/Security/CodeQL/Browser QA ve aynı-proje preview yeniden değerlendirilmeli; PR #10 review-ready yapılmalı ve bağımsız onay alınmalı. Şu an release en yeni geliştirmeleri içermiyor.
5. Ancak bunlardan sonra yeni main'in tam SHA'sı ve incelenen preview'ın Git tree eşitliği doğrulanmalı. Main'in tam SHA kontrolleri geçince Actions → Publish approved Karaoglu production release çalıştırılmalı; doğru iki SHA ve `PUBLISH_KARAOGLUGROUPNET` girilmeli; gerçek environment onayı beklenmeli. Yeni, ayrı production artifact/draft, hash doğrulama ve kilitli yayın adımları o zaman uygulanmalı. Şimdiki eski main ile bu akış başlatılmadı.
6. Safari/fiziksel cihaz, ekran okuyucu ve kalan manuel medya/hukuk onayları bu ortamda tamamlanmadı. Şirketçe doğrulanmış referans, e-posta, form alıcıları ve özel CV saklama/KVKK kararları da ayrı bekler; bu görev formları açmaz.

Netlify'da mevcut yayın korunuyor ve release tabanlı preview altyapısı çalışıyor. Yeni site, domain veya DNS işlemi gerekmiyor. Önceki deployment'lar korunuyor. Rollback yapılmadı.

Ek uzak Chrome/DevTools testini başlatma isteği otomatik onay denetimi tarafından `blocked by policy` gerekçesiyle reddedildi. Engellenen işlem yeniden denenerek aşılmadı; uzak etkileşim testi tamamlanmadı. Standart projedeki Lighthouse ölçümü ayrı çalıştırıldı; HTTP/hash ve yerel Chrome testleri bu engelden etkilenmedi.

## Saklanan kanıtlar ve kapsam

Kimlik bilgisi içermeyen ham kayıtlar `.audit/current-controlled-state.json`, `.audit/github-controlled-state.json`, `.audit/protection-main.json`, `.audit/protection-release.json`, `.audit/release-preview-configuration.json`, `.audit/current-live-http.json`, `.audit/candidate-preview-verification.json`, `.audit/candidate-preview-local-name-comparison.json`, `.audit/controlled-candidate-build-manifest.json` ve `.audit/controlled-preview-performance/` altında. Yerel QA `reports/final-release/runner-steps.json` ve ilgili yeni JSON/görsellerde. Ham kayıtlar Git'e eklenmedi.

Bu rapor test edilen feature commit'ini değiştirmemek için ayrı `audit/controlled-release-20261112` dalında yalnızca dokümantasyon commit'i olarak saklanır. Main, release ve PR #11 kaynak SHA'sı rapor kaydı için değiştirilmez; canlı yayın tetiklenmez.

**Sonuç:** GitHub/Netlify güvenli hazırlıkları ve son aday doğrulamaları tamamlandı; en yeni sürüm production'a geçirilmedi. Bağımsız reviewer ve korumalı production environment/secret olmadan yayın yapılmayacak.
