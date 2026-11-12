# Kontrollü production yayın rehberi

## 12 Kasım 2026 operasyon notu

Bu görevde kullanıcı koşullu merge/yayın ve eksik güvenli yapılandırmaları tamamlama yetkisi verdi. Tekrarlanan sohbet onayı gerekmez; gerçek bağımsız inceleme ve environment onayı gereklidir. İlk API okumasında main/release koruması ve production environment yoktu; bağımsız reviewer platformun başlangıç ayarlarından kaynaklanmıyordu. Mevcut yayın ön kontrolü ve kullanıcı talimatı bağımsız onayı şart koşar. Main ve release artık yöneticiler dahil bir onay, son push için farklı onaylayan kişi, güncel testler ve çözümlenmiş konuşmalar gerektirir; force push/silme yasaktır. Reviewer veya secret uydurulmaz.

Production workflow üç form bayrağını açıkça `false` tutar. Ön kontrol tam main SHA'sı için Browser QA dahil kontrolleri arar; browser workflow main push'larında da çalışır. Netlify'da release dalı branch deploy listesine eklendi; PR #11'in release tabanlı preview üretmesine hazırlık sağlandı. Production branch, repo, domain, secret ve build komutu değiştirilmedi; mevcut deployment kilitlidir.

Bu not aşağıdaki tarihsel hazırlık açıklamalarının üzerine geçer. Environment/reviewer/secret adımları tamamlanmış değildir; bağımsız şirket yetkilisi olmadan yayın başlatılmaz.

## Güncel durum ve tek kanal

