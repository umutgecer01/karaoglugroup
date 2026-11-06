# Karaoğlu Grup - Özel Ön İzleme Sitesi

## 🔒 Gizli Link Mantığı

Bu site **şifresiz** ancak **arama motorlarından tamamen gizli** olarak yapılandırılmıştır.

### Özellikler:
- ✅ Siteden şifre veya login sistemi **yoktur**
- ✅ Doğrudan açılır; hesap oluşturmaya gerek **yoktur**
- ✅ Google, Bing ve diğer arama motorlarında **indekslenmez**
- ✅ **Sadece link bilenlerin** erişebileceği premium ön izleme yapısı
- ✅ Tüm butonlar tam olarak çalışır

## 🚀 Deployment (Yayına Alma)

### Vercel Kullanılıyorsa:
```
Production Domain: (Henüz bağlanmamış)
Preview URL: https://karaoglu-grup-xxxxx.vercel.app
```
Rastgele generated preview link paylaşılır. Bu link tahmin edilmesi neredeyse imkansızdır.

### Netlify Kullanılıyorsa:
```
Site URL: https://karaoglu-grup-preview.netlify.app
```
Özel subdomain tahmin edilmesi zor bir şekilde ayarlanabilir.

## 🔍 Arama Motoru Gizleme Ayarları

### Uygulanmış Konfigürasyonlar:

1. **robots.txt** - Tüm crawler'ları engeller
```
User-agent: *
Disallow: /
```

2. **HTML Meta Etiketleri** - Noindex/Nofollow ayarları
```html
<meta name="robots" content="noindex, nofollow" />
<meta name="googlebot" content="noindex, nofollow" />
```

3. **Sitemap** - Arama motorlarına sunulmaz

## 📞 Çalışan İşlevler

Sitedeki tüm butonlar tamamen işlevseldir:

| İşlev | Link |
|-------|------|
| 📱 Hemen Ara | `tel:+905444438000` |
| 💬 WhatsApp | `https://wa.me/905444438000` |
| 📍 Yol Tarifi | Google Maps (Seyhan, Adana) |
| 🌐 Instagram | https://www.instagram.com/karaoglugroup01/ |
| 👍 Facebook | https://www.facebook.com/karaogluuotomotiv/ |

## 📋 Paylaşım Talimatları

**Müşteri/İş Ortağına Gönderilecek Mesaj:**

> "Karaoğlu Grup'un yeni kurumsal sitesinin ön izlemesine hoş geldiniz. 
> 
> 🔐 **Bu site gizli link mantığıyla korunmaktadır:**
> - Şifre gerekli değildir
> - Arama motorlarında görünmez
> - Sadece bu linke sahip kişiler erişebilir
> - Tüm bağlantılar canlı çalışmaktadır
> 
> **Site Linki:** https://[deployment-url]
> 
> Geri bildirim ve önerileriniz için lütfen [iletişim-bilgileri]"

## 📊 Teknik Notlar

- **Framework:** React + Vite
- **Hosting:** Vercel / Netlify
- **Dil Desteği:** Türkçe, İngilizce, Arapça
- **Responsive:** Mobil ve masaüstü uyumlu
- **Performance:** Optimized assets

## 🛠️ Gelecekteki Ayarlamalar

Production (canlı) siteye geçildiğinde:
1. Canonical URL güncellenmesi
2. robots.txt "Allow" yapıya dönüştürülmesi
3. Sitemap aktifleştirilmesi
4. Google Search Console onayı

## 📝 Notlar

- Bu dosya hızlı referans içindir
- Deployment linki müşterilerle paylaşılmadan önce test edin
- Herhangi bir sorun için iletişime geçin

---

**Son Güncelleme:** 23 Haziran 2026
