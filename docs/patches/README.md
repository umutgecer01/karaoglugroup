# İncelenen ZIP güncellemesi

Kaynak paket: `Karaoglu_Grup_Yayin_Oncesi_Kod_Paketi.zip`.
SHA-256: `3116ca569111f64f337ec1f4429d65e928ac76be2fd5ff9f2ae7c0ba133c35c9`.
Hedef taban: `296af1a413e1e9c1739f11311e88b4cbcb68d7cb`.

Buradaki Python dosyası incelenmiş, düzeltilmiş **tek kullanımlık taban
migrasyonunun arşividir**. PR'daki değişiklikler zaten uygulanmıştır; mevcut
dalda yeniden çalıştırılmamalıdır. Bağımlılık kurulumu, commit, push, DNS veya
yayın yapmaz. Tam nihai sonucu yeniden üretme aracı değildir: PR ayrıca
gönderim izolasyonu testleri, genişletilmiş SEO testleri ve CI kapsamı içerir.

İncelemede eşleşme sayıları güncel release kaynaklarıyla doğrulandı. Logo
boyutları eklendi; logo yolu kontrolü açık tür kontrolü, uzunluk sınırı ve
doğrulanan dizin parçalarıyla sıkılaştırıldı. İç içe tekrar kullanan regex,
güvenlik lint uyarısı üzerine parça kontrolleriyle değiştirildi. Çeviri dil
alanı mevcut `t.ui.locale` olarak korundu.

Script yalnız `feature/*` dalında, tam olarak yukarıdaki taban commit'inde ve
temiz çalışma ağacında yazabilir. Orijinal scriptin dosya adı önekiyle yerel
değişiklikleri atlama kontrolü tam eşleşmeye daraltıldı. `--check` yazmaz;
uygulama tüm beklenen kaynak eşleşmeleri doğrulandıktan sonra yapılır.

Düzeltilmiş arşivin `--check`, `--apply` ve `git diff --check` adımları,
aynı tabandan oluşturulan ayrı yerel worktree içinde başarıyla doğrulandı.
Bu geçici doğrulama dalı GitHub'a gönderilmez.