Kalıcı kaynak [umutgecer01/karaoglugroup](https://github.com/umutgecer01/karaoglugroup), production projesi **karaoglugroupnet**, Project ID **b4753086-eb94-4a7e-b5f5-7270835fab3a**, adres **https://karaoglugroupnet.netlify.app/**.

Production ile ana PR önizlemeleri aynı Netlify projesindedir. Git build açık tutulur; mevcut yayın kilidi otomatik canlı değişikliği engeller. Eski `umutgecer01/karaoglu-group-website` deposu silinmez ve üretim kaynağı olarak kullanılmaz. İkincil `karaoglugroup` Netlify projesi korunur; production hedefi değildir.

Bu çalışma `.github/workflows/netlify-deploy.yml` ve `scripts/production-*` ile **manuel GitHub Actions kanalını hazırladı**. Hazırlanmış kod bu aşamada release dalındadır; main'e merge edilmedi, production environment/secret eklenmedi ve workflow gerçek hesapta çalıştırılmadı. Aktif canlı yayın önceki ayrı onaylı manuel CLI işlemiyle yayımlanmıştır. Geçiş tamamlanana kadar Actions production kanalı devredeymiş gibi kullanılmaz. Geçişten sonra olağan yayın kanalı yalnızca bu workflow olmalı; CLI acil operasyonları ayrı onaylı bakım olarak yürütülmelidir.

## Panel ve merge ön koşulları

1. Release PR'ını ve aynı projedeki Netlify Deploy Preview'u inceleyin. Kullanıcıdan main merge için ayrıca açık onay alın. `main` onaylanmış kaynak, `feature/*` günlük geliştirme, `release/*` yayın adayıdır.
2. GitHub **Settings → Rules → Rulesets** veya **Branches** altında main'e PR zorunluluğu, onaylı inceleme ve geçerli CI/Security/CodeQL/Netlify kontrollerini ayarlayın. Force push ve branch silmeyi engelleyin. Kural değişikliğini yetkili sahip onaylamalıdır; bu görevde yapılmadı.
3. **Settings → Environments → production** oluşturun. Required reviewers olarak yetkili kişi/takımı şirket belirlesin; **Prevent self-review** açın. Yetki varsa koruma bypass'ını kapatın ve deployment branch'ini yalnızca main ile sınırlayın. Ön kontrol, reviewer bulunmayan veya self-review açık environment'ta yayını durdurur. Tek hesap kendi başlattığı yayını onaylayamayacağı için bağımsız yetkili reviewer gerekir.
4. Şirket onayından sonra `NETLIFY_AUTH_TOKEN` değerini **production environment secret** olarak yetkili panel üzerinden ekleyin. Token eski/doğru projeye erişebilen hesabın olmalı; sohbet, kod, shell komut argümanı veya loglarda paylaşılmamalıdır. Bu değişiklik için ayrıca açık onay gerekir. `NETLIFY_SITE_ID` workflow içinde sabit public kimliktir; başka projenin secret'ıyla değiştirilemez.
5. Workflow erişimi için GitHub read token'ının checks/statuses/actions/deployments/security-events ve environment okuma uçlarına erişimi gerekir. `github.token` önceliklidir. API 403/404 veya eksik yapılandırma bypass edilmez; durdurulur ve gerekli izin şirket sahibiyle çözülür. Gerçek tokenın hedef projeye erişimi ancak yayın adımındaki salt okunur Netlify GET ile doğrulanır.

[GitHub environment/reviewer belgeleri](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) plan ve hesap koşullarını açıklar. Bu projenin panel ayarları yerel kod testlerinin geçtiği gerekçesiyle tamamlanmış sayılmaz.

## Onaylı bir sürümü yayınlama

1. Merge sonrası main'in tam 40 karakter küçük harf SHA'sını belirleyin. Main CI, Security ve CodeQL analizinin bu **tam SHA** için başarılı olmasını bekleyin; açık high/critical Code Scanning bulgusu olmamalı.
2. Başarılı aynı-proje PR preview'unun kaynak SHA'sını kaydedin. Merge/squash farklı commit kimliği üretse bile main ve incelenen preview commit'inin Git tree kimlikleri eşit olmalıdır. Main üzerinde sonradan yapılan tek dosya değişikliği bile yeni preview incelemesi gerektirir.
3. Canlı içeriği değiştirecek bu **belirli sürüm** için kullanıcıdan ayrıca açık yayın onayı alın.
4. GitHub **Actions → Publish approved Karaoglu production release → Run workflow**, branch **main**. `expected_sha`: tam main SHA; `reviewed_preview_sha`: incelenen tam PR head SHA; `confirmation`: `PUBLISH_KARAOGLUGROUPNET`.
5. Bağımsız reviewer production environment işini onaylar. Yanlış branch/SHA/tree/proje, eksik secret, eksik approval veya başarısız kontrol yayını durdurur. `npm ci`, security/audit/lint, regresyon, build ve statik form/SEO kontrolleri başarısızsa yayın yapılmaz.
6. Script production-context paketi ayrı dizine kopyalar, SHA256 manifest'i çıkarır, resmi **netlify-cli@27.16.2** ile yalnızca draft yükler. Önceki canlı deployment kilitli kalır. TR/EN/AR HTML ve JS/CSS hash'leri doğrulanır; Netlify Forms'un açılış etiketi normalleştirmesi dışında HTML değişikliği kabul edilmez. Remote main/security/environment ve yayın baseline'ı tekrar kontrol edilir.
7. Yalnızca doğrulanan yeni deployment için `POST /deploys/{id}/lock` yayını değiştirir ve kilitler. `unlock` veya `--prod` ile kilitsiz bir pencere açılmaz. Git preview build'leri durdurulmaz. [Netlify API lock işlemi](https://open-api.netlify.com/#tag/deploy/operation/lockDeploy).
8. Canlı sayfa indexleme/HTML/asset doğrulaması ve API published ID + lock doğrulaması başarılı olmalı. API context alanı başlangıçtaki draft türünü koruyabilir; gerçek yayın published ID, published_at ve canlı HTTP ile belirlenir.

## Hata ve geri dönüş

Yazma zaman aşımı/CLI belirsizliği sonrası otomatik yeniden publication veya rollback yapılmaz. Önce Netlify'dan mevcut published ID ve candidate durumunu okuyun. Job kanıtı `.audit/production-publish/<SHA>/publication.json` ve manifest'tedir; token içermez. İşin sonunda bu iki JSON türü GitHub Actions artifact olarak 30 gün korunur; ön kontrol aşaması daha önce durmuşsa henüz kanıt dosyası oluşmamış olabilir. Canlı kontrol hatası varsa yayınlanmış sürüm otomatik başka sürümle değiştirilmez; kullanıcıya bildirin ve [ROLLBACK_GUIDE.md](ROLLBACK_GUIDE.md) üzerinden ayrı rollback onayı alın.

Netlify/GitHub secret, bağlantı, branch veya domain değişiklikleri yayın onayından çıkarılamaz. Formlar **false** kalır; bu akış e-posta alıcı/KVKK onayını veya gerçek teslimat testini yapmaz.

## Doğrulama sınırı

Üretim korumaları yerel anlamlı testlerle kontrol edildi; bu workflow gerçek production hesabında çalıştırılmadı. Eksik environment/reviewer/secret veya main merge bu rehberle teknik olarak hazırlanmıştır, tamamlanmış sayılmaz. Gerçek production çalışması ayrıca onay gerektirir.
