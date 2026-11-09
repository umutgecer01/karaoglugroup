# KARAOĞLU GROUP — Eski production projesinde onaylı draft sonucu

> Güncel sonuç: [PRODUCTION_DEPLOYMENT_REPORT.md](PRODUCTION_DEPLOYMENT_REPORT.md). Kullanıcının son açık onayıyla eski projenin otomatik Git build'leri durduruldu ve `c45a5c0` production paketi mevcut canlı adreste yayımlandı. Aşağıdaki metin production onayından önceki draft kaydıdır.

9 Kasım 2026 — Europe/Istanbul

**Eski projede draft oluşturuldu ve testleri başarılı. Canlı site değiştirilmedi. Production paketi hazır; son canlı yayın onayı ve otomatik build kontrolü bekleniyor.**

## 1. Eski Netlify projesine erişildi mi?

**Evet.** Resmî Netlify CLI **27.16.2**, Node **22.23.4** ve tarayıcı OAuth oturumu kullanıldı. Yetkili site API sorgusu 200 döndü. Şifre/token kaynak koda, sohbete, Git'e veya loglara yazılmadı. CLI çıktısı süreç içinde tutuldu; yalnızca site/deploy kimlikleri ve güvenli sonuç alanları kaydedildi.

## 2. Project ID ve site URL eşleşiyor mu?

**Evet.** Eski proje `karaoglugroupnet`, Project ID **`b4753086-eb94-4a7e-b5f5-7270835fab3a`**, production URL **`https://karaoglugroupnet.netlify.app/`**.

Geliştirme projesi `karaoglugroup`, Project ID **`80b58d06-0cbb-432c-8193-17d34ba776df`**. Bunlar iki farklı projedir. Yeni proje production hedefi olarak seçilmedi.

## 3. Hangi Git deposu ve branch bağlı?

| Ayar | Eski production projesi | Geliştirme projesi |
| --- | --- | --- |
| GitHub repo | **`umutgecer01/karaoglu-group-website`** | `umutgecer01/karaoglugroup` |
| Production branch | `main` | `main` |
| Build | `npm run build` | `npm run build` |
| Publish | `dist` | `dist` |
| Base | Repo kökü | Repo kökü |
| `stop_builds` | **false** | false |

Eski proje hâlâ farklı/eski depoya bağlı. Bu bağlantı, branch ve build/publish ayarları değiştirilmedi. [Yetkili API kanıtı](production-transition/netlify-readonly.json).

## 4. Çift otomatik deployment riski var mı?

**Potansiyel risk devam ediyor; bu işlemde çift/production yayın yapılmadı.** Eski projenin Git build'leri durdurulmamış. Eski repoya gelecek bir değişiklik gelecekte manuel yeni sürümün üzerine yazabilir.

Güncel release'teki `.github/workflows/netlify-deploy.yml`, main push veya main'de manuel tetikleme sonrası iki secret varsa production'a deploy edecek yapıdadır. Eski site yeni repoya bağlanır ve bu workflow da etkinleştirilirse aynı commit iki yayın kanalından gönderilebilir. Yeni preview projesinin main build'leri de ayrı bir yayın tetikleyebilir.

Bu turda main'e push/merge, workflow_dispatch, repo bağlantısı değişikliği veya build durdurma yapılmadı. Uzak main **`47ba0c370e8f291faff198f895c503547b95b65f`** olarak korundu.

## 5. GitHub secret ayarlarında ne gerekiyor?

GitHub API ile 9 Kasım'da yeniden incelendi: depo Actions secrets listesi **200 ve boş**; `production` environment ve environment secrets sorguları **404**. Mevcut main üzerinde production workflow dosyası yok; workflow release dalında.

Actions seçilirse hedef `NETLIFY_SITE_ID` kesinlikle **`b4753086-eb94-4a7e-b5f5-7270835fab3a`** olmalı. Token, eski projeye erişen yetkili Netlify hesabından alınmalı; environment'a özel secret ve deployment reviewer/branch korumalarıyla kullanılmalı. Secret değerleri API'den okunamaz; körlemesine değişim yapılmadı.

**Önerilen bu tek seferlik CLI geçişinde GitHub secret değişikliği gerekmiyor.** Mevcut yetkili CLI hesabıyla eski site erişimi doğrulandı. Ayrı bir otomasyon kurulacaksa, environment/reviewer/main kısıtları ve manuel workflow taslağı ayrıca onaya sunulmalı.

