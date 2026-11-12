# Karaoğlu Grup — Yayın öncesi hazırlık (kod değişiklikleri)

Bu değişiklikler **canlı siteyi yayımlamaz**; `main` üzerinde uygulanmamalıdır.
Önce `feature/*` dalında inceleme ve CI/test, sonra açık yayın onayı gerekir.

## Hazırlananlar

- İletişim / teklif ile kariyer başvuruları ayrı etkinleştirme düğmelerine ayrıldı.
- Ana `VITE_NETLIFY_FORMS_ENABLED` kontrolü zorunlu ve kapalı kaldı.
- `VITE_CONTACT_FORMS_ENABLED` ve `VITE_CAREER_FORMS_ENABLED` varsayılan `false`.
- Kod gerçek gönderimi ancak ilgili iki bayrak birlikte açıkken kabul eder.
- Otomatik QA'nın sadece localhost üzerinde test ettiği mock formlar her iki bayrakla açılır.
- Sitemap ve robots testleri `SITE_URL` değişkeni üzerinden çalışır.
- Onaylı referanslar için boş, izin kontrolü olan veri modeli ve görünüm eklendi.
- Şirket e-postası alanı **boş**; doğrulanmadan yanlış adres yayımlanmaz.
- Canlı URL, Netlify proje kimliği, production workflow kilidi ve yayın politikası değişmedi.

## Şirket / hesap onayı gerektirenler

1. `karaoglugroupglobal.com` satın alma, sahiplik kanıtı, Cloudflare DNS ve Netlify custom-domain/HTTPS.
2. Google Workspace şirket hesabı, MX/TXT/SPF/DKIM/DMARC ve çalışan kurumsal gelen kutusu.
3. İletişim formu bildirim alıcısının ve gerçek teslimatın şirketçe doğrulanması.
4. CV özel erişim, dosya güvenliği, saklama/silme, KVKK aydınlatma ve onay.
5. Referans gösterilecek firma/proje isimleri ile logo/fotoğraf yayın izinleri.
6. 1993, 1000+ ve diğer kurumsal iddiaların şirket kayıtlarıyla teyidi.
7. GitHub production environment, yetkili reviewer, secret ve PR incelemesi.
8. Canlı domain değişimi ve yayın için ayrı açık yetki.

## Gelecekte domain geçişi

Alan adı satın alınıp DNS ve HTTPS doğrulandıktan sonra `VITE_SITE_URL`
`https://karaoglugroupglobal.com/` yapılmalı; domain bazlı testler, sitemap,
canonical, OG ve robots ayrı build'de doğrulanmalı. `production-policy.mjs`,
`netlify-deploy.yml`, deployment raporları ve Netlify ayarları birlikte
kontrollü biçimde güncellenmeli. **Bu yamada canlı varsayılan URL değişmez.**

## Gelecekte iletişim formu açılması

İletişim için ana kapı ve CONTACT bayrağı ayrı onayla açılırken CAREER=false
kalmalı. Mevcut production yayın politikası formların tümü kapalı olmasını
zorunlu kılıyor; yeni gönderim açma kararı verildiğinde bu kapı da ayrı
incelemeli, testli ve onaylı bir değişiklikle güncellenmelidir.
Tarayıcı bayrakları server-side erişim kontrolü değildir.
Netlify Forms endpoint erişimi ve veri koruması ayrıca değerlendirilmelidir.

## Kontroller

- `npm ci`
- `npm test`
- `npm run security:check`
- `npm run build`
- `node --test scripts/release-static.test.mjs`
- `npm run qa:windows` (Windows + Node 22 + Chrome/Edge)

Bu çalışmada gerçek mesaj/CV gönderilmez; production yayını yapılmaz.
