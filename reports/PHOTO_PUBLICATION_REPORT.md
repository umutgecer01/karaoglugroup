# Fotoğraf açıklamalarının kaldırılması ve onaylı canlı yayın

10 Kasım 2026. Kullanıcı, fotoğrafların altındaki açıklamaların kaldırılmasını ve son sürümün `https://karaoglugroupnet.netlify.app/tr/` adresinde canlıya alınmasını açıkça istedi.

Tarım ve İnşaat detay galerilerindeki görünür figcaption kaldırıldı. Ekran okuyucuların kullandığı TR/EN/AR alt metinleri, dokuz yeni fotoğraf, responsive AVIF/WebP/JPEG kaynakları ve diğer sektörler korundu. Formlar kapalı kalır; gerçek mesaj/CV gönderilmez.

Hedef yalnızca `karaoglugroupnet`, Project ID `b4753086-eb94-4a7e-b5f5-7270835fab3a`. Mevcut kilitli production deployment `6af18e98278ff0906ad9ca6a` yayın öncesi baseline'dır. Ayrı production-context build ve hash manifesti hazırlanır; aynı projeye draft olarak yüklenir. Aday doğrulanmadan yayın değiştirilmez. Onaylı geçişte yalnızca doğrulanan adayın lock işlemiyle atomik yayın ve yeniden kilitleme kullanılır; unlock, main merge, GitHub production workflow, DNS/secret/repo bağlantısı değişikliği yapılmaz.

Önceki fotoğraf entegrasyonunun 594 responsive kontrolü, TR/EN/AR görsel kontrolleri ve üçer tekrarlı performans sonuçları [ayrı rapordadır](PHOTO_INTEGRATION_REPORT.md); bu açıklama kaldırma değişikliğinin yeniden yapılmış performans ölçümleri olarak sunulmaz. Bu sürümün test ve gerçek yayın sonucu işlem tamamlanınca ayrıca kaydedilecektir.
