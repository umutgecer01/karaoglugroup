# Karaoğlu Group — Düzeltme ve gerçek test sonuçları

**11 Kasım 2026 — Europe/Istanbul.** Başlangıç: `9fc9426e81eaee294ed1b1fa30cb23d078794329`. Uygulama/QA adayı: `23808829a90c90e07bec597c2f1881dede1409ea`. Dal: `release/karaoglu-final-2026-11-08`.

**Teknik düzeltmeler ve yerel otomatik QA tamamlandı. Production değiştirilmedi.** Güncel kaynak için Netlify önizlemesi hazır; gerçek önizleme üzerinde üçer Lighthouse ölçümü alındı. Canlıya geçiş, şirket/hukuk ve kalan manuel kontroller ayrı onay gerektirir.

## 1. Düzeltilen eksikler

| Bulgu | Uygulanan düzeltme | Gerçek doğrulama |
| --- | --- | --- |
| Kariyer ve İletişim iki sütun kuralı telefonlarda da geçerliydi. 320 px'de kariyer form kartı yaklaşık 141 px'e sıkışıyordu. | 1024 px altında tek sütun; alan ve kapsayıcılarda min-width:0, tam genişlik ve border-box; mobil padding ve buton genişlikleri düzenlendi. | Aynı 320 px ölçümünde kart 288 px, iki yanda 16 px boşluk. 81 yerleşim senaryosunda sorun 42'den 0'a indi. |
| Uzun CV adı, hata metni ve RTL yerleşimi kırılgandı. | Dosya adında doğal satır kırma ve dir=auto, native input içinde taşma/ellipsis; hata ve onay metinlerinde minmax/overflow-wrap kuralları. | Üç dilde uzun sentetik dosya adı; ayrıca 320 px'de üç geçersiz CV türü/hata görünümü başarılı. |
| Filo fotoğrafı ana sayfada ayrı kurumsal bölümde gösterilmiyordu. | Mevcut başlık/çeviri/tasarımı kullanan HomeFleetFeature eklendi; kiralama bağlantısı merkezi rota yardımcılarından üretildi. | TR/EN/AR, ana sayfa ve kiralama, 390/1440 px: 12 gerçek tarayıcı görünümü başarılı. |
| Filo PNG'si responsive manifestte yoktu; kodda gerçek olmayan 1536×1024 boyutları vardı. | Gerçek 1024×768 boyutları; 480/768/1024 px AVIF/WebP kaynakları; PNG fallback korundu. | Manifest/build/dosya kontrolü ve tarayıcıda AVIF seçimi. Chrome büyük PNG'yi indirmedi. |
| Mevcut üç ek inşaat fotoğrafı büyük JPEG olarak indiriliyordu. | truck-yard, generator-truck ve service-trucks için responsive AVIF/WebP; kaynak JPEG'ler korundu. | Dosyalar ve hash'ler doğrulandı; gerçek Netlify yanıtlarında da açılıyor. |
| Video için metin alternatifi yoktu; sadece preload=none, indirmeyi tarayıcının davranışına bırakıyordu. | MP4 source kullanıcı oynat düğmesine basana kadar DOM'a eklenmiyor. Üç dilde, dosya/görüntü incelemesine dayanan görsel açıklama eklendi. | Kullanıcı eylemi öncesi MP4 isteği 0; gerçek mouse olayıyla oynatma, native controls, poster ve görünür alan dışında pause başarılı. |
| Küçük turuncu metinlerde kontrast düşüktü. | WhyUs metrik etiketleri ve Process sıra numaralarının tonu açıldı; kurumsal tasarım korundu. | İlk axe bulgularında oranlar 2,93/3,78 idi; son 63 taramada otomatik ihlal 0. |
| Etiketli üç div'in uygun ARIA rolü yoktu. | Services, ServicesPreview ve Career süreç kapsayıcılarına role=group eklendi. | Eksik değerlendirme kayıtları 37'den 10'a indi; aria-prohibited-attr kaydı kalmadı. |
| Windows/CI tarayıcı QA eksikti; bazı testler sabit bekleme ve eksik Enter olayıyla kararsızdı. | Node 22/Chrome-Edge bulma, süreç sahipliği/cleanup, bekleme koşulları, doğru CDP Enter char olayı ve resume desteği eklendi. | Windows runner son turu exit 0; Tab/Enter/Escape senaryoları başarılı. |

