# GitHub bağlantı ve release aşaması

> Bu dosya push onayından önceki bağlantı kontrolü kaydıdır. Sonraki açık onayla yapılan push, draft PR, gerçek preview testleri ve açık CodeQL bulguları için [güncel sonuç raporuna](GITHUB_RELEASE_PREVIEW_REPORT.md) bakın.

8 Kasım 2026 — Europe/Istanbul

**Durum: Yerel Git kimlik doğrulaması ve release push dry-run başarılı. Gerçek push için kullanıcı onayı bekleniyor.**

## Doğrulanan durum

- Checkout: `C:\Users\seyha\Downloads\karaoglu-group-website-main\release\karaoglugroup-final-2026-11-08`
- Yerel dal: `release/karaoglu-final-2026-11-08`.
- HEAD ve korunacak commit: `740ac322007895becd31108feac441bc95108110`; Git nesnesi mevcut, çalışma ağacı temiz.
- Fetch/push remote: `https://github.com/umutgecer01/karaoglugroup.git`.
- Son uzak kontrol: `main = 47ba0c370e8f291faff198f895c503547b95b65f`; uzak release dalı mevcut değil.
- GitHub entegrasyonu `umutgecer01` hesabıyla okuma yapabiliyor. Hesabın depo metadata'sında push/admin izinleri var. Bu, entegrasyonun kendi yazma iznini kanıtlamaz.

## Kimlik doğrulama ve 403

Önceki entegrasyon yazma isteği `403 Resource not accessible by integration` vermişti. GitHub'ın [REST hata belgesine](https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api) göre bu hata kullanılan entegrasyon kimliğinin işlem için yeterli izni olmadığını gösterir. Contents yazma işlemindeki eski hata, kullanıcı hesabının admin olmamasından kaynaklanmıyor. Kesin eksik permission listesi bu bağlantı araçlarıyla alınamadı; bu turda entegrasyon üzerinden tekrar yazma denenmedi.

Yerel Git'in ilk etkileşimsiz dry-run denemesi kayıtlı oturum olmadığı için başarısızdı. Mevcut taşınabilir Git içindeki **Git Credential Manager 2.9.1** ile şu güvenli tarayıcı girişi çalıştırıldı:

```powershell
& 'C:\Users\seyha\Downloads\karaoglu-group-website-main\karaoglu-group-website-main\.audit\tooling\mingit\cmd\git.exe' credential-manager github login --username umutgecer01 --browser
```

Komut exit 0 döndü; Credential Manager hesap listesinde `umutgecer01` doğrulandı. Şifre/token istenmedi, okunmadı veya rapora yazılmadı. GitHub CLI kurulmasına gerek kalmadı.

Ardından yalnızca aşağıdaki **dry-run** çalıştırıldı:

```text
git push --dry-run origin refs/heads/release/karaoglu-final-2026-11-08:refs/heads/release/karaoglu-final-2026-11-08
```

Exit 0 ve `[new branch]` sonucu alındı. Bu sonuç kimlik doğrulamasının ve receive-pack erişiminin çalıştığını gösterir; gerçek push sırasında sunucu kuralları/workflow yetkisi gibi kontroller yine reddedebilir. Dry-run commit yüklemedi veya dal oluşturmadı; sonraki `ls-remote` kontrolünde release dalı hâlâ yoktu.

## Onaya hazırlanmış işlem

Onay gelirse uzak main ve release ref'leri tekrar kontrol edilerek **yalnızca** mevcut `740ac322007895becd31108feac441bc95108110` commit'i `release/karaoglu-final-2026-11-08` dalına normal push ile gönderilecek. Main'e push, force push, rebase, merge veya production deployment yapılmayacak. Sonraki adım main hedefli draft PR ve mevcut Netlify bağlantısının üreteceği Deploy Preview kontrolü olacak.

Kullanıcı önceki aşamada Netlify production dalının main olduğunu ve release push'unun production yayını tetiklemediğini doğrulamıştı. Yerel production workflow da yalnızca main için çalışıyor. Netlify paneline doğrudan erişim bu aşamada yok; panel politikaları yeniden doğrulanmış sayılmadı.

## Form ve preview güvenliği

`netlify.toml` ve `.env.example` içinde `VITE_NETLIFY_FORMS_ENABLED=false` doğrulandı. Gerçek mesaj veya CV gönderilmedi. Preview build için noindex koruması mevcut commit'te; kod değiştirilmedi.

| Çıktı/kontrol | Bu aşamadaki durum |
| --- | --- |
| GitHub branch URL | Henüz yok; dal gönderilmedi |
| Draft PR URL | Henüz yok; oluşturulmadı |
| Netlify Deploy Preview URL | Henüz yok; oluşturulmadı/doğrulanmadı |
| TR/EN/AR, mobil/masaüstü, görsel/video | Gerçek preview üzerinde test edilmedi |
| SEO, 404, dil geçişi, menü | Gerçek preview üzerinde test edilmedi |
| Cache ve güvenlik başlıkları | Gerçek Netlify HTTP yanıtlarında test edilmedi |
| Build/lint/responsive/etkileşim | Önceki commit hazırlığında başarılı; bu turda tekrar çalıştırılmadı, kod değişmedi |

Önceki yerel test kanıtları [GITHUB_SYNC_REPORT.md](GITHUB_SYNC_REPORT.md) içindedir; bunlar gerçek Netlify preview sonucu değildir.

## Kalanlar

1. Kullanıcının yalnızca release dalına push için açık onayı.
2. Gerçek push sonucu, draft PR, GitHub Actions ve Netlify preview oluşumu.
3. Gerçek preview üzerinde istenen kontrollerin çalıştırılması; URL tahmin edilerek başarılı sayılmaması.
4. Kurumsal/hukuki teyitler ve form alıcı/teslimat süreci. Formlar kapalı kalacak; gerçek gönderim ayrıca onay gerektirir.

**YAYINDAN ÖNCE EKSİKLER VAR.** Yerel Git erişim engeli güvenli Credential Manager oturumuyla aşılmıştır; GitHub entegrasyonunun eski 403 sorunu çözülmüş sayılmamıştır. Gerçek push ve preview henüz yapılmadı.
