# Aynı Netlify projesinde GitHub ve önizleme entegrasyonu

9 Kasım 2026 — Europe/Istanbul

Kullanıcı onayı: **“Evet, aynı projede birleştir; canlı içeriği değiştirme.”**

## Tamamlanan yapılandırma

- Ana proje: karaoglugroupnet, ID b4753086-eb94-4a7e-b5f5-7270835fab3a; canlı adres https://karaoglugroupnet.netlify.app/tr/.
- Önce yayındaki deployment 6af17892dbe0ae394ffc49ca kilitlendi. API önce/sonra aynı deployment kimliğini doğruladı; yeni canlı sürüm yayınlanmadı.
- Git bağlantısı eski umutgecer01/karaoglu-group-website deposundan umutgecer01/karaoglugroup deposuna taşındı; production branch main olarak kaldı.
- Git build açıldı. Komut npm run build, çıktı dist, base boş; statik site için yanlış functions_dir=dist değeri null yapıldı.
- Release dalı release/karaoglu-final-2026-11-08 ve draft PR #1 korunuyor. Yeni release push aynı projede Deploy Preview oluşturmalı; aşağıda gerçek sonuç kaydedilecek.
- Yerel resmi Netlify LocalState kaydı aynı eski proje ID'sine eşleştirildi; Git dışında tutulur.
- Diğer karaoglugroup projesi (80b58d06-0cbb-432c-8193-17d34ba776df) silinmedi veya değiştirilmedi; orada ikincil preview oluşmaya devam edebilir.

## Yayın koruması ve sınırlamalar

Canlı yayın kilidi, Git build ve preview çalışırken mevcut yayını korur. GitHub production workflow yalnızca manuel; çalıştırılmadı. Secret/DNS/domain/main merge değişikliği yapılmadı. Formlar VITE_NETLIFY_FORMS_ENABLED=false kalır; gerçek mesaj/CV gönderilmedi.

Bağlantı değişiminde Netlify mevcut eski main (47ba0c3) için production-context build başlattı; build hatalı sonlandı (6af18aa7950131c54f174627, exit 2). Bu bir başarılı yayın değildir; kilitli mevcut canlı deployment değişmedi. Main bu çalışma kapsamında güncellenmez. Release preview sonucu ayrı doğrulanır.

Kaynak kod bu aşamada değiştirilmedi; önceki 13 regresyon/4 statik ve 33 responsive kontrolü yeni test diye gösterilmez. Yeni entegrasyonun gerçek preview ve kontrol sonuçları tamamlanınca bu rapora eklenir.

İleriye dönük tamamlanan değişiklikler sync:preview komutuyla test/commit/push edilir. Bu her tuşa basışta commit eden bir izleyici değildir. Güncel PR ve Netlify build geçmişi değişikliklerin kaydını tutar. Canlı yayın ve yayın kilidini kaldırma için ayrıca açık kullanıcı onayı gerekir.

## Aynı projede gerçek önizleme sonucu

Entegrasyon kaydı **766d992613de064061d074d7ea04e74362a282be** normal release push ile GitHub'a gönderildi. Netlify Git entegrasyonu PR #1 için **6af18b43b3d0e127ed6365c4** deployment'ını eski/doğru projede otomatik oluşturdu. GitHub commit status hem ana hem korunan ikincil preview için success döndü.

- [Aynı projede önizleme](https://deploy-preview-1--karaoglugroupnet.netlify.app/).
- [GitHub release dalı](https://github.com/umutgecer01/karaoglugroup/tree/release/karaoglu-final-2026-11-08).
- [Draft PR #1 ve kontroller](https://github.com/umutgecer01/karaoglugroup/pull/1).
- [Mevcut canlı site](https://karaoglugroupnet.netlify.app/tr/).

766d992 commit'inin uzak CI build, Security, Analyze JavaScript ve CodeQL kontrolleri başarılı; CodeQL yeni uyarı yok diyor. Ana projede 8 header ve 1 redirect kuralı işlendi; Pages changed neutral (başarısızlık değil).

Yeni ana proje preview'unda yeniden çalıştırılan kontroller:

- TR/EN/AR ana sayfa, üç gerçek HTTP 404, sitemap ve robots: **8/8 HTTP kontrolü**. Canonical/hreflang production adresini koruyor. Noindex HTTP başlığı, CSP, frame DENY ve HTML cache yeniden doğrulaması başarılı.
- Değerlerimiz/Values kartları, üç dil × 11 genişlik (320–1920 px): **33/33 responsive kontrolü**; taşma yok, minimum 80 px ve aynı satırda eşit yükseklik, doğru dil/yön ve preview noindex başarılı.
- İletişim formu gönderim düğmesi kapalı, runtime exception yok. Tarayıcı katmanı GET/HEAD dışındaki istekleri engelledi; gerçek gönderim yapılmadı.
- İlk HTTP testinde robots için gereksiz Disallow beklentisi düzeltildi: gerçek dosya Allow ve production sitemap içeriyor, preview indeksleme koruması HTTP noindex ile sağlanıyor. İlk tarayıcı denemesinde CSS tamamlanmadan ölçüm yapıldı; hesaplanan stil yüklenmesi beklendikten sonra 33 kontrol geçti. Bu test yardımcıları Git dışındadır; uygulama kodu değiştirilmedi.

Bu dar entegrasyon çalışmasında 594 kontrol, video oynatma, yeni LCP/INP, gerçek telefon veya farklı tarayıcı testleri tekrar yapılmadı. Tarihsel sonuçlar yeni test diye sunulmadı. Ham kanıtlar reports/single-project altında Git dışında tutulur.

**Sonuç:** GitHub kayıt ve otomatik önizleme artık production ile aynı Netlify projesindedir. Yeni değişiklikler preview'a gider; canlı içerik, ayrı yayın onayı verilene kadar kilitli mevcut deployment olarak kalır. Bu raporun sonuç eki yalnızca dokümantasyon commit'idir; test edilen uygulama kaynağını değiştirmez.