Mevcut kullanıcı değişiklikleri, üç dil, otomatik galeri, mevcut 4:3 galeri kartları, eski İnşaat görselleri ve CodeQL düzeltmeleri korundu. Kaynak fotoğraf/video silinmedi, yeni AI görseli oluşturulmadı. Ekli örnek dosyalar incelenip uyarlandı; patch körlemesine uygulanmadı.

## 2. MOBİL KARİYER VE İLETİŞİM FORMU DÜZELTMELERİ

Değiştirilen dosyalar: `Career.jsx`, `Contact.jsx`, `QuickContact.jsx`, `FormField.jsx`, `index.css`.

- Kariyer, İletişim ve Hızlı İletişim: TR/EN/AR × 320, 360, 375, 390, 414, 430, 480, 768 ve 1440 px = **81 senaryo**.
- Telefonlarda tek sütun alanlar, genişlik 100%, min-width:0, border-box; mobil kart padding'i 16 px; gönder düğmeleri tam genişlik. Masaüstü iki sütun düzeni korundu.
- Uzun CV adı satıra kırılıyor; doğal dosya seçici görünür ve kart içinde. Geçersiz dosya uzantısı/hata metni için **3 ek 320 px kontrolü** geçti. Site etiket/hata metinleri yerelleştirilmiş; native dosya seçici yazısı ziyaretçinin tarayıcı/işletim sistemi dilini izler.
- Onay metni, hata mesajları, input/select/textarea ve dosya alanı kart dışına taşmadı. AR RTL hizaları ekran görüntülerinde incelendi.
- 390×420 küçültülmüş viewport'ta mesaj alanı odak/erişim kontrolü yapıldı. Bu, fiziksel telefonda gerçek ekran klavyesi testi değildir.
- Önce/sonra görüntüler: yerel `reports/fix-qa/before-*.png`, `reports/final-release/after-*.png`; ayrıca `after-*-cv-error-320.png`. TR kariyer, AR iletişim/CV ve filo ekran görüntüleri açılarak incelendi. Raw görüntüler Git'e eklenmez.

## 3. Çalıştırılan testler ve sonuçlar

Ortam: Windows, Node **22.23.4**, gerçek Chrome **157**, CDP 9222. Chrome ayrı test profiliyle açıldı; Edge yolu da runner'da alternatif olarak hazırlandı. Edge/Safari/Firefox çalıştırıldığı iddia edilmez.

