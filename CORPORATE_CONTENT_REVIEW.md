# Kurumsal içerik teyit kaydı

9 Kasım 2026. Kaynak denetimi: mevcut release çalışma ağacı. Bu belge şirketin ticari iddialarını bağımsız olarak doğruladığı veya hukuki uygunluk onayı verdiği anlamına gelmez.

Önceki [teyit envanteri](reports/CORPORATE_CONTENT_REVIEW.md) korundu. Kullanıcı önceki canlı yayın sırasında içerikleri yayımlamayı onayladı; bu yayın izni bağımsız belge/ruhsat/mülkiyet teyidi olarak sunulmadı. Şirket rakamları, isimleri, adresi, unvanları ve üç dildeki ticari içerik bu denetimde değiştirilmedi.

## A. Tamamlandı — kaynakta gerçekten görülenler

| Konu | Kaynak bulgusu |
| --- | --- |
| Marka | `src/data/company.js`: Karaoğlu Group; eski marka adı Karaoğlu Otomotiv. Tam ticari tüzel kişi unvanı olarak kabul edilmedi. |
| İletişim | Telefon `0544 443 80 00`; href `tel:+905444438000`; WhatsApp aynı numara. Arama/mesaj ile işletme kimliği doğrulanmadı. |
| Adres | Sanayi Sitesi, 46003. Sk. No:2, 01100 Seyhan/Adana. Kaynakta var; güncel resmî kayıt olarak doğrulanmadı. |
| Faaliyetler | `src/data/services.js`: otomotiv, filo kiralama, inşaat, petrol ve tarım için beş faaliyet tanımı. Bu kod sayısı, güncel şirket faaliyet/ruhsat kanıtı değildir. |
| Diller | TR/EN/AR metinleri ve yönetici/istatistik anlatıları kaynakta karşılaştırıldı; yeni faaliyet, referans veya başarı iddiası eklenmedi. |
| Structured data | `index.html` Organization JSON-LD: marka, 1993, telefon, adres ve sosyal profiller. Sözdiziminin geçerli olması bu bilgilerin gerçekliğini kanıtlamaz. |

## C. Onay veya bilgi gerekiyor — kanıt tablosu

| İddia / bilgi | Görüldüğü kaynak | Şirketten gereken kayıt |
| --- | --- | --- |
| `1000+` kurumsal çözüm | Üç dilde hero/corporate/why metrikleri; `WhyUs.jsx` fallback | Çözümün tanımı, sayım kapsamı, referans tarihi ve doğrulanabilir iş kaydı. Her kaynak metrik dizisi her ekranda gösterilmez. |
| `30+` / `+30` deneyim | Üç dilde metrikler ve açıklamalar | Fiilî faaliyet geçmişi. 1993 ile matematiksel tutarlılık tek başına kanıt sayılmaz. |
| `1993` kuruluş/başlangıç | `company.founded`, SEO, kurumsal/başkan/footer metinleri ve Organization `foundingDate` | Yetkili tarihçe ve ilgili şirket/işletme kayıtları; marka geçmişi ile tüzel kişi kuruluşu ayrımı. |
| Ertan Karaoğlu / Yönetim Kurulu Başkanı | `chairmanMessage` imza ve unvanı | Güncel görev/unvan, mesaj ve imzanın yayımlanma izni. |
| Beş faaliyet alanı, proje/portföy anlatıları | Faaliyet/portföy/kurumsal metinleri | Aktif ticari kapsam, yayımlanabilir gerçek proje bilgileri ve gerekiyorsa müşteri izni. |
| Mevcut adres/telefon/sosyal hesaplar | `src/data/company.js` | Şirket yetkilisinin güncel kanal ve adres teyidi. |
| Resmî e-posta | Şirket verisinde ayrı kurumsal e-posta alanı yok | Şirketin onaylı iletişim adresi. Form içindeki `ornek@mail.com`/`example@mail.com` kullanıcı giriş örneğidir; işletme alıcısı değildir. |
| İletişim ve kariyer bildirim alıcıları | Kodda onaylı gerçek alıcı yok | İki süreç için onaylı ayrı adresler ve yetkili erişim sahipleri; teslimat ayrıca sınanmalı. |
| Tam tüzel unvan ve resmî tanımlayıcılar | Marka adı mevcut; açık tüzel unvan/MERSİS/sicil/vergi teyidi yok | Yayımlanması kararlaştırılan gerçek bilgiler ve kapsam için yetkili/hukuk incelemesi. Bu tablo her alanın koşulsuz yayımlama zorunluluğu olduğunu iddia etmez. |

## B. Teknik olarak hazır — gerçek bilgiler gelince uygulanacak sıra

1. Yetkili kişi, her iddianın kanıtını ve yayımlanacak son metnini sağlar; ortak bir referans tarihi belirlenir.
2. TR/EN/AR içerik ve Organization JSON-LD birlikte güncellenir; şirket onayı olmadan yeni ticari metin üretilmez.
3. Değişiklikler release/PR/preview üzerinden test edilir; yeni içerik ve canlı yayın ayrıca onaylanır.
4. Medya ilişkisi ve kullanım hakkı [medya envanterindeki](MEDIA_RIGHTS_REVIEW.md) dosyalarla eşleştirilir.

## Ayrı hukuki inceleme kaydı

Mevcut gizlilik penceresi, kendisinin onaylı KVKK metninin yerine geçmediğini açıkça söylüyor. Veri sorumlusu kimliği, işleme amaçları, veri/alıcı/aktarım akışı, saklama ve silme süreleri, kişisel veri başvuru kanalı, kariyer/CV erişimi ve gerektiğinde ayrı açık rıza değerlendirmesi yetkili şirket temsilcisi/hukuk incelemesi bekliyor. Hukuki metin yayımlanmadı veya uygunluk sertifikası verilmedi.

Formlar `VITE_NETLIFY_FORMS_ENABLED=false` kalır. Bu teyit dosyası form aktivasyonu, gerçek test mesajı/CV, Google sahiplik doğrulaması veya yeni production yayını için onay sayılmaz.
