# Domain ve kurumsal e-posta için devir notları

Hedef domain: `karaoglugroupglobal.com`. Bu hazırlık sahiplik, DNS, HTTPS veya
Google Workspace hesabının doğrulandığı anlamına gelmez. Kodun varsayılan
adresi `https://karaoglugroupnet.netlify.app/` olarak kalır.

## Domain hazırlığı

`VITE_SITE_URL` tek derleme girdisidir. `site.config.mjs`, Vite HTML şablonu,
prerender ve sitemap/robots üreticisi bu girdiyi kullanır. Bir yerel deneme için
üç form bayrağı da `false` iken `VITE_SITE_URL=https://karaoglugroupglobal.com/`
ve `CONTEXT=production` ortamıyla `npm run build` ve
`node --test scripts/release-static.test.mjs` çalıştırılır. Bu komutlar yayın
yapmaz; `dist/` ve `public/` metadata dosyalarını yeniden üretir. Deneme
sonrasında değişkeni kaldırıp mevcut domainle tekrar derlemek gerekir.

Statik kontroller 54 sayfanın canonical, hreflang, Open Graph, Twitter,
Organization URL/logo ve robots etiketlerini; 51 içerik sayfasının sitemap
kapsamını doğrular. Önizlemeler `noindex` kalmalıdır.

Geçiş için şirketin domain sahipliği ve tercih ettiği canonical hostname,
DNS/HTTPS doğrulaması, eski URL yönlendirme planı ve Search Console işlemleri
ayrıca onaylanmalıdır. Production yayın politikası mevcut domaine sabitlidir;
gelecekteki değişiklik o politikanın da ayrı incelemesini gerektirir. Bu PR
production politikasını, DNS'i veya Netlify ayarlarını değiştirmez.

## Google Workspace hazırlığı

`src/data/company.js` içinde `email` ve `emailHref` boş (`null`). İletişim ve
footer bu alanlar boşken e-posta bağlantısı göstermez. JSON-LD içinde de
onaysız adres bulunmaz. İletişim/kariyer form alıcıları bu alanlardan türetilmez.
Tarayıcıya hesap parolası, SMTP bilgisi veya servis hesabı anahtarı konulmaz.

Şirket yetkilisi Workspace hesabını ve domain sahipliğini doğrulamalı;
Google yönetim konsolunun verdiği güncel MX ve doğrulama değerlerini kullanmalı,
SPF/DKIM/DMARC yapılandırmasını yetkili yöneticiyle tamamlamalıdır. Bu PR DNS
kaydı oluşturmaz veya hazır bir kayıt değeri varsaymaz.

Adres ancak şirketin onayı ve gerçek gelen/giden posta doğrulamasından sonra
yayınlanabilir. O aşamada `email` ve karşılık gelen `mailto:` bağlantısı birlikte
güncellenmeli; şimdiki kapalı-adres regresyon testi yeni onaylı davranışa göre
ayrı PR'da değiştirilmelidir. Bu çalışma gerçek e-posta veya form göndermez.

## Formlar ve referanslar

İletişim/teklif için ana bayrak + `VITE_CONTACT_FORMS_ENABLED`; kariyer için
ana bayrak + `VITE_CAREER_FORMS_ENABLED` gerekir. Kalıcı varsayılanların tümü
kapalıdır. İletişim alıcısı ve kariyer alıcısı ayrı onaylanmalıdır. Kariyer için
özel CV erişimi, güvenli saklama, silme süresi, dosya inceleme ve KVKK metni
tamamlanmadan aktivasyon yapılmamalıdır. İstemci bayrakları sunucu yetkilendirmesi
sağlamaz.

`approvedReferences` kasıtlı olarak boştur. Şirket/proje kimliği, doğruluk
kanıtı, üç dilde açıklama, logo hakkı ve yayın izni şirketçe sağlanmalıdır.
`verified` ve `publicationApproved` birlikte doğru olmayan kayıtlar gösterilmez.
Yerel logo dosyası `/images/` altında bulunmalı; izinli raster formatı ve sabit
boyut kullanılmalıdır. Kodda örnek firma veya proje adı yayımlanmaz.