| Kontrol | Sonuç |
| --- | --- |
| Temiz npm ci | Başarılı; sonrasında build/testler çalıştı |
| npm run build | Başarılı, 54 yerelleştirilmiş sayfa + root/404 |
| npm test | **29/29** |
| npm run lint:security ve npm run security:check | Başarılı; npm audit **0 bulgu** |
| npm ls --depth=0 | Hatasız bağımlılık ağacı |
| release-static.test.mjs | **4/4**; 54 sayfa SEO/form kapalı durumu, poster preload, başlangıçta MP4 source olmaması |
| audit-pages.mjs | **54×11 = 594/594**, 320–1920 px; **189 dahili kaynak**, yerel 404; yatay taşma/görünür kırık görsel/runtime-console hatası yok |
| audit-mobile-forms.mjs | **81 yerleşim + 3 CV hata senaryosu**, sorun 0; ağ yazma isteği 0 |
| audit-real-media.mjs | Tarım 6, İnşaat 9 (istenen üç ek fotoğraf ve mevcut diğerleri korunarak): **45** yerelleştirilmiş galeri görseli; **12** filo görünümü |
| audit-interactions.mjs | **108** kontrol; gerekli alan, e-posta/telefon, CV, honeypot, pending/çift tıklama, taklit 500/200 durumları ve menü/gezinme kontrolleri |
| release-behavior.mjs | **51** aynı sayfada dil geçişi; URL/başlık/H1/lang/dir/canonical; video poster/gerçek oynatma/pause ve iletişim bağlantıları |
| audit-keyboard.mjs | TR/EN/AR × mobil/masaüstü = **6**; skip link, Tab, Enter, Escape, menü kapatma/odak ve odak görünürlüğü |
| audit-accessibility.mjs | **63/63** görünüm, axe-core **4.14.0**, WCAG etiketli tarama: **0 otomatik ihlal** |
| Yerel release-performance.mjs | 3 mobil + 3 masaüstü; kısıtlı ağ/CPU ile gerçek CDP örnekleri; Lighthouse olarak sunulmadı |
| Netlify HTTP/medya | TR/EN/AR metadata/noindex, güvenlik/cache, 3 gerçek 404; **90** galeri dosyası + **6** filo varyantı hash eşliği; video Range **206** |

Form etkileşimleri yalnızca tarayıcı içinde taklit POST yanıtlarıyla çalıştı. **Gerçek gönderim 0**; müşteri/CV verisi kullanılmadı. Static server yalnız GET/HEAD kabul ediyor; CDP de ağ yazma isteklerini engelliyor. Formlar yalnız localhost mock sürecinde geçici olarak etkin test edildi; production/preview build ve Netlify ayarı false kaldı. Bu testler gerçek alıcıya teslimatı doğrulamaz.

## 4. Gerçek performans ölçümleri

### Netlify önizlemesi — son kaynak

