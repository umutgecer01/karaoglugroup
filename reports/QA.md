# QA tekrar yönergeleri

Tüm komutları package.json bulunan iç proje dizininde çalıştırın. Windows PowerShell için `npm.cmd` kullanılabilir. `npm test`, lint ve build Chrome gerektirmez. Build internet bağlantısı veya harici veri gönderimi gerektirmez; bağımlılıklar kurulu olmalıdır.

## Tarayıcı oturumu

Yerel Chrome'u **ayrı, geçici profil** ve `--headless=new --remote-debugging-port=9222 --no-first-run --disable-background-networking` seçenekleriyle başlatın. Kendi profilinizi kullanmayın. Windows'ta `Start-Process` için `-WindowStyle Hidden` kullanın. Kullanılmış geçici profil: `%TEMP%/karaoglu-audit-chrome`. Portu dış ağa açmayın.

```text
node scripts/serve-audit.mjs dist 4175
node scripts/audit-pages.mjs
```

Bu yerel QA sunucusu statik dosya/404 davranışını ve mevcut CSP'yi uygular. Netlify CDN'nin bütün davranışlarını taklit etmez. Sonuç: `page-audit.json`. 54 sayfa × 11 genişlik; H1, lang, hreflang, taşma, görünür kırık görsel, dahili statik kaynak ve konsol kontrolü. Bu bir tam WCAG sertifikasyonu değildir.

## Form ve etkileşim testleri

Ayrı bir süreçte yalnızca yerel test sunucusunu açın:

```powershell
$env:VITE_NETLIFY_FORMS_ENABLED='true'
npm.cmd run dev -- --host 127.0.0.1 --port 4180
```

Diğer terminalde `node scripts/audit-interactions.mjs` çalıştırın. 4175 üzerindeki production çıktısında formlar kapalı kalır. Test aracı 4180'deki bütün POST isteklerine tarayıcı içinde taklit 500/200 yanıtları verir; gerçek alıcıya göndermez. Google haritası ağ istekleri ayrıca engellenir. Sonuç: `interaction-audit.json`. Test sonrası bu geçici dev sürecini kapatın; Forms etkin test ortamını production yapılandırması sanmayın.

## Performans

`measure-performance.mjs`, `.audit/baseline-dist` eski çıktısını 4176, güncel çıktıyı 4175 üzerinden karşılaştırır. İki kökü de `serve-audit.mjs` ile sunun. `.audit` yerel yedektir, Git'e/yayına dahil edilmez. Önce/sonra tek koşu; 150 ms gecikme, 1.6 Mbps indirme, 4× CPU yavaşlatma, DPR 1, 8 saniye gözlem. Gizlilik tercihi önceden kayıtlıdır. Bu değerler Lighthouse puanı veya saha INP ölçümü değildir. Ham kaynaklar ve bundle boyutları `performance.json` içindedir.

## Medya

`optimize-media.mjs`, 4173'teki yerel önizleme ve Chrome CDP ile yalnızca yeniden boyutlandırma/WebP sıkıştırma yapar; görsel içeriğini üretmez veya değiştirmez. JPEG asılları korunur. Tekrar çalıştırmak `public/images` içindeki WebP'leri ve `generatedMedia.json` dosyasını günceller; ardından build ve medya testini tekrar çalıştırın. Normal build bu araca ihtiyaç duymaz.

İş bitiminde yalnızca bu denetim için başlatılan sunucuları ve geçici Chrome profilinin süreçlerini kapatın.
