# Netlify panelinde kalan işlemler — 8 Kasım 2026

Bu adımlar **uygulanmadı**. Hesap/panel ve yeni sürüme ait Deploy Preview erişimi yok. Mevcut public siteye yalnızca GET istekleri yapıldı; yayın, DNS, Git push veya form POST yapılmadı.

## Korunan yapılandırma

- Mevcut site: `karaoglugroupnet.netlify.app`; site bağlantısı/kimliği değiştirilmedi.
- Build: `npm run build`; publish: `dist`; Node: `22`.
- `.env.example` ve `netlify.toml`: `VITE_NETLIFY_FORMS_ENABLED=false`.
- `VITE_SITE_URL`: mevcut production adresi. Doğrulanacak önizleme adresi için canonical politikasına göre build ortamı belirlenmeli; bu çalışmada değiştirilmedi.
- HTML yeniden doğrulanır; hash'li `/assets/*` bir yıl immutable, mevcut `/images/*` 30 gün, `/videos/*` 7 gün cache kullanır. Görsellerin aynı dosya adıyla ileride değiştirilmesi durumunda yeni dosya adı/URL kullanılmalı veya cache politikası ayrıca gözden geçirilmelidir.
- Bilinen yollar statik dosyadır; bilinmeyen yollar `/404.html`, HTTP 404. Mevcut public yayında bu kural henüz görülmedi: denenen bilinmeyen adres 200 döndü.

## Panel ve yetkili test sırası

1. Doğru Netlify projesini açın. Mevcut repo/branch bağlantısını, build ve publish ayarlarını karşılaştırın. Yeni site oluşturmayın; mevcut bağlantıyı değiştirmeyin. Bu paket için henüz Netlify derlemesi/dağıtımı yapılmadı.
2. **Forms → Enable form detection** durumunu kontrol edin. Algılama açıksa sonraki yetkili dağıtımda HTML taranır. Üretilen HTML'de `corporate-contact` ve `career-application` isimleri, `data-netlify="true"`, `netlify-honeypot="bot-field"` ve gizli `form-name` alanları hazırdır. [Netlify Forms kurulumu](https://docs.netlify.com/manage/forms/setup/).
3. Kullanıcıdan **önizleme dağıtımı** için onay alın; gönderim flag'ini false tutarak onaylı Deploy Preview oluşturun. Build logunda 54 yerelleştirilmiş sayfa üretimini, iki formun algılanmasını ve bütün alanların kaydını doğrulayın. Dosya yüklemede `cv` alanı ve multipart desteğini kontrol edin. Yerel başarılı test, paneldeki algılamayı kanıtlamaz.
4. **Forms → Submission notifications** bölümünde yetkili iletişim ve kariyer alıcılarını tanımlayın/teyit edin. Gerçek alıcı adresleri kaynakta yok; bu çalışmada uydurulmadı veya dış servisten aranmadı. [Bildirim kurulumu](https://docs.netlify.com/manage/forms/setup/#set-up-notifications).
5. Yetkili kişilerle CV erişim izinleri, veri saklama/silme, spam inceleme ve dosya güvenliği süreçlerini belirleyin. Frontend flag'i backend erişim kontrolü değildir; Netlify'nin spam/erişim ayarları ayrıca doğrulanmalıdır. Hukuki metin onayı gerekir.
6. Kullanıcıdan **gerçek test gönderimi ve alıcıya veri iletimi** için ayrıca onay alın. Frontend flag'i false kalırken yetkili test istemcisiyle onaylı test adresine bir iletişim ve küçük, kişisel veri içermeyen CV örneği gönderilebilir. Bu çalışmada böyle bir POST yapılmadı. Testi production alıcısına veya adresine kendiliğinizden yöneltmeyin.
7. Hem Netlify submission kaydını hem alıcı gelen kutusu/spam klasörünü ve ekin açılmasını doğrulayın. Sadece HTTP 200 veya yerel taklit yanıt teslimat kanıtı değildir. Honeypot/spam davranışını ve başarısız gönderimlerin ele alınmasını yetkili test kapsamında kontrol edin.
8. Gerçek teslimat ve hukuki süreç onaylandıktan sonra **form aktivasyonu/yeni dağıtım için onay** alın. O zaman build yapılandırması bilinçli olarak değiştirilir. Şimdiki `netlify.toml` false değeri paneldeki aynı isimli değeri ezer; sadece panelde true yapmak yeterli değildir. [Netlify ortam değişkeni önceliği](https://docs.netlify.com/build/environment-variables/overview/#overrides). Bu çalışmada false kaldırılmadı/true yapılmadı.
9. GitHub Actions ayrı build çalıştırıyorsa public flag o build ortamında da açıkça yönetilmelidir; Netlify panelindeki değişkenler bağımsız GitHub build'ine kendiliğinden aktarılmaz. `VITE_` değişkenlerinde sır saklamayın. Mevcut `main` push workflow'su production deploy tetikleyebilir; onaysız push yapılmamalıdır.
10. Onaylı preview üzerinde `/tr/`, `/en/contact/`, `/ar/`, sektör sayfaları ve rastgele bilinmeyen URL için gerçek HTTP durumlarını; canonical/hreflang, sitemap/robots, cache ve güvenlik başlıklarını doğrulayın. Mobil ve masaüstü LCP'yi tekrar ölçün. HSTS, CSP, nosniff, frame/referrer/permissions politikalarını dönen yanıtlardan kontrol edin; yalnızca toml dosyasına bakarak canlıda başarılı saymayın.
11. Sonuçlar ve içerik onayları tamamlanınca production yayını için ayrıca onay alın. Domain/DNS değişikliği gerekiyorsa bunu ayrı onaya tabi tutun. Bu çalışmada domain/DNS planlanmadı.

## Erişim sınırı

Yeni yerel build'in Netlify preview HTTP/Forms/CDN doğrulaması: **TEST EDİLMEDİ**. Mevcut production üzerinde salt okunur HTTP kanıtı: [public-http.json](final-release/public-http.json). Bu kanıt yeni build'in yayınlandığını göstermez.
