# KARAOĞLU GROUP — Final Development & Operations

9 Kasım 2026 — Europe/Istanbul

**Bu çalışma mevcut canlı yayını koruyarak teknik hazırlık yapar. Yeni production deployment, main merge, secret/hesap yapılandırması, form aktivasyonu veya gerçek gönderim yapılmaz.** Önceki yayın onayı bu yeni değişikliklerin canlıya alınmasına genişletilmedi.

## 1. Genel proje durumu

**A — TAMAMLANDI:** Mevcut proje ve tarihsel raporlar, kaynak/config/script/medya envanteri ve kullanıcının ZIP şablonu incelendi. ZIP yalnızca iki küçük metin dosyalı referans pakettir; eski varsayımlar yeni koda kopyalanmadı. Başlangıç çalışma ağacı temiz, release HEAD `d4287c5`; `origin` doğru depoya bağlı. Git bundle yedeği ve mevcut production paketi/manifest'i yerelde korundu.

**B — TEKNİK OLARAK HAZIR:** Yeni release normal push ile gönderildi; gerçek önizleme ve CI/CodeQL doğrulandı. Production workflow kodu hazır; environment/token/main geçişi tamamlanmadı.

**C — ONAY VEYA BİLGİ GEREKİYOR:** Bağımsız reviewer, production environment/token ve main merge kararı; form alıcıları/veri süreçleri; şirket/medya/hukuk teyitleri. Mevcut canlı adres değişmedi.

## 2. GitHub/Netlify kalıcı yapı

Kalıcı kaynak `umutgecer01/karaoglugroup`. Production ve ana PR önizleme projesi `karaoglugroupnet`, ID **b4753086-eb94-4a7e-b5f5-7270835fab3a**. Git build **açık** (`stop_builds=false`), yayın **kilitli**. Bu, istemdeki eski `stop_builds=true` başlangıç varsayımından farklı ve API ile doğrulandı. İkincil `karaoglugroup` projesi `80b58d06-0cbb-432c-8193-17d34ba776df` korunur, production hedefi değildir. [Mimari](../GITHUB_NETLIFY_ARCHITECTURE.md).

## 3. Eski ve yeni repo bağlantıları

Eski `umutgecer01/karaoglu-group-website` deposu mevcut, arşivlenmemiş ve silinmedi. Production artık yeni `karaoglugroup → main` bağlantısını kullanıyor; bu çalışma bağlantıyı değiştirmedi. Main **47ba0c370e8f291faff198f895c503547b95b65f**, ilk yükleme. Güncel canlı uygulama kaynağı **6ca07f9aefcf84cc1ae56ecbabc0f19fd1b6a5f5**; başlangıç release HEAD d4287c5 aradaki yalnızca yayın belgelerini içeriyor. Canlı ile main eşit değildir. `c45a5c0` canlı kaynağın daha eski sürümüdür; sonrasında Corporate kartları ve kayıt/preview otomasyonu eklenmiştir. Güncel çalışma bu yeni tabanı korur.

## 4. Production yayın yöntemi

Mevcut canlı deployment **6af18e98278ff0906ad9ca6a**, ready/published/locked. Şu an tek aktif yöntem ayrıca onaylı yetkili CLI/API operasyonudur. Gelecek normal kanal için manuel GitHub Actions hazırlandı; henüz main'e alınmış/secret ile çalışır durumda sayılmaz. Production paketi ayrı context ile build edilir, SHA256 manifest'i doğrulanır; draft yüklenip incelendikten sonra yalnızca o deployment yayınlanıp kilitlenir. Genel yayın kilidi açılmaz. CLI ve Actions eşzamanlı kullanılmaz. [Yayın rehberi](../DEPLOYMENT_GUIDE.md), [geri dönüş planı](../ROLLBACK_GUIDE.md).

## 5. GitHub Actions güvenliği

