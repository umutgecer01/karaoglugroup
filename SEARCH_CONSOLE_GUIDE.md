# Google Search Console hazırlık ve doğrulama sırası

9 Kasım 2026. **Teknik hazırlık belgesi:** bu çalışmada yetkili Search Console oturumuna erişilmedi; property oluşturulmadı, sahiplik doğrulanmadı, sitemap gönderilmedi ve Google indeksleme sonucu alınmadı.

## Doğru hedef

URL-prefix property önerisi: **`https://karaoglugroupnet.netlify.app/`**. `/tr/` ile sınırlandırmak yerine bu kök kapsam TR/EN/AR yollarını birlikte kapsar. URL-prefix protokol ve yol kapsamına bağlıdır. Domain property DNS doğrulaması gerektirir; Netlify'nin `netlify.app` ana alanının sahibi olduğumuz varsayılmamalı. [Property kapsamı](https://support.google.com/webmasters/answer/10432366?hl=en), [property ekleme seçenekleri](https://support.google.com/webmasters/answer/34592?hl=en).

Kaynak depo `umutgecer01/karaoglugroup`, ana Netlify projesi `karaoglugroupnet` / `b4753086-eb94-4a7e-b5f5-7270835fab3a` olarak korunur. Geliştirme/preview adresleri ayrı içerik kaynağı olarak indekslemeye açılmaz.

## Yetkili kullanıcı ve ayrıca onay gerektiren adımlar

1. Şirketin yetkili Google hesabında Search Console açılır; mevcut property ve sahiplik listesi önce kontrol edilir. Yetkisiz kişiye hesap erişimi verilmez.
2. Property yoksa kök URL-prefix eklenir. HTML dosyası veya HTML `<meta name="google-site-verification">` yöntemlerinden hesapta sunulan uygun yöntem seçilir. Gerçek değer Google tarafından sağlanır; uydurma doğrulama kodu kullanılmaz.
3. Dosya/meta eklemek kaynak değişikliği ve yeni yayın gerektiriyorsa, gerçek değerle release/PR/preview hazırlığı yapılır ve **production için ayrıca onay alınır**. Doğrulama değeri genel ziyaretçilere açık sahiplik verisi olsa da Google hesabının şifresi/token'ı sohbete veya Git'e yazılmaz.
4. Onaylı yayından sonra kök adresin gerçek HTML/dosya yanıtında Google'ın beklediği içerik doğrulanır; sonra yetkili kullanıcı Verify işlemini yapar. Doğrulama materyali sonraki yayınlarda korunur. Google HTML-tag yöntemi, property kökünün ziyaretçiyi götürdüğü sayfada etiketi arayabilir. [Resmî sahiplik doğrulaması](https://support.google.com/webmasters/answer/9008080).
5. Sitemaps bölümünde **`https://karaoglugroupnet.netlify.app/sitemap.xml`** gönderilir. Gönderim ve varsa işleme hataları kaydedilir. Kaynak sitemap 51 içerik URL'sini, üç dili ve alternatifleri içerir; yerelleştirilmiş 404 sayfaları sitemap'e eklenmez. [Google sitemap hazırlama ve gönderme](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
6. URL Inspection ile `/tr/`, `/en/`, `/ar/` ve birer faaliyet sayfası incelenir; Google'ın seçtiği canonical ile kaynak canonical karşılaştırılır. Gerekiyorsa yetkili kullanıcı indeksleme isteği gönderir. Gönderim indeksleme garantisi değildir.
7. Pages raporunda excluded/noindex/duplicate/soft-404 grupları ve gerçek 404'ler değerlendirilir; geçerli bilinmeyen URL'leri anasayfaya 200 yönlendirerek hata gizlenmez. Preview noindex'leri production engeliyle karıştırılmaz.
8. Structured data için URL ve içerik uygunluğu ayrıca incelenir. Organization JSON-LD sözdizimi veya araçtan geçmesi ticari iddiaların doğruluğu, indeksleme ya da zengin sonuç garantisi değildir.

## Yayın öncesi/sonrası kontrol ayrımı

| Kontrol | Otomatik kaynak/HTTP ile mümkün | Google hesabı/insan işlemi |
| --- | --- | --- |
| Title, description, canonical, hreflang, lang/dir | Evet; yerel/preview/production ayrı kaydedilir | Google'ın seçtiği canonical ayrıca incelenir |
| robots/sitemap/HTTP 404/preview noindex | Evet; gerçek hedefte GET/HEAD ile | Tarama/indeksleme raporları hesap ister |
| Sahiplik | Kaynakta etiket/dosya varlığı görülebilir | Gerçek Verify sonucu hesapta doğrulanır |
| Sitemap teslimi | XML ve erişilebilirlik kontrol edilir | Gönderim/işlenme sonucu hesapta doğrulanır |
| Core Web Vitals | Yerel laboratuvar ölçülebilir | Alan raporunun veri/örneklem durumu ayrıca görülür |

Bu belge hazırlanmış olması Google tarafında bir işlem yapıldığı anlamına gelmez. DNS/domain değişikliği yapılmadı; gelecekte özel alan adı bağlanması ayrı onay ve tüm SEO/ownership hedeflerinin yeniden incelenmesini gerektirir.
