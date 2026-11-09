# Son sürümün aynı Netlify projesinde yayını

9 Kasım 2026 — Europe/Istanbul

**Son sürüm yayınlandı:** [karaoglugroupnet.netlify.app/tr/](https://karaoglugroupnet.netlify.app/tr/).

## Yetki ve kaynak

Kullanıcının **“yayınla son halini”** talimatı production onayıdır. Kesinti sonrasındaki **“son kalan yerden devam et entegresyon yarım kaldı”** talimatıyla aynı onaylı işlem sürdürüldü. Yeniden onay istenmedi. Entegrasyon önceden kurulmuştu; eksik kalan adım son release sürümünün canlıya alınmasıydı.

| Alan | Doğrulanan değer |
| --- | --- |
| GitHub | [umutgecer01/karaoglugroup](https://github.com/umutgecer01/karaoglugroup) |
| Release dalı | [release/karaoglu-final-2026-11-08](https://github.com/umutgecer01/karaoglugroup/tree/release/karaoglu-final-2026-11-08) |
| Yayınlanan uygulama kaynağı | `6ca07f9aefcf84cc1ae56ecbabc0f19fd1b6a5f5` |
| Netlify projesi | `karaoglugroupnet`, ID `b4753086-eb94-4a7e-b5f5-7270835fab3a` |
| Aktif deployment | `6af18e98278ff0906ad9ca6a` |
| Yayın zamanı | 9 Kasım 2026 **12:14:29 İstanbul** / `09:14:29.649 UTC` |
| Netlify durumu | Ready, `published_deploy.id` yeni deployment ile aynı, `locked=true` |
| Önceki deployment | `6af17892dbe0ae394ffc49ca`; silinmedi |
| Git deposu / production branch | `umutgecer01/karaoglugroup` / `main` |
| Git build / preview | Açık; otomatik canlı yayın yayın kilidiyle engelleniyor |

Bu rapor ve yayın kaydı için sonraki dokümantasyon commit'i uygulama kaynağını değiştirmez. Manuel deployment'a hayali Git commit metadata'sı yazılmadı; kaynak SHA yerel build/manifest ve yayın kaydıyla eşleştirildi.

## Güvenli yayın yöntemi

Node **22.23.4** ile temiz Git ağacındaki güncel release kaynağından ayrı production build alındı. `CONTEXT=production`, `VITE_SITE_URL=https://karaoglugroupnet.netlify.app/` ve `VITE_NETLIFY_FORMS_ENABLED=false` kullanıldı. 146 dosyalık paket SHA256 manifest'iyle sabitlendi. Preview noindex `_headers` dosyası yok; içerik sayfalarında `index, follow` var.

Resmî Netlify CLI ile paket önce mevcut yayını değiştirmeden yüklendi. Netlify Forms işlemesi HTML form açılış etiketlerinin tırnak/boolean gösterimini ve platforma özgü tanıma alanlarını değiştirdiği için ham HTML byte karşılaştırması ilk denemede durdu. İncelemede bunun platformun form işlemesi olduğu doğrulandı: form etiketlerinin aynı kalan nitelikleri normalize edilerek TR/EN/AR HTML'in geri kalanının birebir eşleşmesi ve CSS dosyasının SHA256 eşleşmesi kontrol edildi. Uygulama kaynak kodu veya kapalı form davranışı değiştirilmedi.

Ardından yalnızca bu doğrulanmış deployment için `POST /deploys/6af18e98278ff0906ad9ca6a/lock` uygulandı. Bu işlem yayımlanmamış deployment'ı yayınlar ve kilitler; mevcut kilidi açan bir aralık oluşturulmadı. [Resmî Netlify API açıklaması](https://open-api.netlify.com/#tag/deploy/operation/lockDeploy).

**API context alanı `deploy-preview` kaldı:** Paket başlangıçta draft yüklendiği için bu tarihsel alan production olarak sunulmuyor. Gerçek yayın kanıtı projenin `published_deploy` eşleşmesi, `published_at`, kilit ve canlı adresteki yeni HTML/CSS doğrulamasıdır. Canlı TR/EN/AR sayfalarında HTTP noindex başlığı yok, HTML `index, follow`; draft adresindeki platform noindex'i canlıya taşınmadı.

İlk CLI denemesi bağlantı/DNS sorunu sırasında “Project not found” ile durdu. Sonraki yetkili API okuması doğru projeye erişildiğini, eski yayının değişmediğini ve yeni yarım deployment olmadığını doğruladıktan sonra tekrar denendi. Yanlış projeye geçilmedi, yeni proje oluşturulmadı.

## Bu sürüm için testler

- Node 22: `npm test` **13/13**, `npm run security:check` (audit **0**, lint başarılı), `npm run build`, production statik test **4/4** başarılı. `lint:security`, security:check içinde çalıştı.
- `6ca07f9` uzak CI build, Security, Analyze JavaScript ve CodeQL başarılı; CodeQL yeni uyarı yok. Yeni `npm ci` bu turda tekrar yapılmadı; mevcut kilitli bağımlılık kurulumu kullanıldı.
- Yayın anında gerçek canlı TR/EN/AR ana sayfaları **200**, production HTML eşleşmesi ve indeksleme doğrulandı.
- Gerçek yeni canlı yayında HTTP paketi: **54/54** yerelleştirilmiş sayfa, **101/101** kaynak; kök/EN/AR altında üç bilinmeyen yol **HTTP 404**. Canonical/hreflang, tek H1, dil/yön, indexleme, sitemap/robots, kapalı form, security headers ve HTML/asset/görsel cache başarılı. Bir geçici ağ hatası sınırlı GET/HEAD tekrarıyla giderildi; sonuçta **0 hata**.
- Gerçek yeni canlı yayında Değerlerimiz/Values kartları: TR/EN/AR × 11 genişlik, **33/33 responsive kontrolü**. Minimum yükseklik, aynı satırda eşit kart yüksekliği, yatay taşma, lang/dir/canonical/indexleme ve kapalı form başarılı; runtime exception yok. İlk deneme dış bağlantı zaman aşımıyla durdu, sınırlı GET tekrarıyla geçti.
- Gerçek yeni canlı yayında **38/38 menü/form/galeri smoke kontrolü**: mobil/masaüstü menü ve Escape, iletişim/kariyer formunun kapalı kalması, galeri hareketi ve görsel sığması, eski hash geçişleri ve güvenli rota davranışları başarılı. GET/HEAD dışındaki tarayıcı istekleri engellendi.
- Dil/video QA'sının ilk çalışmasında **51 aynı sayfada dil geçişi**, gerçek kullanıcı tıklamasıyla video oynatma, poster, görünür alan dışına çıkınca durma ve telefon/dış bağlantı doğrulamaları geçti. Son ekran görüntüsü/rapor kaydı Windows yol kaçış hatasıyla (`ENOENT`) başarısız oldu. Yardımcı yol düzeltildikten sonraki tekrar yedi dil döngüsünden sonra ağ zaman aşımıyla durdu. Bu nedenle paketin tamamına exit 0 / eksiksiz JSON sonucu denmiyor; geçen işlevsel assert'ler ile QA aracının çıktı/ağ hataları ayrı kaydediliyor. Bu hatalar nedeniyle uygulama kodu değiştirilmedi veya yeniden yayın yapılmadı.

Bu turda 594 sayfa/genişlik kombinasyonu, fiziksel telefon, Safari/Firefox/Edge, ekran okuyucu ve yeni LCP/INP ölçümü tekrar yapılmadı. Önceki raporlardaki bu tür sonuçlar yeni sonuç diye sunulmuyor.

## Korunan entegrasyon

GitHub main `47ba0c370e8f291faff198f895c503547b95b65f` olarak kaldı; main push/merge veya force push yapılmadı. PR #1 draft kalır. Repo bağlantısı, build komutu `npm run build`, publish `dist`, domain/DNS ve secret değerleri değiştirilmedi. GitHub production workflow çalıştırılmadı.

Diğer `karaoglugroup` projesi (`80b58d06-0cbb-432c-8193-17d34ba776df`) korunuyor; ayarları ve production yayını değiştirilmedi. Ana önizleme [deploy-preview-1--karaoglugroupnet.netlify.app](https://deploy-preview-1--karaoglugroupnet.netlify.app/) adresindedir. Tamamlanan değişiklikler release dalına kaydedilip önizlemeye gönderilir; gelecek canlı yayınlar ayrıca onay gerektirir.

**Formlar kapalı:** Gerçek mesaj/CV gönderilmedi. Form alıcısı, teslimat ve KVKK işlemleri bu yayınla tamamlanmış sayılmaz; aktivasyon ayrı onay gerektirir. Token yalnızca resmî oturum/süreç belleğinde kullanıldı; sohbet, Git veya loglara yazılmadı.

Ham kanıtlar Git dışında `reports/latest-production/` dizinindedir: `artifact.json`, `publish.json` (ilk başarısız deneme), `publish-attempt2.json` (başarılı yayın), `netlify-state.json` ve QA dosyaları.

**Sonuç: YAYINDA.** Güncel uygulama doğru eski production adresinde yayınlandı, GitHub/Netlify önizleme entegrasyonu korundu ve yeni yayın kilitlendi. Bu onaylı yayın için bekleyen izin yoktur. Form aktivasyonu ve sonraki canlı sürümler ayrı onay gerektirir. Dil/video QA çıktı hatası tam otomatik rapor başarısı olarak sunulmadı; fiziksel cihaz/diğer tarayıcı ve saha performansı bu çalışma kapsamındaki tamamlanmış testler değildir.
