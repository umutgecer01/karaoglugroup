# KARAOĞLU GROUP — Eski Netlify production projesine güvenli geçiş

> Güncel sonuç: [OLD_PRODUCTION_DRAFT_RESULT.md](OLD_PRODUCTION_DRAFT_RESULT.md). Kullanıcı onayıyla eski projede draft oluşturuldu; 594 responsive, 51 dil geçişi ve 38 smoke kontrolü başarılı. Canlı deployment değişmedi. Aşağıdaki metin draft onayından önceki hazırlık kaydıdır.

9 Kasım 2026 — Europe/Istanbul

**Durum: Eski proje ve yetkili erişim doğrulandı. Yeni build/testler başarılı. Eski projede draft oluşturulması için kullanıcı onayı bekleniyor. Canlı site değiştirilmedi.**

## 1. Eski Netlify projesine erişildi mi?

**Evet.** Yerel CLI/oturum başlangıçta bulunmadı. Resmî npm `netlify-cli@27.16.2`, proje bağımlılıklarından ayrı `.audit/tooling/netlify-cli` içine kuruldu; Node 22.23.4 kullanıldı. CLI'ın tarayıcı OAuth girişi çalıştırıldı ve giriş teyit edildi. Yetkili `/user` ve eski site API sorguları **200** döndü. Önceki 401 erişim engeli bu oturumla aşıldı.

Şifre veya access token sohbete, kaynak koda, komut satırı argümanlarına ya da loglara yazılmadı. Oturum resmî CLI'ın yerel kullanıcı deposunda tutuluyor. API incelemesi GET istekleriyle sınırlıydı; login dışında site/hesap yapılandırması değiştirilmedi.

Kanıt: [netlify-readonly.json](production-transition/netlify-readonly.json). Raporda token, ham ortam değişkenleri veya build hook URL'leri yoktur.

## 2. Project ID ve site URL eşleşiyor mu?

**Evet; iki farklı Netlify projesi.**

| Özellik | Eski production | Geliştirme / preview |
| --- | --- | --- |
| Gerçek proje adı | `karaoglugroupnet` | `karaoglugroup` |
| Project ID | `b4753086-eb94-4a7e-b5f5-7270835fab3a` | `80b58d06-0cbb-432c-8193-17d34ba776df` |
| Production/base URL | `https://karaoglugroupnet.netlify.app` | `https://karaoglugroup.netlify.app` |
| Bu çalışmadaki rol | Korunacak gerçek production hedefi | Mevcut geliştirme/PR preview projesi |

Eski yayının mevcut production deployment'ı **`6a462f368c237a00082c4a7b`**, state **ready**, context **production**, commit **`58149a64bbfa44324683c6606144b31f43d67e8a`**. API yayın zamanı İstanbul saatine çevrildiğinde **2 Temmuz 2026 12:28:39**. Yeni release henüz bu production deployment'ına taşınmadı.

## 3. Hangi Git deposu ve branch bağlı?

| Özellik | Eski production projesi | Preview projesi |
| --- | --- | --- |
| Git provider | GitHub | GitHub |
| Bağlı repo | **`umutgecer01/karaoglu-group-website`** | **`umutgecer01/karaoglugroup`** |
| Production branch | `main` | `main` |
| Build command | `npm run build` | `npm run build` |
| Publish | `dist` | `dist` |
| Base | Boş / repo kökü | Boş / repo kökü |
| `stop_builds` | `false` | `false` |
| `skip_automatic_builds` | `null` | `null` |

**Eski projenin bağlı reposu güncel release deposundan farklıdır.** Bağlantı değiştirilmedi veya otomatik olarak yeniden eşleştirilmedi. Eski deploy/build geçmişinde Git production ve Dependabot PR build kayıtları mevcut; bazı eski PR build'leri başarısız, mevcut published production ready durumunda. Bu eski build hataları yeni release'in test sonucu değildir.

## 4. Çift otomatik deployment riski var mı?

**Potansiyel risk var; bu turda çift yayın yapılmadı.** Eski proje Git bağlantılı ve build'leri durdurulmamış. Güncel release'teki `.github/workflows/netlify-deploy.yml`, main push veya main'de workflow_dispatch sonrası `NETLIFY_SITE_ID` ve `NETLIFY_AUTH_TOKEN` mevcutsa `deploy --prod` çalıştıracak yapıdadır.