[GitHub metadata kanıtı](production-transition/github-readonly.json). Hiçbir secret veya environment ayarı değiştirilmedi.

## 6. Eski projede draft deployment oluşturuldu mu?

**Evet, kullanıcının “Evet, yalnızca eski projede draft oluştur” açık onayıyla.**

| Alan | Doğrulanan sonuç |
| --- | --- |
| [Draft URL](https://6af1764d1626633e8d21ce1a--karaoglugroupnet.netlify.app/) | Eski site altında benzersiz draft |
| [Netlify deployment kaydı](https://app.netlify.com/projects/karaoglugroupnet/deploys/6af1764d1626633e8d21ce1a) | `6af1764d1626633e8d21ce1a` |
| Hedef site ID | `b4753086-eb94-4a7e-b5f5-7270835fab3a` |
| Kaynak release commit'i | `c45a5c06146da44b3d129c2156b2f1c425de2f80` |
| State / context | **ready / deploy-preview** |
| `published_at` | **null** |
| CLI sonucu | Exit **0** |
| Canlı deployment önce / sonra | **`6a462f368c237a00082c4a7b` / aynı** |

`--prod`, `--prod-if-unlocked`, `--remote`, `--trigger` veya proje oluşturma kullanılmadı. Son kullanılan işlem hazır paketi `--site <eski-ID> --dir <paket>/dist --cwd <paket> --no-build --json` ile gönderdi. Paket önce preview context'inde üretildi; noindex HTML/HTTP koruması var.

İlk salt okunur kontrol ağ zaman aşımı verdi; sonraki GET ile kimlik doğrulandı. CLI ilk denemelerde `--context` ve `--no-build` bayraklarının birlikte kullanılamadığını belirtti; draft kaydı oluşmadığı API'den kontrol edildi. Gereksiz `--context` yükleme bayrağı kaldırıldı; hazır preview paketi korunarak gönderim başarılı oldu. Başarısız denemeler tamamlandı olarak sayılmadı.

[Deployment doğrulaması](production-transition/old-site-draft.json), [147 dosyalık draft manifest'i](production-transition/draft-artifact.json).

## 7. Draft testleri başarılı mı?

**Evet; aşağıdaki kapsam eski projenin gerçek draft URL'sinde test edildi.** GET/HEAD dışındaki tarayıcı istekleri QA katmanında engellendi. Gerçek mesaj/CV gönderilmedi.

| Kontrol | Gerçek draft sonucu |
| --- | --- |
| TR/EN/AR HTML ve SEO | **54/54** sayfa 200; dil/yön, tek H1, canonical/hreflang ve noindex başarılı |
| Mobil / masaüstü | **594/594**, 54 sayfa × 11 genişlik, 320–1920 px; yatay taşma yok |
| Dahili bağlantı/görseller | **101 kaynak** başarılı; görünür kırık görsel yok |
| Aynı sayfada dil değişimi | **51/51**; başlık, içerik, URL, lang/dir ve canonical eşleşmesi |
| Menü/form/galeri | **38/38**; mobil/masaüstü menüler, Escape, iletişim bağlantısı, kapalı formlar, hareketli yatay galeri, cover görseller, legacy hash yolları |
| Video | Gerçek kullanıcı tıklamasıyla oynatma, poster, native kontrol ve görünür alan dışında duraklama başarılı |
| 404 | Kök, EN ve AR altında üç bilinmeyen URL **HTTP 404** |
| Canonical/hreflang | Eski production adresi ve doğru dil yolları korunuyor |
| Sitemap / robots | Başarılı; production adresini kullanıyor, draft noindex başlığı mevcut |
| Formlar | Submit düğmeleri kapalı; build flag **false**, gerçek gönderim **0** |
| Güvenlik başlıkları | Gerçek HTTP'de CSP, HSTS, nosniff, DENY, referrer/permissions ve COOP doğrulandı |
| Cache | HTML yeniden doğrulama, hash'li assets bir yıl immutable, görseller 30 gün kuralları doğrulandı |
| Console/runtime | Son responsive/smoke kontrollerinde hata yok |

Kanıtlar: [HTTP/SEO/header/cache](production-transition/draft-tests/http.json), [responsive](production-transition/draft-tests/page-audit.json), [51 dil geçişi/video](production-transition/draft-tests/behavior.json), [38 smoke kontrolü](production-transition/draft-tests/smoke.json).

TR mobil, EN masaüstü ve AR mobil screenshot'ları açılarak incelendi. Bu benzersiz draft URL'sinde Netlify Drawer gri alanı görünmüyor; CSP gevşetilmedi ve Netlify panelinde Drawer ayarı değiştirilmedi. Gerçek telefon donanımı, Safari/Firefox/Edge, ekran okuyucu ve yeni LCP/INP ölçümü bu turda yapılmadı.

9 Kasım Node **22.23.4** testleri de yeniden başarılı: `npm ci`, `npm run build`, **10/10** `npm test`, `npm run lint:security`, `npm run security:check` ve **0 npm audit açığı**. Production ve preview statik testleri **4/4** geçti. GitHub'da `c45a5c0` CodeQL kontrolü başarılı ve yeni bulgu yok. Kaynak commit'i değiştirilmedi.

## 8. Production öncesi kalan eksikler neler?

1. **Son canlı yayın onayı yok.** Mevcut onay yalnızca draft içindi.
2. Eski Git otomatik build'leri hâlâ aktif yapılandırmada; yeni manuel yayının üzerine yazma riski canlı geçişten önce ayrı onayla giderilmeli.
3. Kurumsal başarı rakamları, şirket bilgileri/görsel hakları ve hukuki metin teyitleri kullanıcı/şirket sorumlularınca tamamlanmalı; teknik testler bunları onaylamaz.
4. Form alıcıları/teslimat ve KVKK/CV saklama-erişim süreçleri onaylı değil. **Formlar kapalı kalacak**; gerçek mesaj/CV gönderilmedi. Bu alanlar form aktivasyonu için ayrıca açık onay gerektirir.
5. Hedef gerçek cihaz/tarayıcı kontrolleri ve yeni saha performansı ölçülmedi.

Eski Project ID/erişim ve gerçek eski-site draft testleri artık açık engel değildir; doğrulandılar.

## 9. Güvenli production yayın yöntemi hangisi?

Önerilen **iki somut işlem**, yalnızca kullanıcının ayrı son onayından sonra:

1. **Yalnızca eski `karaoglugroupnet` projesinde otomatik Git build'lerini durdurmak** (`stop_builds=true`). Bu eski projenin gelecekteki Git production/PR build'lerini durdurur; mevcut yayını silmez. Yeni geliştirme projesine dokunulmaz. Böylece eski repo daha sonra manuel yeni sürümün üzerine otomatik yayın yapamaz.
2. **Aynı `c45a5c0` commit'inin ayrı production-context paketini eski Project ID'ye tek seferlik kontrollü CLI yayınıyla göndermek.** Main merge/push, repo bağlantısı, GitHub secrets veya DNS değişikliği gerektirmez. GitHub Actions production kanalı bu geçişte etkinleştirilmeyecek.

Netlify, Git build'leri durdurulmuşken yerelde üretilmiş paketin manuel CLI/API gönderimini destekler: [resmî belge](https://docs.netlify.com/build/configure-builds/stop-or-activate-builds/).

Production için ayrı paket zaten hazır: **146 dosya**, `.audit/production-release-c45a5c0-2026-11-09`; [SHA256 manifest'i](production-transition/production-artifact.json). Production build ve dört statik test başarılı; form flag'i false, canonical eski production adresi, preview-only `_headers`/noindex koruması yok. **Noindex draft paketini production'a yükseltme önerilmiyor.**

Onay sonrası kimlik, artifact hash'leri ve mevcut canlı deployment yeniden kontrol edilmeli; yalnızca bu production paketi kullanılmalı. Gönderimden sonra gerçek production HTTP/SEO/404/header/form-kapalı durumu doğrulanmalı. Mevcut canlı `6a462f368c237a00082c4a7b` kaydı referans olarak tutulur; şu anda değiştirilmedi.

**Karar: Teknik draft başarılı; YAYINDAN ÖNCE EKSİKLER VAR.** Otomatik yayın kanalının güvenceye alınması, kurumsal/hukuki teyitler ve son açık canlı yayın onayı bekleniyor. Bu rapor production'a yayın yapıldığı anlamına gelmez.
