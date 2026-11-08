# Performans karşılaştırması

8 Kasım 2026; son production build üzerinde yerel Chrome ölçümü.

| Metrik | Önce | Sonra |
| --- | ---: | ---: |
| Mobil Lighthouse performans puanı | N/A | N/A |
| Masaüstü Lighthouse performans puanı | N/A | N/A |
| Mobil LCP (yerel laboratuvar) | 4,26 sn | 2,544 sn |
| Masaüstü LCP (yerel laboratuvar) | 2,944 sn | 2,78 sn |
| Mobil CLS (8 saniye) | 0 | 0 |
| Masaüstü CLS (8 saniye) | 0,002 | 0 |
| INP / saha Core Web Vitals | N/A | N/A |
| Ana JavaScript dosyası | 273,44 kB | 278,009 kB |
| Ana JavaScript gzip | 85,091 kB | 86,936 kB |
| Ana CSS dosyası | 69,611 kB | 66,592 kB |
| Ana CSS gzip | 13,511 kB | 12,943 kB |
| Mobil ilk 8 sn encoded HTML + kaynaklar | 526,914 kB | 502,018 kB |
| Masaüstü ilk 8 sn encoded HTML + kaynaklar | 1.111,045 kB | 966,852 kB |
| Mobil ilk 8 sn transfer (Performance API) | 532,614 kB | 507,418 kB |
| Masaüstü ilk 8 sn transfer (Performance API) | 1.118,245 kB | 973,452 kB |
| 16 görsel / tam boy WebP seti | 2.771,443 kB | 2.184,930 kB |
| 16 görsel / mobil WebP seti | 2.771,443 kB | 934,338 kB |
| MP4 dosya boyutu | 3.138,315 kB | 3.138,315 kB (yeniden kodlanmadı) |

Tek koşu/profil, 150 ms gecikme, 1.6 Mbps, 4× CPU, DPR 1; gizlilik tercihi önceden kayıtlı, soğuk cache, 8 saniye gözlem. Hedef URL'ler eski root ile güncel /tr/ sayfasıdır. Bu bir Lighthouse veya alan ölçümü değildir. Yerel HTTP yanıtları CDN sıkıştırmasını temsil etmez. Kaynak transfer toplamı yalnızca gözlem penceresindeki istekleri içerir; bütün sitenin indirmesi değildir.

Ana JavaScript dosyası hata kurtarma, URL ve metadata altyapısı nedeniyle büyüdü; CSS küçüldü. Fotoğraf varyantlarının tamamı tek sayfada indirilmez. JPEG yedekleri tutulduğu için depo toplamında boyut azalması iddia edilmiyor. Video dosyası küçülmedi; etkileşim öncesi indirme engellendi. [Ham ölçümler](performance.json).