Mevcut durumda iki kaynak farklı repolara bağlıdır. Eski proje yeni repoya bağlanır ve GitHub production secret'ları da etkinleştirilirse aynı main değişikliği iki production deploy'u tetikleyebilir. Repo bağlantısı değiştirilmese bile eski repoya ileride gelecek push, manuel yayımlanmış yeni sürümün üzerine eski akışı tekrar yayımlayabilir.

Yeni preview projesi de main'e bağlıdır; main merge onun base adresinde de otomatik yayın tetikleyebilir. Bu nedenle main merge yapılmadı ve yeni proje production hedefi olarak seçilmedi.

GitHub API ek kontrolü: güncel uzak main hâlâ **`47ba0c370e8f291faff198f895c503547b95b65f`**, bu main üzerinde production workflow dosyası **404**; workflow şu anda release/PR'dadır. Risk, workflow main'e alındığında ve gerekli yetkiler verildiğinde devreye girecek yapı içindir.

## 5. GitHub secret ayarlarında ne gerekiyor?

Salt okunur GitHub API sorguları:

- Repo Actions secrets listesi: **200, boş liste**. Bu depoda `NETLIFY_SITE_ID`/`NETLIFY_AUTH_TOKEN` repo secret'ları mevcut değil.
- `production` environment ve environment secrets: **404**; environment henüz oluşturulmamış/erişilebilir değil. Koruma kuralları varmış gibi gösterilmedi.
- Secret değerleri okunmadı; GitHub bunları zaten geri vermez. Organization secret veya farklı kapsamın değeri hakkında çıkarım yapılmadı.

Actions deployment seçilecekse doğru `NETLIFY_SITE_ID` değeri **`b4753086-eb94-4a7e-b5f5-7270835fab3a`** olmalı. Preview ID production secret'ına yazılmamalı. `NETLIFY_AUTH_TOKEN`, eski site GET erişimi doğrulanan yetkili Netlify hesabından alınmalı. Mevcut CLI oturumu eski projeye erişiyor; bu, henüz bulunmayan bir GitHub token secret'ının doğrulandığı anlamına gelmez.

Önerilen korumalar: `production` environment, yalnızca izinli `main` deployment branch'i, yetkili required reviewer ve uygun ekip varsa self-review engeli; admin bypass politikası da değerlendirilmelidir. Environment-scoped token/ID, kurallar geçmeden job'a verilmemeli. Workflow'u yalnızca manuel tetiklemeye ve kesin eski site kimliği denetimine dönüştürme seçeneği, ayrı gözden geçirilecek değişikliktir. [GitHub environment belgesi](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

**Secret/environment/workflow ayarı değiştirilmedi.** Secret ekleme/değiştirme gerekirse önce ayrı açık onay alınacak. Mevcut tek seferlik CLI draft/production yaklaşımı GitHub token secret'ı gerektirmez.

Kanıt: [github-readonly.json](production-transition/github-readonly.json).

## 6. Eski projede draft deployment oluşturuldu mu?

**Henüz hayır; açık onay bekleniyor.**

`c45a5c06146da44b3d129c2156b2f1c425de2f80` kaynağından yeni build alındı. Draft için ayrı preview-context çıktı hazırlandı: **147 dosya**, SHA256 dosya manifest'i, eski siteye yönelen canonical/sitemap, kapalı formlar ve `noindex` HTML/HTTP koruması. Bu paket production yayını için doğrudan kullanılmamalı; production için ayrı production-context çıktı gerekir.

Paket: `.audit/production-draft-c45a5c0-2026-11-09`. Kimlik/manifest: [draft-artifact.json](production-transition/draft-artifact.json).

Hazırlanan CLI işlemi:

```text
netlify deploy --site b4753086-eb94-4a7e-b5f5-7270835fab3a --dir <hazırlanmış-paket>/dist --cwd <hazırlanmış-paket> --context deploy-preview --no-build --json
```

Komutta `--prod`, `--prod-if-unlocked`, `--trigger`, `--remote`, `--site-name` veya proje oluşturma yok. Hazırlanan çalıştırıcı, gönderim öncesi site ID/URL, mevcut production deploy ID ve dosya SHA256'larını denetler; sonrasında eski published deployment ID'sinin değişmediğini doğrular. CLI auth çıktısı ham olarak loglanmaz.

