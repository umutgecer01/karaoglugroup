# GitHub / Netlify kayıt ve eşitleme düzeni

9 Kasım 2026 — Europe/Istanbul

Kullanıcı seçimi: **tamamlanan değişiklik GitHub'a kaydedilir, preview oluşur; canlı yayın ayrıca onaylanır.** Bu dosya kalıcı çalışma düzenini ve yapılandırma değişikliklerini kayıt altına alır. Her commit'in gerçek CI/CodeQL/Netlify sonucunun kaydı GitHub PR ve Netlify deployment geçmişindedir.

## Tek çalışma klasörü

IDE'de açık `karaoglu-group-website-main` iç klasöründe Git geçmişi bulunmuyordu; güvenli sürüm ayrı `release/karaoglugroup-final-2026-11-08` checkout'undaydı. Açık klasörün `src/`, script, workflow, kök yapılandırma ve rapor dosyaları önce yerel `.audit/working-copy-backup-2026-11-09` içine yedeklendi.

Bu klasöre mevcut üç commit'lik Git geçmişi getirildi; yeni bağımsız başlangıç geçmişi oluşturulmadı. `origin = https://github.com/umutgecer01/karaoglugroup.git`, dal `release/karaoglu-final-2026-11-08`, başlangıç HEAD `c45a5c0` olarak eşleştirildi. Reset yalnızca index/history içindi; kullanıcı dosyaları checkout ile zorla ezilmedi. Önceki commit'te takipli olup bu klasörde eksik olan tarihsel kök dosyalar geri alındı; silme commit'i oluşturulmadı.

Kullanıcının `src/components/Corporate.jsx` içindeki kart hizalama/border değişikliği korundu. Önceki preview metadata, üç dil, CodeQL sabit-dil/CDP/entity düzeltmeleri ve kilitli güvenli bağımlılıklar birleştirildi. Uygulama kaynağı `src/` ve `public/`'dır; tarihsel kök bileşenler aktif build değildir.

## Kayıt ve preview

```text
npm run sync:preview -- "Yapılan değişikliği açıklayın"
```

PowerShell script politikası engellerse `npm.cmd` kullanılabilir. Script mevcut taşınabilir Node 22/Git araçlarını bulabilir; başka bilgisayarda Node 22 ve Git gereklidir.

Bu komut:

1. Release dalı ve doğru GitHub remote'unu doğrular; main/detached/yanlış remote gönderimini durdurur.
2. Security/audit, regresyon, production build ve statik release testlerini çalıştırır.
3. Değişiklikleri stage eder; credentials/yerel araç/build çıktısı/ham QA raporu ve bilinen secret kalıpları için kontrol eder. Token değeri loglanmaz.
4. Başarılıysa anlamlı mesajla commit oluşturur ve yalnızca mevcut release dalına normal push yapar. Force push veya merge yoktur.
5. PR #1 güncellenir; bağlı Netlify geliştirme projesi kendi Git entegrasyonuyla yeni Deploy Preview oluşturur. Komut push sonucunu doğrular; preview'un hazır/başarılı olduğu ayrıca PR/Netlify status'ünden doğrulanır.

Bu, her tuş vuruşunu arka planda commit eden bir dosya izleyici değildir. **Tamamlanan düzenlemede çağrılan kayıt adımıdır.** Codex'in her tamamlanan kaynak değişikliğinde bunu uygulaması `AGENTS.md` içinde kayıtlıdır. Secret/yanlış branch/dosya korumaları için üç yeni regresyon testi eklendi; toplam test paketi 13 test içerir.

Markdown denetim/yayın raporları da Git'e dahil edildi. Dependency/build çıktısı, `.env`, Netlify yerel oturumu, `.audit` araçları, ham JSON/PNG/SARIF/log kanıtları Git'e gönderilmez; bunların içinde yerel/kişisel veya büyük geçici veri olabilir. Bunlar yok sayıldığı için kaynak geçmişi eksik sayılmaz.

## Netlify eşleşmesi

| Rol | Proje | Git / yayın akışı |
| --- | --- | --- |
| Preview | `karaoglugroup`, ID `80b58d06-0cbb-432c-8193-17d34ba776df` | `umutgecer01/karaoglugroup`, mevcut PR #1; release push → preview |
| Production | `karaoglugroupnet`, ID `b4753086-eb94-4a7e-b5f5-7270835fab3a` | Eski Git build'leri kapalı; yeni yayın yalnızca açık kullanıcı onayıyla |

Production URL `https://karaoglugroupnet.netlify.app/` olarak kalır. Son onaylı canlı kaynak `c45a5c0`, deployment `6af17892dbe0ae394ffc49ca` idi; bu senkronizasyon yeni UI/kayıt değişikliklerini **preview'a** taşır. Yeni değişiklikler production'a otomatik gönderilmiş sayılmaz.

`.github/workflows/netlify-deploy.yml` içinden main-push tetiklemesi kaldırıldı; yalnızca manuel workflow_dispatch ve main guard'ı kaldı. GitHub Actions production credentials/environment henüz kurulmadı. Hiçbir secret/environment/Netlify repo bağlantısı/DNS değişikliği yapılmadı. Mevcut manuel yayın yolu ayrı onay sonrası resmî CLI ile doğru eski Project ID'yi kullanır.

## Yetki ve takip

Kullanıcı bu çalışma düzeninde tamamlanan değişikliklerin release dalına kaydını/push'unu ve preview oluşturulmasını yetkilendirdi. Canlı yayın, main merge, secrets veya site bağlantısı değişikliği için bu yetki yeterli değildir; ayrıca açık onay gerekir.

- GitHub kaynak/değişiklik kaydı: [repo](https://github.com/umutgecer01/karaoglugroup/tree/release/karaoglu-final-2026-11-08).
- Kontroller ve inceleme: [PR #1](https://github.com/umutgecer01/karaoglugroup/pull/1).
- Preview: [deploy-preview-1](https://deploy-preview-1--karaoglugroup.netlify.app/).
- Canlı yayın geçmişi: [PRODUCTION_DEPLOYMENT_REPORT.md](PRODUCTION_DEPLOYMENT_REPORT.md).

Formlar `VITE_NETLIFY_FORMS_ENABLED=false` kalır. Bu kayıt düzeni gerçek mesaj/CV gönderimi veya form aktivasyonu yapmaz.