Workflow yalnızca `workflow_dispatch` ile, main ve tam SHA/onay ifadesi ile çalışır. Exact main ve incelenen aynı-proje preview tree kimlikleri eşit olmalı. Remote CI/Security/CodeQL analizi ve açık high/critical Code Scanning kontrolü gerekir. Sabit doğru Project ID/API URL doğrulanır; environment reviewer/Prevent self-review yoksa işlem durur. Token yalnızca yayın adımının ortamındadır, CLI argümanına yazılmaz. Resmî CLI **27.16.2** sabit; concurrency iptal etmeden sıraya koyar. Hash manifest/checkpoint, gelecekteki workflow çalışmasında 30 günlük artifact olarak saklanır. Gerçek production workflow çalıştırılmadı. CI feature/* push testlerini de kapsar; üretim push tetikleyicisi eklenmedi.

## 6. Secrets ve yetki durumu

Yetkili GitHub API: public repo, admin/maintain/push true; main protection **404**, rulesets **boş**, environment listesi **boş**, repository secrets **boş**. Production environment ve secret endpoint'leri 404. Bunlar raporlandı; uzaktan ayar yazılmadı. Reviewer kullanıcı/takımının şirketçe belirlenmesi gerekir. Yerel resmî Netlify oturumu iki projeyi okuyabiliyor; mevcut olmayan GitHub production secret'ının erişimi doğrulanmış sayılamaz. Secret değerleri API'den geri okunamaz; hiçbir değer istenmedi/loglanmadı/koda yazılmadı. Repo webhook listesi boş, Netlify tarafında çalışan GitHub App hook'ları var; bu iki bilgi karıştırılmadı.

## 7. Formların teknik durumu

Üç arayüz formu korundu: hızlı iletişim, kurumsal iletişim ve kariyer. Netlify isimleri corporate-contact / career-application. Zorunlu alanların native required/ARIA açıklamaları ve pending aria-busy geliştirildi; CV hata ID'sindeki boş referans giderildi. Ortak CV doğrulaması boş/desteksiz/7 MB üzeri ve bilinen uzantı–MIME çelişkilerini reddeder. Tarayıcı doğrulaması backend güvenliği sayılmaz. Dokuz TR/EN/AR başarı ifadesi yalnızca alınan yanıtı anlatır; departman/e-posta teslimatı iddiası kaldırıldı. **VITE_NETLIFY_FORMS_ENABLED=false**.

API'de use_forms=true ve ignore_html_forms=false: algılama açık. İki form, bütün alanları/cv ile kayıtlı, submissionCount 0. Submission veya CV içeriği okunmadı. Build'de form-name/data-netlify/honeypot/multipart union statik testlerle doğrulanır. [Form rehberi](../FORM_OPERATIONS_GUIDE.md).

## 8. İletişim bildirimleri

Netlify'deki dokuz hook yalnızca GitHub App deploy bildirimidir; form e-postası hook'u yok. Kullanıcı bu çalışmada alıcıları **“belirlenmedi”** olarak teyit etti. İletişim ve kariyer alıcıları ayrı hazırlanabilir; adres uydurulmadı veya public şirket verisinden tahmin edilmedi. Gerçek adres/ekip yetkisi ve ayrıca onay olmadan bildirim oluşturulmadı. HTTP 200 gelen kutusu teslimatını kanıtlamaz.

## 9. Kariyer ve CV güvenliği

Frontend PDF/DOC/DOCX, boş dosya ve 7 MB sınırı hazır. Gerçek CV gönderimi 0. Netlify'nin dosya linki/erişim/saklama davranışı için ek kişisel veri koruması gereklidir; frontend flag'i veya MIME kontrolü özel erişim/antivirüs sayılmaz. Şirketçe onaylı özel dosya işleme/erişim altyapısı, saklama–silme ve aktarım politikası doğrulanmadan kariyer açılmaz. Dosya URL'si oluşturulmadı/paylaşılmadı. [Resmî kaynaklar ve kontrol listesi](../FORM_OPERATIONS_GUIDE.md).

## 10. KVKK/hukuki onay durumu

Şirketin veri sorumlusu/tüzel unvanı, işleme amaçları, kariyer/CV erişimi, alıcı/aktarım, saklama süresi, silme ve hak başvuru kanalı için onaylı metinler eksik. Önceki içerik yayın izni, bağımsız hukuk uygunluğu teyidi değildir. Yeni hukuki metin uydurulmadı veya yayınlanmadı. Mevcut metinlere tam uyum sertifikası verilmez; şirket yetkilisi ve gerektiğinde hukuk uzmanı onayı gerekir.

## 11. Kurumsal içerik eksikleri

1993, 30+/+30, 1000+ ve yönetici/proje/faaliyet iddiaları kaynak ve teyit tablosuna işlendi; kullanıcı onaylı mevcut bilgiler değiştirilmedi. Tüzel şirket adı ve resmî e-posta gibi eksikler uydurulmadı. [CORPORATE_CONTENT_REVIEW.md](../CORPORATE_CONTENT_REVIEW.md).

## 12. Medya ve görsel hakları

16 logo dışı orijinal JPEG/JPG, logo ve MP4 teknik envanteri incelendi. Responsive WebP/srcset, öncelikli hero, lazy medya ve isteğe bağlı video korundu; yeniden encode/kalite düşürme yapılmadı. Bazı WebP dosyaları JPEG'den büyük; fırsat olarak kaydedildi. Kaynak/izin olmadan hiçbir tesis/araç görseli şirkete ait, stok veya AI diye kesin sınıflandırılmadı. [MEDIA_RIGHTS_REVIEW.md](../MEDIA_RIGHTS_REVIEW.md).

## 13. Mobil/masaüstü sonuçları

**Yerel production build:** 54 sayfa × 11 genişlik (320,360,375,390,414,430,768,1024,1280,1440,1920), **594/594** responsive; 101 dahili kaynak, gerçek 404, taşma/kırık görünür görsel/console hatası yok. **138/138** etkileşim/form kontrolü; etkin form senaryoları yalnızca ayrı localhost Vite oturumu ve taklit 500/200 yanıtlarıyla yapıldı, CDP gerçek POST'ları ayrıca engelledi.

Mevcut tercihler penceresine kalıcı hareket azaltma seçeneği eklendi; kullanıcı tarafından kaldırılan galeri pause düğmesi geri eklenmedi. Cihaz tercihi her zaman korunur, kapalı storage'da ziyaret belleği çalışır; galeri reduced-motion durumunda elle kayar. **15/15** tarayıcı tercihi/footer kontrolü ve **5/5** unit testi geçti. Footer başlıkları aynı sınıflarla H2 oldu. Bu, tüm WCAG 2.2 AA veya kontrast/ekran okuyucu sertifikası değildir. Gerçek telefon/Safari/Firefox/Edge testi yapılmadı.

## 14. Dil sistemi

TR/EN/AR key eşitliği, metadata ve rota round-trip unit testleri geçti. Üç dilde form açıklamaları ve yeni motion tercih etiketleri var; RTL korunur. Aynı sayfada dil geçişi yerel etkileşim testinde doğrulandı. Ayrıca gerçek yeni preview üzerinde bağımsız paket **51/51** aynı sayfada dil geçişini ve video/iletişim kontrollerini geçti; JSON ve ekran görüntüleri kaydedildi.

## 15. SEO ve Search Console

54 üretilen sayfada metadata/form statik testleri **4/4**, tek H1 ve hreflang/canonical yapısı başarılı. Kaynak/başlangıç HTML denetiminde dil bazında yinelenen title/description ve eksik img alt niteliği yok. Organization JSON parse edildi; doğrulanmamış şirket verisi eklenmedi. Production indexable, preview noindex politikası korunur. Search Console hesabı, ownership veya sitemap gönderimi yapılmadı; hazır adımlar: [SEARCH_CONSOLE_GUIDE.md](../SEARCH_CONSOLE_GUIDE.md).

## 16. Performans sonuçları

Hero WebP/preload/srcset, route bazlı JS, static HTML, cache ve isteğe bağlı video korundu. Resmî npm paketinden doğrulanan **Lighthouse 13.6.0** ayrı yerel araç klasörüne kuruldu. Gerçek `f746a39` Netlify preview permalink'inde her profil için **3 soğuk navigation koşusu**, toplam altı ölçüm yapıldı; varsayılan mobile simulated throttling ve desktop preset kullanıldı.

| Medyan, üçer tekrar | Mobil | Masaüstü |
| --- | --- | --- |
| LCP | **2.035 sn** | **0.559 sn** |
| CLS | **0.000** | **0.0064** |
| TBT (INP değildir) | 0 ms | 0 ms |
| Performance | 99/100 | 99/100 |
| Otomatik accessibility | 100/100 | 100/100 |
| Best practices | 100/100 | 100/100 |
| SEO | 63/100 | 63/100 |
| Toplam transfer | 800,511 byte | 764,931 byte |

SEO puanı preview'un **kasıtlı noindex** durumundan düşüyor (`is-crawlable`); preview indexlemeye açılmadı. Accessibility 100 tam WCAG veya manuel/ekran okuyucu onayı değildir. LCP öğesi `.hero-image-frame picture img`; Lighthouse ilk HTML'de keşfedilebilir, lazy olmayan ve fetchpriority=high koşullarını doğruladı. Medya dosyaları/kalite değiştirilmedi.

Eski 2.544/2.780 sn ve sonraki 1.980/2.140 sn özel **yerel CDP ölçümleridir**; yeni Netlify Lighthouse profilleriyle aynı yöntem değildir. Yüzdesel kazanç veya saha Core Web Vitals geçişi iddiası yapılmaz. Yeni laboratuvar medyanları 2.5 sn altında; **production saha LCP/CLS/INP N/A**, RUM/CrUX erişimi yok.

Yeni build entry JS **280,363 byte / gzip 87,675**, CSS **61,189 / gzip 11,531**. Önceki canlı pakette entry JS 278,500 ve CSS 60,603 byte idi; güvenli form/motion ekleri JS'i 1,863 ve CSS'i 586 byte artırdı. Gzip yerelde hesaplandı; HTTP transferi diye sunulmaz. Kanıt: `reports/master-operations/lighthouse/summary.json` ve `preview-identity.json`.

## 17. Güvenlik ve CodeQL sonuçları

Temiz npm ci: 209 paket, audit 0; Node22.23.4. npm test **29/29** (13 mevcut +2 CV +5 motion +9 publication guards), lint ve security:check başarılı. Bilinen dört eski CodeQL düzeltmesi korundu. Yeni **f746a39473b3f19b59cd8d3e0ba7ccbe8d46ec52** için GitHub CI, Security, Analyze JavaScript ve **CodeQL — No new alerts** başarılı. Yeni yerel CodeQL CLI analizi ayrıca çalıştırılmadı; uzak sonuç yerel tarama diye sunulmaz. CSP gevşetilmedi; token/secrets/gerçek form verisi Git'e alınmadı.

## 18. Değiştirilen dosyalar

- Manual production workflow, CI feature branch kapsamı, dört scripts/production-* koruma/işletim/test dosyası.
- Üç form, FormField, ortak CV validator ve forms-readiness testi; dokuz mevcut başarı çevirisi.
- MotionPreference bileşeni/controller/test, main başlangıcı, mevcut PrivacyConsent penceresi, footer H2, dar CSS reduced-motion kuralları ve iki yeni TR/EN/AR anahtarı.
- package.json test listesi, AGENTS/README/PREVIEW_DEPLOYMENT ve mimari/yayın/checklist/rollback/form/kurumsal/medya/Search Console belgeleri.
- Bu rapor ve önceki kurumsal teyit raporunun güncel belgeye işaretçisi. Netlify config/form flag ve şirket gerçekleri korunur. Tam dosya listesi normal Git diff/commit geçmişindedir.

## 19. Başarılı/başarısız testler

Yukarıdaki yerel ci/build/29 unit/lint/audit/4 statik/594 responsive/138 etkileşim/15 motion sonuçları yeni çalışma üzerinde gerçekten çalıştırıldı. İlk etkileşim denemesi sabit 450 ms dil yükleme beklentisinde durdu; gerçek durum beklemesiyle QA yardımcı kopyası düzeltildi ve 138 kontrol geçti. İlk motion denemesi OS tercihi değiştirilirken QA state hatasıyla durdu; kaynak değişmeden tekrar 15 kontrol geçti. Bu geçici QA hataları gizlenmedi. Yetkili gerçek form/CV teslimatı, yeni production yayını/rollback ve production workflow çalıştırması **YAPILMADI**.

Yerel statik sunucu cache/Netlify CDN davranışını taklit etmez; gerçek preview/production header testleri ayrı raporlanır. Ham QA JSON/log/PNG ve yerel araçlar Git dışında `reports/master-operations/` / `.audit/` altında kalır.

**Gerçek yeni preview:** deployment **6af19d440fce5a7145662b7a**, f746a39 kaynağı, ready; aynı-proje GitHub status success. [Önizleme](https://deploy-preview-1--karaoglugroupnet.netlify.app/), [ölçülen sabit permalink](https://6af19d440fce5a7145662b7a--karaoglugroupnet.netlify.app/tr/). GET/HEAD paketi **54 sayfa, 102 kaynak, üç HTTP 404, 0 hata**, bir geçici ağ tekrarı. Noindex, canonical/hreflang, sitemap/robots, security ve cache başarılı. Ayrı tarayıcıda **15/15 motion/tercih**, **51/51 dil**, video poster/gerçek tıklama/pause ve iletişim linkleri başarılı. İlk preview motion denemesi SSR görünürken galeri hydration'ı bitmeden etkileşti; galeri effect'i beklenerek QA hazır olma koşulu düzeltildi, uygulama kodu değişmeden geçti.

**Korunan mevcut production:** ayrı GET/HEAD denetimi **54 sayfa, 101 kaynak, üç HTTP 404, 0 hata**; yeni kodun production testi diye sunulmaz. API'de canlı kimliği hâlâ **6af18e98278ff0906ad9ca6a**, kilit true, Git build açık. Yeni production deployment yok. Yeni kodun 594 responsive matrisi **yerel** testtir; tamamı gerçek preview/production üzerinde yeniden çalışmış gibi gösterilmez.

TR/AR mobil ekran görüntüleri açılarak incelendi; içerik, RTL, hero ve hizalar korunuyor. Preview alias'ında alt gri alan **Netlify Drawer** çerçevesine ait: `/.netlify/scripts/cdp` script'i ve CSP'nin izin vermediği `https://app.netlify.com/cdp/` iframe'i DOM'da doğrulandı. Ölçülen sabit permalink'te Drawer script/iframe yok. Bu preview hizmeti sorunu ürün CSS'iyle gizlenmedi ve production CSP gevşetilmedi. Panelde **Project configuration → Developer settings → Continuous deployment → Collaboration tools → Configure → Disable Netlify Drawer** adımı hazır; uygulanmadı. Drawer kapatılması ayrı panel işlemi olarak onay bekler; temiz inceleme için yukarıdaki sabit permalink kullanılabilir.

## 20. Bekleyen kullanıcı onayları

**C — ONAY VEYA BİLGİ GEREKİYOR:** Main merge; reviewer/branch protection/environment kurulumu; production secret yazımı; bu yeni sürümün canlı yayını; iletişim/kariyer alıcıları; KVKK/veri sorumlusu/saklama/özel CV erişim kararı; izinli gerçek test ve teslimat; ayrıca form aktivasyonu; medya/kurumsal bilgi teyidi; Google ownership ve preview Drawer panel işlemi. Bu onaylar birbirinin yerine kullanılamaz.

## 21. Sonraki güvenli operasyon adımları

1. Teknik değişiklikler mevcut izinle release dalına **f746a39** olarak normal push edildi; PR #1 draft, yeni aynı-proje noindex preview ve CI/CodeQL doğrulandı. Bu sonuçları kaydeden sonraki dokümantasyon commit'i uygulama kodunu değiştirmez.
2. Şirket uygun reviewer ve form/veri sorumlularını belirlesin; hazırlanan panel adımlarını gerekli açık onaylarla tamamlayın.
3. Preview/CI/CodeQL ve içerik incelemesi sonrasında main'e kontrollü merge için ayrıca izin alın. Exact main SHA testleri başarılı olmadan manuel production workflow kapıları açılmaz.
4. İlgili tam SHA için ayrı canlı yayın onayı alın. Mevcut kilit ve yedekler korunarak yalnızca tek publication kanalı kullanılsın; bu çalışma kendiliğinden yayın yapmaz.
5. Formlar ayrı aktivasyon prosedürü tamamlanana kadar kapalı kalır.

**Karar:** Mevcut site yayında ve korunuyor. Kalıcı otomasyonun panel/secret/main geçişi ve gerçek form kullanımı için **ONAY VE BİLGİ EKSİKLERİ VAR**; bunlar tamamlandı diye sunulmuyor. Teknik değişiklikler release/preview aşamasında hazırlanır.

Son koruma incelemesinde publication HTML denetimi de sıkılaştırıldı: `aria-disabled`/`data-disabled` benzeri nitelikler gerçek native `disabled` yerine kabul edilmez. İki negatif örnek mevcut production guard testine eklendi. Bu değişiklik yalnızca yayın korumasını etkiler; f746a39 üzerinde ölçülen frontend/görseller değişmez. Sonuç belgesi 99f7f0c GitHub'a kaydedildi; o yalnızca dokümantasyon commit'inde push CI geçti, ayrıca PR/Netlify kontrolü oluşmadığı gözlendi. Güncel doğrulama, yayın koruması düzeltmesini de içeren sonraki release SHA'sı için ayrıca izlenir; eski kontrol yeni HEAD sonucu diye sunulmaz.
