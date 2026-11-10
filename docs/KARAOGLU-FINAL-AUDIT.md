# Karaoğlu Group — Kapsamlı Site Denetimi

**Denetim tarihi:** 10 Kasım 2026  
**Kapsam:** Kod, build çıktısı, güvenlik yapılandırması, bağımlılıklar, SEO çıktısı ve yayındaki sitenin HTTP yanıtları  
**Çalışma dalı:** `release/karaoglu-final-2026-11-08`  
**Denetim tabanı:** `838a208275d9fcd5c8b4083458c05ef9239c51bb`  

## 1. Yönetici özeti

Yayındaki site ve yerel kaynak ayrı ayrı kontrol edildi. Canlı sitedeki 51 sitemap URL'si başarılı yanıt verdi; sitemap dışında kalan bozuk/yerelleştirilmiş sayfa çıktıları yerel build testleriyle denetlendi. Production yanıtında CSP, HSTS, X-Frame-Options ve Referrer-Policy bulundu. Yerel build 54 sayfa üretti ve statik SEO/form kontrolleri geçti.

Denetim sırasında düşük riskli üç düzeltme uygulandı: kilit dosyasındaki uygun patch bağımlılık güncellemeleri, ana sayfa videosunun kullanıcı oynatmayı seçene kadar indirilmemesi ve eski PR numarasına bağlı senkronizasyon mesajının genelleştirilmesi. `AGENTS.md` içindeki eski yayın/PR bilgisi de güncellendi. Bu değişiklikler production'a gönderilmedi.

**Yayın durumu:** Production mevcut `838a208` kaynağında ve bu denetimde yayın yapılmadı, yayın kilidi açılmadı. Değişiklikler `main` dalına doğrudan gönderilmedi. Production'a geçiş için gerekli inceleme ve açık yayın onayı beklenmelidir.

## 2. Mimari ve proje durumu

- React 19, Vite 6, Tailwind CSS 3; statik prerender ve üç dil: Türkçe (`tr`), İngilizce (`en`), Arapça (`ar`).
- Netlify statik barındırma; GitHub Actions CI ve güvenlik kontrolleri.
- Aktif dal `release/karaoglu-final-2026-11-08`; başlangıç commit'i `838a208`.
- Üretim sitesi: `https://karaoglugroupnet.netlify.app/`; doğrulanmış Netlify site kimliği `b4753086-eb94-4a7e-b5f5-7270835fab3a`.
- Form gönderimleri kapalı; denetimde gerçek kullanıcı/müşteri/CV verisi kullanılmadı.
- Mevcut görsel ve fotoğraflar korundu; yeni AI görseli üretilmedi.

## 3. İncelenen sayfalar ve HTTP

Canlı sitemap'teki 51 adresin hepsi HTTP 200 döndürdü. Üç dilde ana sayfa, sitemap'te yer alan içerik sayfaları ve bunların temel dahili kaynakları kontrol edildi. Sitemap 51 URL içeriyor; robots.txt 200 ve sitemap yönlendirmesi içeriyor. Yerel prerender, 54 HTML çıktısının metadata ve form kapalı durumu bakımından testini geçti.

Canlı kaynak kontrolünde 83 dahili CSS/JS/görsel/medya adresi HEAD isteğiyle sınandı; başarısız kaynak bulunmadı. Bu tarama, tarayıcı etkileşimi veya her breakpoint'te görsel düzen testi değildir.

## 4. Güvenlik

### Bağımlılıklar

- `npm audit --audit-level=moderate`: 0 güvenlik açığı.
- Güvenli aralık içindeki güncellemeler lockfile'a uygulandı: Vite `6.4.6`, Autoprefixer `10.6.2`, `eslint-plugin-security` `4.2.1`.
- `npm ls --depth=0` bağımlılık ağacını hatasız listeledi.
- React ve React DOM `19.2.7`; `19.3.1` patch/minor aralığında kullanılabilir güncelleme mevcut. Vite 8, Tailwind 4, Lucide 1 ve Vite React plugin 6 major güncellemeleri mevcut; uyumluluk değerlendirmesi yapılmadı ve uygulanmadı.
- Lockfile güncellendi, package.json aralıkları korundu. `npm ci --ignore-scripts --dry-run` başarılı.

### Uygulama kodu ve sırlar

