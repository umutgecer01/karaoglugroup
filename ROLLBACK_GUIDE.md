# Karaoğlu Group geri dönüş prosedürü

Bu belge uygulanabilir hazırlık prosedürüdür; **bu çalışma rollback yapmadı**. Canlı geri dönüş için hedef deployment ve gerekçeyi içeren ayrı kullanıcı onayı gerekir.

## Doğrulanmış başlangıç

- Hedef site: `karaoglugroupnet`, ID `b4753086-eb94-4a7e-b5f5-7270835fab3a`.
- Başlangıç canlı URL: https://karaoglugroupnet.netlify.app/.
- Şu anki çalışan yayın: `6af18e98278ff0906ad9ca6a`, kaynak `6ca07f9`, kilitli.
- Korunan önceki çalışan yayın: `6af17892dbe0ae394ffc49ca`, kaynak `c45a5c0`; yetkili GET deploy API'si ready ve aynı site kimliğini döndürdü.
- Daha eski `6a462f368c237a00082c4a7b` bu çalışma için varsayılan geri dönüş hedefi değildir.

## Ön kontrol ve onay

1. Yetkili Netlify hesabıyla yalnızca GET kullanarak `/sites/{site_id}` ve `/deploys/{deployment_id}` okuyun. Gerçek URL/Project ID, aktif published deployment, kilit ve geri dönülecek deployment'ın aynı siteye ait ready durumu eşleşmeli.
2. İlgili deployment permalink'inde doğru içerik, formların kapalı olması, güvenlik/cache kuralları ve production indexleme metadata'sını kontrol edin. API context alanına tek başına bakmayın: ilk draft'tan onaylı yayınlanmış bir deployment'ta context tarihsel olarak deploy-preview kalabilir.
3. Başka production operasyonu çalışmadığını teyit edin. Actions/manuel CLI işlemlerini aynı anda başlatmayın. Mevcut durum ve sebebi kayıt altına alın.
4. Kullanıcıdan **tam hedef deployment ID'siyle rollback onayı** alın. Önceki yayın onayı rollback onayı sayılmaz.

## Yalnızca onaydan sonra uygulanacak işlem

Tercih edilen işlem, doğrulanmış hedef deployment'a Netlify'nin resmî `lockDeploy` API operasyonunu bir kez uygulamaktır. Yayımlanmamış önceki deployment'ı yayınlar ve kilitler; genel otomatik yayını açmak gerekmez. [Resmî API](https://open-api.netlify.com/#tag/deploy/operation/lockDeploy).

API yolu: `POST /deploys/{onaylanan_deployment_id}/lock`. Token yalnızca güvenli süreç belleği/ortamında bulunur; komut metnine, sohbet veya loga yazılmaz. Bu belge otomatik çalışan curl komutu veya gömülü token içermez.

Yanıt 202 ise yayın tamamlandı denmez; GET site/deploy ile yayınlanan ID ve kilit izlenir. POST zaman aşımı olursa **aynı yazma işlemini körlemesine tekrarlamayın**; önce güncel GET durumunu inceleyin. Otomatik rollback veya otomatik unlock tanımlı değildir.

## Son doğrulama

- `published_deploy.id` onaylanan geri dönüş hedefiyle aynı; `locked=true`.
- Git bağlantısı/depo/main, `npm run build`/`dist`, `stop_builds=false`, domain/DNS/secrets aynı.
- TR/EN/AR ana ve iletişim/kariyer sayfaları; aynı sayfada dil geçişi; 404 gerçek HTTP durumu.
- Canonical/hreflang/indexleme, sitemap/robots, görsel/video, cache/security headers ve formların kapalı olması.
- Saat, onay, önce/sonra ID, kullanılan kaynak/manifest ve test sonuçları Türkçe raporlanır; doğrulanmamış sonuç başarılı sayılmaz.

Geri dönüş sonrasında hatalı release dalını reset/force-push ile silmeyin. Düzeltmeyi normal yeni commit ile hazırlayın, preview ve kontrollerden sonra ayrı yayın onayı alın. Önceki deployment ve Git geçmişi korunur.
