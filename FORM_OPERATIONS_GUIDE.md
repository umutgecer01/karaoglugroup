# İletişim, teklif ve kariyer formları işletim rehberi

9 Kasım 2026

**Gönderimler kapalıdır:** `VITE_NETLIFY_FORMS_ENABLED=false` korunur. Bu belge aktivasyon, gerçek mesaj/CV gönderimi, alıcı tanımlama veya hukuki metin yayını onayı değildir. Kaynak düzeltmeleri release/preview aşamasındadır; yeni production yayını ayrıca onay gerektirir.

## Mevcut teknik yapı

| Kullanım | Form adı | Alanlar / taşıma |
| --- | --- | --- |
| Ana sayfa hızlı iletişim ve teklif isteği | `corporate-contact` | Ad, telefon, e-posta, hizmet, isteğe bağlı mesaj; `source=quick-contact`; URL-encoded POST |
| İletişim sayfası | `corporate-contact` | Ad, telefon, e-posta, hizmet, zorunlu mesaj; isteğe bağlı şirket; `source=contact-page`; URL-encoded POST |
| Kariyer | `career-application` | Ad, telefon, e-posta, pozisyon, deneyim, CV; isteğe bağlı mesaj; multipart POST |

Teklif için ayrı backend veya yeni form adı eklenmedi; mevcut hizmet seçimi aynı iletişim altyapısını kullanır. Üç arayüzde de `consent` ve görünmeyen `bot-field` bulunur. Gizli `form-name` gerçek adla eşleşir. Başlangıç HTML'inde iki algılama şablonu, iletişim varyantlarının alan birleşimi ve kariyerin `cv` alanı vardır. Statik ön üretim ayrıca gerçek form HTML'ini üretir.