İncelenen aday: [2380882 deployment](https://6af4a0ec362d02d1c8784558--karaoglugroupnet.netlify.app/tr/). API commit_ref eşliği doğrulandı. Lighthouse **13.6.0**, mobil varsayılan simülasyon ve masaüstü preset; profil başına **üç soğuk navigasyonun medyanı**:

| Metrik | Mobil | Masaüstü |
| --- | --- | --- |
| LCP | **1,675 sn** | **0,543 sn** |
| Performans | **100** | **100** |
| CLS | **0** | **0,0064** |
| TBT | **48 ms** | **0 ms** |
| Aktarım medyanı | 665.259 bayt | 654.972 bayt |

Mobil LCP örnekleri: 1,857 / 1,675 / 1,656 sn. Masaüstü: 0,768 / 0,534 / 0,543 sn. İki profil de 2,5 sn hedefinin altında. Accessibility/best-practices puanları 100; SEO **63**, önizlemenin bilerek noindex olmasıyla birlikte değerlendirilir. SEO metadata kontrolleri ayrıca geçti; noindex koruması kaldırılmadı. Bu puanlar WCAG sertifikası veya gerçek kullanıcı INP sonucu değildir.

### Yerel sonuçların sınırı

İlk sıkıştırmasız localhost ölçümü Lighthouse LCP medyanında mobil 6,043 / masaüstü 1,184 sn ve 78/97 performans puanı verdi. CDP'nin 150 ms gecikme, 1,6 Mbps, CPU 4× ve 8 sn gözlem yönteminde medyanlar 2,836 / 4,560 sn, CLS 0/0 idi. Bunlar farklı metodolojilerdir. Waterfall'da üç büyük JPEG tespit edilip responsive kaynaklar eklendi.

Netlify'nin gerçek aktarım kodlaması/CDN'si ile sıkıştırmasız localhost eşdeğer ortam değildir. Yukarıdaki iki tablo kontrollü aynı ortam A/B karşılaştırması veya tek başına ölçülmüş yüzde hız kazancı olarak sunulmaz. Esas yayın adayı için gerçek Netlify ölçümü ayrı verildi. Saha INP/RUM/CrUX ve fiziksel telefon ölçümü yapılmadı.

## 5. Medya ve video

Filo PNG fallback'i **1.736.517 bayt** ve 1024×768 olarak korundu. Aynı 1024 px AVIF **82.282**, WebP **134.808 bayt**; 768 px AVIF **49.784 bayt**. Format kalite ölçekleri eşdeğer değildir; kayıpsız kalite iddiası yapılmaz. Görseller açılarak incelendi, doğal görünüm ve araçlar korundu. Uygun viewport kaynakları seçiliyor; büyütülmüş sahte 1200/1600 px varyant yok. Üç ek İnşaat JPEG'i de orijinalleri silinmeden responsive kaynaklara alındı. Toplam **22** yeni türev dosya.

MP4 **3.138.315 bayt**, gerçek tarayıcıda süre **10 sn**. MP4 kutu/track incelemesinde yalnız `vide` handler'ı var, `soun` yok; tarayıcı ses decode sayacı da 0. 0,5 / 5 / son saniye kareleri incelendi: ofis önündeki karşılıklı araç sıraları ve koyu renkli otomobile yaklaşım görülüyor. Buna uygun TR/EN/AR görsel açıklama eklendi; konuşma, müzik veya altyazı uydurulmadı. Önce yalnız preload=none idi; şimdi kullanıcı seçmeden video source da yok. 46 KB civarı poster erken yükleniyor, native controls oynatmadan sonra açık.

Fotoğrafın dosyada bulunması, AVIF seçilmesi veya HTTP 200; şirket mülkiyeti, gerçeklik veya kullanım hakkı kanıtı değildir. Mevcut kurumsal istatistikler/1993/şirket iddiaları değiştirilmedi ve bağımsız olarak doğrulanmadı.

## 6. Erişilebilirlikte kalan manuel değerlendirmeler

Axe'nin 63 taramasında otomatik ihlal 0; **10 eksik değerlendirme kaydı** kaldı: altı video-caption kaydı ve dört kontrast inceleme kaydı. Bunlar 10 doğrulanmış hata olarak gösterilmez. Video sessiz ve görsel metin alternatifi mevcut; otomatik araç bunu tek başına sertifikalandıramaz. Kurumsal sayfanın katmanlı arka planları ve bir AR iletişim görünümü için insan kontrast incelemesi gerekir.

Tam ekran okuyucu, gerçek mobil klavye, tüm dokunmatik cihazlar ve Safari/Firefox/Edge testleri yapılmadı. Klavye otomasyonu fiziksel donanım denetimi değildir. Mevcut reduced-motion testleri korundu; otomatik galeriye yeni duraklatma düğmesi eklenmedi.

## 7. Windows ve CI altyapısı

Yeni: `scripts/run-local-qa.ps1`, `qa-helpers.mjs`, `audit-mobile-forms.mjs`, `audit-real-media.mjs`, `audit-accessibility.mjs`, `audit-keyboard.mjs`, `audit-lighthouse.mjs`. Mevcut audit-pages/interactions/release-behavior/browser-session/serve-audit geliştirildi; release-performance betiği yeniden kullanıldı. Mevcut sistem yeniden sıfırdan kurulmadı.

Runner Node 22 ve Chrome/Edge yollarını bulur, sadece kendisinin başlattığı süreçleri kapatır, 4175 build kökünü doğrular; 4180 yalnız localhost mock sunucusudur. Sistem PowerShell ilkesi değiştirilmedi; test betiği için process kapsamındaki ExecutionPolicy seçeneği kullanıldı. Media range/health endpoint'i yalnız yerel QA sunucusuna eklendi.

`package.json`: qa:windows, qa:media, qa:forms, qa:a11y, qa:lighthouse eklendi. Axe-core 4.14.0 ve Lighthouse 13.6.0 dev bağımlılıkları/lockfile kaydedildi. React 19.2.7, Vite 6.4.6 ve Tailwind 3.4.19 korundu; major paket geçişi yapılmadı.

Yeni `.github/workflows/browser-qa.yml`: Node 22, salt okunur contents izni, temiz kurulum, gerçek Chrome, medya/responsive/dil/form/klavye/axe/performance kontrolleri ve 14 günlük QA artifact'i. Aynı dalın yinelenen push/PR koşuları concurrency ile birleştirilir; cancelled yinelenen koşu test hatası diye gösterilmez. Production workflow'u tetiklenmedi veya zayıflatılmadı.

## 8. GitHub ve Netlify yayın güvenliği

[Draft PR #10](https://github.com/umutgecer01/karaoglugroup/pull/10), [release dalı](https://github.com/umutgecer01/karaoglugroup/tree/release/karaoglu-final-2026-11-08). GitHub uygulaması PR yazmasını 403 ile reddetti; mevcut güvenli Git Credential Manager oturumuyla PR oluşturuldu. Şifre/token istenmedi, kaynak/log/rapora yazılmadı. Commit öncesi dosya yolu ve credential imza kontrolleri uygulandı. Force push/rebase/amend yapılmadı.

Production: `https://karaoglugroupnet.netlify.app/`, site **b4753086-eb94-4a7e-b5f5-7270835fab3a**. Published deploy **6af3680cd9b11a5369e06045**, kaynak **838a208**, **locked=true**; tekrar API ile okundu. Main hâlâ 838a208. Repo/branch/build/publish, DNS/domain, secrets ve ikinci Netlify projesi değiştirilmedi. Canlı TR/EN/AR güvenlik başlıkları ve gerçek 404 yanıtları salt okunur test edildi; bu yeni düzeltmeler canlı sonuçları diye sunulmadı.

Yetkili salt okunur GitHub API, production environment ve main protection için 404 verdi; görünür production environment/reviewer koruması doğrulanamadı. Repo secret listesinde NETLIFY_AUTH_TOKEN adı yok; hiçbir secret değeri okunmadı. Manuel workflow'da environment/reviewer/ana dal/preview SHA ve hedef site guardları var; bunların gerçek hesap kurulumu tamamlandı diye bir iddia yok. Production otomasyonunun etkinleştirilmesi ayrı onaylı yönetim işlemidir.

**11 Kasım 20:17 İstanbul son uzak doğrulama:** `2380882` kaynağında [PR CI](https://github.com/umutgecer01/karaoglugroup/actions/runs/43065132394), [Security](https://github.com/umutgecer01/karaoglugroup/actions/runs/43065132318), [CodeQL](https://github.com/umutgecer01/karaoglugroup/actions/runs/43065132330), [Browser QA](https://github.com/umutgecer01/karaoglugroup/actions/runs/43065132337) ve push CI **başarılı**. Browser QA; temiz kurulum, build, medya, 594 matris, dil/video, form/klavye, axe ve performans adımlarını uzakta da tamamladı. İki mevcut Netlify projesinin preview kontrolleri başarılı; ana hedef eski `karaoglugroupnet` projesidir. Yinelenen push Browser QA koşusu concurrency nedeniyle cancelled; yerine aynı kaynak için PR koşusu başarılıdır. Pages changed neutral, başarısızlık değildir.

Bu raporun tamamlanma kaydı ve AGENTS review bilgisi dokümantasyon commit'inde tutulur. Dokümantasyon commit'i yeni uygulama davranışı veya production yayını olarak gösterilmez; yukarıdaki ölçüm ve testlerin uygulama kaynağı `2380882`dir.

## 9. Değiştirilen dosyalar

- Form/yerleşim: Career.jsx, Contact.jsx, QuickContact.jsx, FormField.jsx, index.css.
- Ana sayfa/medya/semantik: App.jsx, yeni HomeFleetFeature.jsx, RentalSection.jsx, FleetShowcaseVideo.jsx, WhyUs.jsx, Process.jsx, Services.jsx, ServicesPreview.jsx.
- Veri: generatedMedia.json, TR/EN/AR çevirileri ve 22 AVIF/WebP türevi. Eski görseller/MP4 korundu.
- Araçlar: package.json/lockfile; yukarıdaki QA betikleri; mevcut audit-pages, audit-interactions, browser-session, release-behavior, release-static ve serve-audit dosyaları; browser-qa workflow'u.
- Belge: bu rapor ve güncel review bilgisini taşıyan AGENTS.md. Eski denetim/tarihsel production raporları yeniden yazılmadı. Tam değişiklikler PR Files görünümündedir.

## 10. Başarısız ilk denemeler ve sınırlar

İlk axe taraması gerçek kontrast sorunlarını buldu; bunlar düzeltildi. İlk tarama build sırasında başladığı için bir readiness hatasıyla da yarım kaldı; son testler build tamamlandıktan sonra çalıştırıldı. Sabit 450 ms dil geçişi beklemesi ve CDP Enter olayında char eksikliği ilk etkileşim/klavye koşularını durdurdu; doğru bekleme ve gerçek Enter char olayıyla tekrarlandı. Galeri testinin eski contain varsayımı güncel 4:3 cover tasarımına göre düzeltildi; mevcut kullanıcı tasarımı değiştirilmedi. İlk Windows çağrısı execution policy nedeniyle başlamadı; process kapsamındaki seçenekle çalıştırıldı. Çözülmüş ilk denemeler final başarı sonuçlarından saklanmadı.

Son API sorgularında Node HTTP istemcisi bağlantı zaman aşımı verdi; Windows HTTP istemcisiyle aynı yetkili oturumdan sonuçlar başarıyla okundu. DNS/proxy/makine güvenlik ayarı değiştirilmedi. Kontroller cihaz/tarayıcı ve yöntem kapsamındadır. Güvenlik audit'i 0 bulgu olması tam penetrasyon testi veya gelecekte açık oluşmayacağı garantisi değildir. Gerçek form alıcısı, teslimat, saklama ve KVKK süreçleri test edilmedi.

## 11. Kullanıcı onayı ve yayına hazırlık

**Kod düzeltmeleri ve otomatik test kapsamı tamamlandı; YAYINDAN ÖNCE ONAY/MANUEL İNCELEME EKSİKLERİ VAR.**

Ayrı onay veya insan incelemesi gerekenler: production yayını ve kilit yönetimi; main merge; branch protection/production environment/reviewer/secret kurulumu; medya/kişi/plaka ve şirket iddialarının teyidi; kalan kontrast/ekran okuyucu/gerçek cihaz incelemeleri. Form aktivasyonu ayrıca alıcı, teslimat, CV saklama/erişim/silme ve KVKK onayı gerektirir. Bunlar uydurulmadı veya otomatik onaylanmadı.

`VITE_NETLIFY_FORMS_ENABLED=false` korundu. Canlıya deployment, unlock, main merge/push, DNS/site bağlantısı/secret değişikliği ve gerçek form gönderimi yapılmadı. Kullanıcıdan dosya kopyalaması ya da terminal işlemi yapması istenmedi.

## 12. Kanıt ve devam edilebilirlik

Yerel raw kanıtlar: `reports/final-release/` (son UI/form/axe/dil/klavye/medya), `reports/fix-qa/` (önce görüntüleri, API/HTTP ve Netlify ölçümleri), `.audit/fix-qa/` (runner logları ve ilk sıkıştırmasız ölçüm). Bunlar Git'e eklenmez; Markdown sonuçlar Git'tedir. CI kendi raporlarını QA artifact'inde saklar. Ana yerel giriş noktası npm run qa:windows'tur; normal kullanımda tüm yerel kalite adımlarını çalıştırır. Bu raporun tarihli sonuçları, daha sonraki değişikliklere otomatik taşınmaz.