- Kaynakta `dangerouslySetInnerHTML`, `innerHTML`, `eval` veya `new Function` eşleşmesi bulunmadı.
- Tarayıcıya gömülü gizli anahtar için yaygın yüksek güvenli imzalar kaynakta ve erişilebilir Git geçmişinde aranıp eşleşme bulunmadı. Gerçek secret değerleri rapora alınmadı.
- Üretim uygulama kodunda debug `console.log`/`console.debug` izi bulunmadı; scriptlerdeki build/test logları bunun dışındadır.
- Dış harita iframe'i kullanıcı seçimiyle yükleniyor; CSP'deki `frame-src https://www.google.com` bu işlevle sınırlı.
- Yeni sekmede açılan bağlantıların `noopener`/`noreferrer` davranışı kod ve mevcut statik güvenlik kontrolleri kapsamında incelendi.

### Production HTTP güvenlik başlıkları

Canlı `/tr/` yanıtı şu başlıkları içeriyor:

- CSP: `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, kaynak türleri için self kısıtlamaları ve harita için Google frame izni.
- HSTS: `max-age=31536000; includeSubDomains; preload`.
- `X-Frame-Options: DENY`.
- `Referrer-Policy: strict-origin-when-cross-origin`.

Netlify yapılandırmasında ayrıca `X-Content-Type-Options` ve `Permissions-Policy` kuralları tanımlı. Bu iki başlık canlı yanıt üzerinden ayrıca değer kontrolüne alınmadı; aşağıdaki açık doğrulama maddesine bakın.

## 5. Formlar, veri ve KVKK

İletişim/kariyer gönderimleri varsayılan olarak kapalı. Build'in Netlify Forms tarafından form olarak algılanmasını sağlayacak canlı etkinleştirme yapılmadı. Alanlarda istemci tarafı tür/uzunluk/doğrulama ve kullanıcıya durum geri bildirimi var; form kapalı olduğundan backend tarafı gönderim, spam/honeypot ve dosya yükleme akışı canlı test edilmedi.

Kariyer başvurularının yetkili alıcısı, CV saklama/silme süresi, güvenli aktarım ve KVKK metinlerinin şirket tarafından doğrulanması gerekiyor. Bu bilgiler doğrulanmadan hukuki metin veya veri toplama akışı açılmamalı. Gerçek kullanıcı verisiyle test yapılmadı.

## 6. Performans

### Gerçek ölçümler

Chrome otomatik başlatma denemesi ortam politikası tarafından engellendi. Bu nedenle bu denetimde Lighthouse, LCP, CLS, FCP, TBT, etkileşim gecikmesi, istek sayısı, gerçek mobil viewport ölçümleri, ekran görüntüsü veya axe taraması çalıştırılamadı. INP/RUM verisi mevcut değil. Bu metrikler için sayısal sonuç iddia edilmiyor.

### Kod/build bulguları

- Build başarılı. Ana JS: `277.40 kB` (gzip `87.15 kB`); CSS: `61.35 kB` (gzip `11.56 kB`).
- Hero videosu MP4 dosyası yaklaşık `3.14 MB`; poster WebP yaklaşık `46 KB`.
- Yerel düzeltme `autoPlay` ve programatik otomatik oynatmayı kaldırdı, `preload="none"` ayarladı. Böylece ziyaretçi videoyu başlatmadıkça büyük medya kaynağının indirilmemesi hedefleniyor. Bu ağ tasarrufu dosya boyutuna dayalı beklentidir; Chrome ağ kaydıyla henüz ölçülmedi.
- Video kontrolleri, poster, inline oynatma ve viewport görünürlük davranışı korunuyor. Kullanıcı başlatma/indirme davranışını test eden CDP senaryosu güncellendi ancak bu oturumda Chrome olmadığı için çalıştırılamadı.
- DevTools/lab ölçümü olmadan LCP hedefinin karşılandığı söylenemez. Üçüncü taraf font servisi kullanımına rastlanmadı.

## 7. SEO

- Üretimde sitemap 200 ve 51 URL içeriyor; robots.txt 200 ve sitemap bağlantısı içeriyor.
- Yerel 54 sayfalık prerender testi canonical, hreflang, sayfa başlığı, H1, dil metadata'sı ve formun kapalı kalmasını doğruladı.
- Üç dil bulunuyor. Yerelleştirilmiş bulunamayan sayfalar build çıktısında ayrıca yer alıyor; sitemap içerik URL'leriyle sınırlı.
- Canlı sayfaların metadata ayrıntıları için doğrulama statik HTML incelemesine dayanır; arama motoru indeksleme/arama görünürlüğü ölçülmedi.

## 8. Mobil, tasarım ve UX

Mevcut tasarım ve fotoğraflar korunarak kod ve statik çıktılar incelendi. Chrome başlatılamadığı için responsive breakpoint'ler, gerçek cihaz taşması, mobil menü etkileşimi, dokunma hedefleri, görsel kırpma ve form etkileşimleri görsel olarak doğrulanmadı. Mevcut QA tarifindeki 54 sayfa × 11 ekran ölçüsü (594 kontrol) bu commit için çalıştırılmış sayılmaz; varsa önceki commit'e ait sonuçlar bu denetimin kanıtı değildir.

## 9. Erişilebilirlik

Kaynakta görsel alt metinleri, semantik başlık/alan etiketleri, mobil menü durum nitelikleri ve reduced-motion testleri mevcut. `npm test` içindeki reduced-motion kontrolleri başarılı. Ancak klavye ile tam gezinme, ekran okuyucu, renk kontrastı, odak görünürlüğü ve axe/WCAG AA taraması tarayıcı engeli nedeniyle yapılmadı.

Hero videosu için altyazı (`track`) veya metin dökümü doğrulanmadı. Erişilebilirlik uygunluğu tamamlandı olarak beyan edilemez; video içeriği için altyazı/transkript değerlendirmesi gerekir.

## 10. Medya ve içerik doğruluğu

Fotoğraf hakları, çalışan/ziyaretçi görüntü izinleri, araç plakaları ve üçüncü taraf marka/görsel izinleri bağımsız olarak doğrulanamadı. Önceki `reports/MEDIA_RIGHTS_REVIEW.md` maddeleri geçerli inceleme girdileridir. 1993, çalışan/çözüm sayıları ve diğer kurumsal iddialar şirket belgeleriyle doğrulanmadı; rapor bunları olgu olarak teyit etmez.

## 11. GitHub, Netlify ve yayın güvenliği

Başlangıçta GitHub main ve release dalı `838a208` idi. Önceki yayın kontrolünde Netlify production aynı kaynak commit'ine bağlı ve kilitliydi. Bu denetimde yalnızca production HTTP yanıtları okundu; deploy, unlock, domain/DNS değişikliği yapılmadı. Kod değişiklikleri PR ve aynı Netlify projesinin Deploy Preview kontrolü için release dalında hazırlanmalıdır. CI/Deploy Preview bu yeni değişiklikler için henüz çalıştırılmadı.

Eski PR #1 ve eski deploy bilgileri artık güncel süreç göstergesi değil. `AGENTS.md` içindeki yayın bilgisi bu nedenle güncellendi. `reports/PRODUCTION_DEPLOYMENT_REPORT.md` ve `reports/PHOTO_PUBLICATION_REPORT.md` tarihsel kayıt olarak ele alınmalı; bu denetimde geçmiş kayıtlar yeniden yazılmadı.

## 12. Uygulanan düzeltmeler

| Öncelik | Bulgu | Yapılan işlem | Durum |
|---|---|---|---|
| P1 | Ana sayfa hero videosu otomatik oynuyor ve `preload=auto` ile ziyaretçi istemeden 3.14 MB'a kadar indirme başlatabiliyor. | Otomatik oynatma kaldırıldı, `preload=none` ve kullanıcı kontrolü bırakıldı; poster/controls korundu. | Yerel release dalında; canlıya alınmadı. |
| P2 | Video davranış testi artık olmayan `/en/fleet-rental/` yolunu kontrol ediyordu. | Testi üç dilin ana sayfa hero videosuna taşıdım; preload/istek/oynatma beklentilerini güncelledim. | Chrome testi bekliyor. |
| P2 | Preview senkronizasyonu başarı mesajı tarihsel PR #1'i sabit gösteriyordu. | Mesajı genel Deploy Preview eşleştirme talimatına çevirdim. | Yerel release dalında. |
| P2 | `AGENTS.md` merge olmuş PR ve eski production deploy bilgisini geçerli süreç gibi gösteriyordu. | Güncel denetim baz çizgisi ve yayın kilidi durumu yazıldı. | Yerel release dalında. |
| P2 | Patch seviyesinde bağımlılık güncellemeleri vardı. | Üç güvenli güncelleme lockfile'a yazıldı. | Testler geçti; production'a alınmadı. |

## 13. Önceliklendirilmiş açıklar

| Öncelik | Açık konu | Kanıt/etki | Gerekli takip |
|---|---|---|---|
| P1 | Erişilebilirlik/video metin alternatifi ve gerçek cihaz QA eksik. | Klavye/ekran okuyucu/axe ve video caption testi yok. | Tarayıcı erişimiyle manuel ve otomatik QA; video için altyazı veya transkript kararı. |
| P1 | Kariyer verisi alıcısı, saklama ve KVKK belgeleri doğrulanmadı. | Formlar kapalı tutuluyor. | Şirket/hukuk onayı; veri akışı ve saklama politikasını doğrulama. |
| P2 | Chrome tabanlı görsel, etkileşim, performans ve 594 responsive kontrol yapılmadı. | Ortam policy Chrome başlatmasını engelledi. | Chrome/CDP erişimi olan ortamda gerçek tarayıcı testlerini çalıştırma. |
| P2 | Production `X-Content-Type-Options` ve `Permissions-Policy` değerleri doğrudan raporlanmadı. | Netlify config var; canlı header değeri bu rapor çalışmasında alınmadı. | Sonraki read-only header incelemesinde teyit. |
| P2 | Şirket istatistikleri ve fotoğraf kullanım izinleri dış kanıtla doğrulanmadı. | Şirket içi belge/hak kayıtlarına erişim yok. | İlgili şirket sahibi onayı. |
| P3 | React/React DOM 19.3.1 kullanılabilir, major paket güncellemeleri mevcut. | Mevcut aralıkta güncelleme veya major yükseltme denenmedi. | Ayrı uyumluluk değişikliği ve tam regresyon testi. |
| P3 | Saha performans metrikleri bulunmuyor. | RUM/CrUX verisi bu denetim kapsamına bağlı değil. | Yayın sonrası gizlilik uyumlu gerçek kullanıcı ölçümü değerlendirmesi. |

## 14. Çalıştırılan kontroller

- `npm run build` — başarılı; 54 sayfa prerender edildi.
- `npm test` — 29/29 başarılı.
- `npm run security:check` — `npm audit` 0 bulgu; güvenlik lint'i hatasız.
- `npm ci --ignore-scripts --dry-run` — başarılı.
- `npm ls --depth=0` — başarılı.
- `node --test scripts/release-static.test.mjs` — 4/4 başarılı.
- `node --check scripts/release-behavior.mjs` ve `scripts/sync-preview.mjs` — başarılı.
- Yerel üretilen ana sayfa video markup'ı: `preload="none"`, `controls`, `playsInline`; autoplay niteliği yok.
- Canlı site HTTP taraması: sitemap 51/51, 83 dahili kaynakta başarısız yanıt yok; robots/sitemap ve raporlanan güvenlik header'ları mevcut.

## 15. Çalıştırılamayan kontroller

- Lighthouse/Chrome DevTools, mobil breakpoint ekran görüntüleri, etkileşim E2E/CDP video isteği kontrolü ve tarayıcı konsol/ağ incelemesi: Chrome başlatma denemesi ortam politikası tarafından reddedildi.
- Axe, klavye, ekran okuyucu ve gerçek mobil cihaz kontrolleri: bu ortamda yapılmadı.
- Site içi form gönderimi: form bilerek kapalı ve gerçek veri kullanılmadı.
- Bu nedenle performans/a11y puanı veya WCAG uygunluk garantisi verilmemektedir.

## 16. Önce/sonra özeti

- Video: Önce production'da autoplay/preload otomatik; denetim dalında kullanıcı başlatmalı ve preload kapalı. Boyut kazancı beklentisi yaklaşık 3.14 MB olası ilk indirme yükünün ertelenmesidir; ölçülmüş Lighthouse sonucu değildir.
- Bağımlılıklar: Üç semver patch güncellemesi, lockfile'da; audit sonucu 0 bulgu olarak kaldı.
- Kalite: Önceki statik kalite kapıları tekrar çalıştırıldı; bu commit için unit/security/build/static testler başarılı.
- Yayın: Önce production kaynağı `838a208`; bu denetim sırasında aynı kaldı. Yeni düzeltmeler henüz production'da değildir.

## 17. Son karar

**Kod inceleme ve Preview aşamasına hazır; production yayın onayı verilmiş değildir.** Önce release dalının GitHub/Deploy Preview kontrolü yapılmalı; production için ayrıca kullanıcı onayı ve gerekli görsel/a11y, hukuki içerik ve medya hakkı incelemeleri tamamlanmalıdır.

---

Bu rapor bir teknik denetim kaydıdır; hukuki uygunluk, gerçek kullanıcı performansı, fotoğraf lisansı veya şirket iddialarının doğruluğu hakkında bağımsız garanti oluşturmaz.
