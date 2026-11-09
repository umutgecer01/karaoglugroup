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
