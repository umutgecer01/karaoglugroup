# Karaoğlu Grup — 12 Kasım 2026 geliştirme raporu

Taban: `release/karaoglu-final-2026-11-08`,
`296af1a413e1e9c1739f11311e88b4cbcb68d7cb`.
Geliştirme dalı: `feature/prelaunch-forms-domain-references-20261112`.
PR hedefi release dalıdır. `main` bu çalışma öncesi ve yerel doğrulama sonunda
`838a208275d9fcd5c8b4083458c05ef9239c51bb` olarak korundu.

## Uygulama ve paket incelemesi

ZIP'in kaynak eşleşmeleri güncel GitHub release commit'iyle uyumlu bulundu.
Paket belgeleri teknik girdi olarak değerlendirildi; kendi içlerindeki eski
yetki veya ortam beyanları bu çalışmaya yetki sayılmadı. Kullanıcının feature
dalı ve yayın yasağı talimatları esas alındı. Tarihî `release/` klasörü yerine
güncel Git çalışma kopyasının `src/` kaynakları kullanıldı.

- İletişim ve hızlı teklif aynı iletişim kapısını; kariyer ayrı kapıyı kullanır.
  Ana kapı zorunludur. Gönderim fonksiyonu form adını kontrol eder; kapalı veya
  tanınmayan form adları `fetch` öncesinde reddedilir. Üç kalıcı bayrak `false`.
- Referanslar için boş veri modeli ve üç dilde görünüm hazırlandı. Doğruluk ve
  yayın izni birlikte gerekir. Dış URL, uygunsuz dosya türü ve geçersiz dizin
  parçaları reddedilir; görsel boyutları sabittir. Firma/proje adı eklenmedi.
- Kurumsal e-posta alanları `null`; iletişim ve footer bağlantıları koşulludur.
  Çalışan posta kutusu veya form alıcısı varsayılmadı.
- SEO testleri tek `SITE_URL` girdisine uyarlandı ve OG/Twitter görselleri,
  Organization URL/logo ve Googlebot denetimleriyle genişletildi. Canlı domain
  varsayılanı değişmedi. Gelecek domain için CI'da yalnız yerel build kontrolü var.
- CI, Security, CodeQL ve Browser QA kapsamı release PR'ını kapsar. Production
  workflow'u, yayın politikası ve site kimliği değiştirilmedi veya çalıştırılmadı.

Düzeltilmiş tek kullanımlık script [patch arşivinde](patches/README.md).
Logo doğrulamasının ilk sıkılaştırması güvenlik lint uyarısı üretti; iç içe
tekrar yerine ayrı dizin parçası kontrolleri kullanılarak giderildi.
Scriptin yazma korumasına kesin taban SHA kontrolü ve dar dosya adı eşleşmesi
eklendi. Son arşivin `--check`, `--apply` ve diff kontrolü ayrı yerel worktree'de
doğrulandı. Bu doğrulama dalı GitHub'a gönderilmez.

## Yerel doğrulama

Windows, Node `22.23.4`, gerçek headless Chromium/CDP. Bağımlılıklar
`npm ci` ile kilit dosyasından kuruldu. Ham JSON, ekran görüntüleri, araçlar,
bağımlılıklar ve build çıktısı Git'e alınmaz.

| Kontrol | Sonuç |
| --- | --- |
| `npm ci` | Başarılı; 319 paket denetlendi, 0 açık |
| `npm test` | 34/34 geçti |
| `npm run security:check` | 0 npm açığı; ESLint 0 uyarı/hata |
| Mevcut domain production build | 54 yerelleştirilmiş sayfa üretildi |
| `release-static.test.mjs` | 5/5; 54 sayfa metadata, 51 sitemap kaydı, kapalı formlar/e-posta |
| Gelecek domain production build | `https://karaoglugroupglobal.com/`; 5/5 statik test geçti |
| Yerel preview build | Mevcut domain; 5/5 statik test, `noindex` ve güvenlik/cache başlıkları geçti |
| Medya QA | 9 galeri fotoğrafı, responsive kaynaklar, filo görseli ve video kontrolleri geçti |
| Mobil form QA | 3 dil × 3 form görünümü × 9 genişlik = 81; 3 CV hata görünümü; 0 sorun |
| Sayfa QA | 54 sayfa × 11 genişlik = 594; 189 iç kaynak; 0 konsol hatası |
| Etkileşim QA | 108 kontrol; yalnız bellek içi sahte gönderim yanıtları |
| Dil/video davranışı | 51 aynı-sayfa dil değişimi; oynat/durdur ve bağlantı güvenliği geçti |
| Klavye QA | 6 TR/EN/AR mobil/masaüstü senaryosu geçti |
| axe-core | 63/63 tarama, 0 otomatik ihlal |
| Soğuk önbellek performansı | 3 mobil + 3 masaüstü; LCP medyanı 2892/2936 ms; CLS 0/0 |
| Lighthouse 13.6.0 | 3 mobil + 3 masaüstü; performans medyanı 82/99; SEO, erişilebilirlik ve best practices tüm ölçümlerde 100 |
| `git diff --check` | Geçti |

Performans ölçümleri yerel, sıkıştırmasız HTTP üzerinde laboratuvar verisidir;
saha Core Web Vitals/INP doğrulaması değildir. Mobil tarama gerçek fiziksel
telefon veya donanım klavyesi testi değildir. Otomatik axe taraması tam manuel
WCAG uygunluk sertifikası değildir.

Lighthouse LCP medyanı mobil **4838 ms**, masaüstü **890 ms**; CLS **0/0,0064**,
TBT **0/0 ms**. Mobil LCP iyileştirme alanıdır. Sıkıştırılmış hosting üzerindeki
saha performansı bu yerel sonuçlardan çıkarılamaz.

QA'da gerçek mesaj, gerçek CV veya gerçek e-posta gönderilmedi. Yalnız localhost
mock sürecinde geçici açık bayraklar kullanıldı; tarayıcı istemcisi dış ağ ve
yazma isteklerini engeller. Üretim kaynakları ve derlemeler kapalı kaldı.

## İnceleme ve şirket onayı

GitHub'daki son CI/CodeQL/Browser QA durumları PR kontrollerinden takip edilir;
yerel sonuçlar uzak kontrollerin yerine geçmez. Bu rapor hazırlanırken uzak
kontroller henüz başlatılmamıştı; son durum PR açıklamasında ayrıca raporlanır.

Şirketten beklenenler: domain sahipliği/hostname ve geçiş-yönlendirme kararı;
Workspace hesabı, doğrulanan posta kutusu ve DNS e-posta kayıtları; ayrı iletişim
ve kariyer alıcıları; CV özel erişim, saklama/silme ve KVKK metinleri; gerçek
referanslar ve medya yayın izinleri; kurumsal iddiaların kayıtlarla teyidi.
Bkz. [domain ve Workspace notları](DOMAIN_WORKSPACE_READINESS.md) ve
[devir listesi](PRELAUNCH_HANDOFF_2026-11-12.md).

Canlı Netlify yayını/kilidi, `main`, DNS, domain yönlendirmeleri ve gerçek form
aktivasyonu bu çalışmada değiştirilmedi. Birleştirme veya yayın yapılmadı.
