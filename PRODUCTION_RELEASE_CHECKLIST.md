# Production release kontrol listesi

Her yeni canlı sürüm için ayrıca doldurun. Eski başarılı test sonucu yeni commit'e aktarılmaz.

## Kimlik ve yetki

- [ ] Kaynak `umutgecer01/karaoglugroup`; main için kontrollü merge onayı var.
- [ ] Tam main SHA ve incelenen PR preview SHA kayıtlı; Git tree'leri eşit.
- [ ] Hedef `karaoglugroupnet` / `b4753086-eb94-4a7e-b5f5-7270835fab3a` / `https://karaoglugroupnet.netlify.app/` API ile eşleşiyor.
- [ ] Mevcut yayın ready+locked; önceki deployment ID ve rollback planı kaydedildi.
- [ ] Yeni canlı içerik için kullanıcıdan açık onay var; DNS, secret, bağlantı, gerçek form gönderimi için verilmiş sayılmıyor.
- [ ] production environment required reviewer ve Prevent self-review etkin; gerekli bağımsız reviewer belirli.
- [ ] Netlify token environment secret olarak onayla kurulmuş; doğru projeye erişim salt okunur API ile doğrulanıyor, değer hiçbir log/koda girmiyor.

## Kaynak ve test

- [ ] Main'in **tam SHA'sı** için CI Build site, Security checks ve Analyze JavaScript başarılı.
- [ ] Aynı SHA için CodeQL analiz kaydı hata içermiyor, kurallar çalışmış; varsa findings check başarılı.
- [ ] Main üzerinde açık high/critical Code Scanning bulgusu yok.
- [ ] Aynı projede incelenen tam PR head SHA için başarılı Netlify Deploy Preview var.
- [ ] Node 22 `npm ci`, `npm test`, production guard testleri, `security:check`, build ve release-static testleri başarılı.
- [ ] Üç dil, gerekli responsive/etkileşim/SEO/404/görsel/video kontrolleri ilgili değişiklik için yapıldı; yapılmayanlar N/A olarak işaretlendi.
- [ ] Production build `CONTEXT=production`, eski site URL'si, `VITE_NETLIFY_FORMS_ENABLED=false`; preview `_headers` yok, içerik indexable.
- [ ] Değişen kurumsal/hukuki içerik için yetkili teyit var; kaynak/hak iddiası uydurulmadı.

## Manuel yayın

- [ ] Workflow yalnızca main üzerinde workflow_dispatch; doğru iki SHA ve `PUBLISH_KARAOGLUGROUPNET` ifadesi girildi.
- [ ] production environment review tamamlandı; eş zamanlı yayın yok (`cancel-in-progress=false`).
- [ ] Resmî Netlify CLI 27.16.2 kuruluyor; credential yalnızca yayın adımının environment'ında.
- [ ] Sabitlenen artifact hash manifest'i ve candidate doğrulaması başarılı; Netlify site baseline'ı değişmemiş.
- [ ] Yeni deployment doğrudan lock API ile yayınlanıyor; mevcut kilit açılmıyor, Git preview build'leri durdurulmuyor.

## Yayın sonrası

- [ ] API published_deploy yeni ID; ready, published_at ve locked=true doğrulandı.
- [ ] Canlı TR/EN/AR HTML/SEO/asset doğrulamaları geçti; preview noindex canlıya geçmedi.
- [ ] Formlar kapalı; gerçek mesaj/CV gönderilmedi.
- [ ] DNS/domain/secret/site bağlantısı/diğer Netlify projesi değiştirilmedi.
- [ ] Kanıtlar ve gerçek geçen/başarısız/yapılmayan testler raporlandı; kaynak+yayın kayıtları release dalına kaydedildi.
- [ ] Hata varsa otomatik rollback yapılmadı; mevcut durumu oku, kullanıcıya bildir ve ayrı onay al.

Bu işaretler hazırlanmış prosedürdür; doldurulmuş veya panelde uygulanmış işlem değildir. Güncel durum için [KARAOGLU_FINAL_OPERATIONS_REPORT.md](reports/KARAOGLU_FINAL_OPERATIONS_REPORT.md) raporunu okuyun.