**Henüz deploy komutu çalıştırılmadı.** Kullanıcıdan yalnızca eski projede draft yazma işlemi için açık onay istenecek; bu onay production izni değildir.

## 7. Draft testleri başarılı mı?

**Eski projenin gerçek draft URL'si henüz yok; gerçek draft testleri TEST EDİLMEDİ.** Önceki yeni-proje preview sonuçları eski site draft sonucu olarak sunulmadı.

9 Kasım'da Node **22.23.4** ile yeniden çalıştırılan kontroller:

| Kontrol | Bu turdaki sonuç |
| --- | --- |
| `npm ci` | Başarılı; 209 paket, audit 0 |
| `npm run build` | Production ve draft-preview context build'leri başarılı |
| `npm test` | **10/10** |
| `npm run lint:security` | Başarılı |
| `npm run security:check` | Başarılı, npm audit **0 açık** |
| Statik release/SEO/form testleri | Production **4/4**, preview **4/4** |
| Yeni commit CodeQL | GitHub API yeniden kontrol edildi; **başarılı, yeni bulgu yok** |
| Eski sitede gerçek draft responsive/dil/video/404/header | **Test edilmedi; draft onayı bekleniyor** |

Onaydan sonra TR/EN/AR, 594 responsive kontrol, dil/menü, görsel/video, gerçek 404, canonical/hreflang/sitemap/robots, kapalı formlar ve gerçek cache/security headers draft URL'sinde doğrulanacak. Gerçek mesaj/CV gönderilmeyecek.

## 8. Production öncesi kalan eksikler

1. Eski projede yalnızca draft oluşturulması için kullanıcı onayı, ardından gerçek draft kontrolleri.
2. Tek production yayın kanalının seçilmesi ve eski Git akışının yeni manuel yayının üzerine yazmasını engelleyen ayarın ayrı onayla yapılması.
3. GitHub Actions seçilirse workflow/environment/secret hazırlığı ve ayrı onay; şu anda uygulanmadı.
4. Önceki kurumsal içerik/görsel hakları, hukuki metinler ve hedef cihaz/tarayıcı teyitleri.
5. Form alıcısı/teslimat, CV saklama/erişim ve KVKK onayı. **`VITE_NETLIFY_FORMS_ENABLED=false` korunuyor; gerçek form gönderimi yok.**
6. Draft'tan ayrı production-context paket ve son açık canlı yayın onayı.

## 9. Güvenli production yayın yöntemi hangisi?

Bu geçiş için öneri: **tek seferlik kontrollü CLI yayını**, mevcut eski Project ID'ye açıkça bağlı; GitHub secret'larına dokunmadan ve repo bağlantısını değiştirmeden. Önce yalnızca draft yayınlanıp test edilecek.

Canlı yayın aşamasında ayrıca onay alınarak eski projenin otomatik Git build'leri durdurulmalı; bunun preview build'lerini de durdurduğu bilinmeli. Netlify, build'ler durdurulmuşken yerelde üretilmiş çıktının CLI/API ile manuel gönderimini destekler. [Resmî stop builds belgesi](https://docs.netlify.com/build/configure-builds/stop-or-activate-builds/).

Sonrasında noindex draft paketi yerine aynı güvenli commit'in production-context çıktısı test edilip eski siteye tek yetkili yayın yapılabilir. Bu işlem şu an yapılmayacak. Main merge, yeni projeyi production'a çevirme, domain/DNS veya eski site silme gerekmez. İleride otomasyon kurulursa Git integration veya GitHub Actions'tan yalnızca biri production sahibi olmalı; mevcut otomatik main-push workflow'u ve eski Git build'leri beraber etkinleştirilmemeli.

**Şu an karar: YAYINDAN ÖNCE EKSİKLER VAR.** Proje kimliği ve erişim engeli çözüldü; draft onayı/testleri ve yayın kanalı kontrolü bekleniyor. Canlı yayın için son açık onay ancak draft sonucu ve uygulanacak kesin production işlemi gözden geçirildikten sonra ayrıca istenecek.