Netlify, algılama açıkken derlenen HTML'i tarar; yalnızca tarayıcıda oluşan form yeterli değildir. Dosyalı AJAX gönderiminde browser multipart sınırını belirlemeli, `Content-Type` elle verilmemelidir. Proje bunu uygular. Platformun 8 MB toplam istek sınırı altında pay bırakmak için CV sınırı 7 MiB'dır. [Resmî kurulum](https://docs.netlify.com/manage/forms/setup/).

## Uygulanan son teknik düzeltmeler

- Kariyer CV doğrulaması ortak `cvValidationError` yardımcısında toplandı. Eksik/boş dosya, desteklenmeyen uzantı, bilinen uzantı–MIME çelişkisi ve sınır üstü boyut farklı hata türleri verir. PDF/DOC/DOCX korunur; eksik veya genel binary MIME uyumluluk için kabul edilir. Bu bir dosya içeriği, antivirüs veya sunucu güvenlik kontrolü değildir.
- JS doğrulamasında zaten zorunlu olan select, iletişim mesajı, onay kutusu ve CV alanlarına native `required` eklendi. `noValidate` ve mevcut yerelleştirilmiş hata akışı korunur. Formlar gönderimde `aria-busy` bildirir.
- Kariyer CV alanı hata yokken var olmayan hata elemanına `aria-describedby` ile başvurmuyor; yardım metni ilişkisi korunur.
- TR/EN/AR başarı mesajları yalnızca talebin alındığını bildirir. Departmana/e-posta kutusuna teslim veya belirli zamanda dönüş iddia edilmez.

Mevcut `pending` ref'i ikinci eşzamanlı gönderimi önler. İlk geçersiz alan odaklanır. Sunucu/network hatası yerelleştirilmiş genel mesaj verir; veriler formda kalır. Başarılı HTTP yanıtından sonra form sıfırlanır; HTTP kabulü alıcının e-posta teslimatını kanıtlamaz. Kapalı flag'de ağ isteği oluşmaz; dolu honeypot reddedilir. Otomatik POST tekrarı yoktur.

## Yetkili API ile doğrulanan durum

9 Kasım 2026 yaklaşık 12:31 İstanbul: Hedef **karaoglugroupnet**, ID `b4753086-eb94-4a7e-b5f5-7270835fab3a`. Salt okunur API, `use_forms=true` ve `processing_settings.ignore_html_forms=false` ile algılamanın açık olduğunu doğruladı. İki form da kayıtlı; alan birleşimleri ve kariyer `cv` alanı doğru, submission sayıları 0. Kişisel submission içeriği/CV okunmadı. Dokuz notification hook'u yalnız GitHub App deploy olayları içindi; form e-posta bildirimi bulunmadı. Ham kanıt: Git dışında `reports/master-operations/remote-baseline.json`.

Algılama açık olduğu için değiştirilmedi. İkincil projenin form algılaması kapalı; bu ayar değiştirilmez. Backend algılamasının açık olması arayüz aktivasyonu veya hukuki/dosya güvenliği onayı değildir; frontend flag false kalır.

## Bildirimler ve panel sırası

1. **Forms → Active forms:** iki formun alanları ve ek spam önleme durumu kontrol edilir. Kişisel submission içeriği rapor veya Git'e aktarılmaz.
2. **Forms → Submission notifications:** alıcılar form adına göre ayrı seçilir. Şirket teyidi olmadan public adresten form alıcısı çıkarılmaz; bildirim veya ekip daveti oluşturulmaz.
3. Verified/Spam takibi ve başarısız teslimat incelemesi için yetkili kişi belirlenir. HTTP hatası ile e-posta bildirim hatası ayrı izlenir; kişisel mesaj/CV/e-posta loglanmaz.

| Bildirim | Alıcı | Gerekli teyit |
| --- | --- | --- |
| `corporate-contact` | Belirlenmedi | Şirket onaylı iletişim/teklif sorumlusu ve adres |
| `career-application` | Belirlenmedi | Şirket onaylı İK sorumlusu, adres ve CV erişim listesi |

Yeni/düzenlenen e-posta bildirim alıcısı, Enterprise/Legacy Business istisnası dışında aktif Netlify ekip üyesi olmalıdır. Eski bildirimlerin çalışması yeni alıcının kaydedilebildiğini kanıtlamaz; plan/üyelik panelden doğrulanmalıdır. [Resmî bildirim belgesi](https://docs.netlify.com/manage/forms/notifications/).

## Spam ve oran sınırlama

Netlify spam filtresi ile `bot-field` honeypot'u birlikte değerlendirilir. Statik HTML ve POST aynı alan adını taşır; ek spam önleme durumu Netlify'de kontrol edilir. [Resmî spam önlemleri](https://docs.netlify.com/manage/forms/spam-filters/).

Frontend çift gönderim kilidi IP/hesap temelli rate limit değildir. Planın desteklediği trafik kuralları ve hacim değerlendirilmelidir; `/` üzerindeki rastgele bir kural bütün siteyi/formları engelleyebilir. Gerekiyorsa onaylı sunucu kabul katmanında limit ve izleme hazırlanır. reCAPTCHA gibi ek servisler veri aktarımı, erişilebilirlik, anahtar ve CSP incelemesi gerektirir; eklenmedi, CSP zayıflatılmadı.

## CV güvenliği — aktivasyon engeli

Tarayıcıdaki `accept`, uzantı, MIME ve boyut kontrolü atlatılabilir. Sitede dosyanın gerçek içeriğini doğrulayan, zararlı yazılım tarayan veya indirmede yetkili oturum uygulayan özel backend mevcut değildir.

Netlify form dosyalarının doğrudan bağlantıları panel, bildirim, CSV ve API'de bulunabilir; formun silinmesi bağlantıları aynı anda erişilemez yapmaz. Doküman silme sonrası 24 saatlik erişilebilirlik/cache penceresi belirtir; kişisel veri içeren yüklemeler için ek güvenlik/VGS entegrasyonu önerir. [Dosya ve hassas veri belgesi](https://docs.netlify.com/manage/forms/submissions/).

**CV'lerin gizli/yetkili erişimli olduğu doğrulanmadan kariyer formu açılmamalıdır.** Şirketin onayladığı dosya kabul/saklama ve erişim modeli, gerekiyorsa PII güvenlik entegrasyonu veya eşdeğer yetkili backend seçilmelidir. Henüz sağlayıcı/hesap seçilmedi; yeni entegrasyon açılmadı, gerçek CV yüklenmedi.

Kimlerin indirdiği, erişimlerin kaldırılması/kaydı, saklama süresi, bildirimde dosya bağlantısı politikası, dışa aktarılan kopyalar, silme takvimi ve silme doğrulaması belirlenmelidir. Rastgele saklama süresi yazılmamalı; gerçek CV bağlantısı public rapor, Git veya loga konmamalıdır.

## KVKK ve hukuki içerik

Mevcut kısa genel amaç cümlesi ve onay kutusu tek başına tamamlanmış aydınlatma veya uygun işleme şartı kabul edilmedi. Veri sorumlusu tüzel adı/varsa temsilcisi, iletişim/başvuru kanalı, iletişim–kariyer amaçları, veri kategorileri, alıcı/aktarım amaçları, toplama yöntemi/hukuki sebebi, saklama/silme ve ilgili kişi haklarının işletilmesi şirket/hukuk incelemesini bekler. Aydınlatma ile gerekiyorsa açık rızanın ayrı süreçler olduğu değerlendirilmelidir. [KVKK Kurumu](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-), [resmî tebliğ](https://www.kvkk.gov.tr/Icerik/4132/aydinlatma-yukumlulugunun-yerine-getirilmesinde-uyulacak-usul-ve-esaslar-hakkinda-teblig).

Sağlayıcılara aktarım, hosting konumu, alt işleyenler ve gereken sözleşme/aktarım değerlendirmesi ayrıca onaylanmalıdır. Bu belge şirkete ait yayımlanacak hukuk metni veya uygunluk sertifikası değildir. Onaysız yeni hukuki metin siteye eklenmedi. Native required onay kutuları yalnız mevcut JS doğrulamasını yansıtır; işleme sebebinin hukuken onaylandığını göstermez.

## Aktivasyon sırası

1. Doğru projede detection ve iki formun alanlarını doğrulayın.
2. Şirket onaylı iki alıcıyı/panel erişimlerini belirleyin; bildirim değişikliği için onay alın.
3. CV özel erişim/saklama/silme modeli ile hukuki metinleri onaylayın. Tamamlanmazsa kariyer kapalı kalır.
4. Yerel mock testlerde validation, honeypot, pending/çift gönderim, HTTP 500/200, multipart ve hata odağını çalıştırın; teslimat kanıtı diye sunmayın.
5. Gerçek test mesajı ve kişisel veri içermeyen dosya için ayrı açık izin alın. Test alıcısı/hedef belli olmadan POST yapmayın.
6. Submission kaydı, gelen kutusu/spam ve dosya erişim güvenliğini birlikte doğrulayın. Başarısızlıkta flag açılmaz, kişisel içerik raporlanmaz.
7. Production aktivasyonu/yayını için ayrıca onay alın. `netlify.toml` false değeri ve bağımsız Actions build ortamı bilinçli değiştirilmeden yalnız panel değişkeni yeterli değildir. Token `VITE_` değişkenine konmaz.

İletişim/kariyer farklı zamanda açılacaksa mevcut ortak flag bilinçli ayrılmalı ve ayrı test edilmelidir; bu çalışma ikisinden birini kendiliğinden açmaz.

## Bu çalışmada doğrulama

`node --test scripts/forms-readiness.test.mjs scripts/core.test.mjs`: **12/12 başarılı** (2 yeni CV sınır/MIME testi ve 10 mevcut regresyon). `npm run lint:security` başarılı. Birincil build/statik, responsive ve mock etkileşim testlerinin güncel sonuçları ana operasyon raporunda belirtilir; yapılmamış testlere başarı verilmez. Gerçek submission, bildirim teslimatı, gerçek CV erişim/silme veya yasal uygunluk testi yapılmadı.
