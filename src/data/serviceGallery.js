export const serviceGalleries = {
  automotive: [
    {
      label: "Kurumsal Araç Portföyü",
      alt: "Karaoğlu Otomotiv saha alanında sıralanmış kurumsal araç portföyü",
      src: "/images/automotive-gallery-1.jpg",
      width: 960,
      height: 540,
    },
    {
      label: "Otomotiv Operasyon Alanı",
      alt: "Karaoğlu Otomotiv operasyon alanında iki sıra halinde konumlandırılmış araçlar",
      src: "/images/automotive-gallery-3.jpg",
      width: 960,
      height: 540,
    },
  ],
  construction: [
    {
      label: "Altyapı Uygulama Alanı",
      alt: "Şehir içi altyapı çalışmasında yerleştirilen beton boru hattı",
      src: "/images/construction-1.jpg",
      width: 760,
      height: 1014,
      fit: "contain",
    },
    {
      label: "Saha Koordinasyonu",
      alt: "İş makinesi, kamyon ve saha personeliyle yürütülen altyapı çalışması",
      src: "/images/construction-2.jpg",
      width: 760,
      height: 872,
      fit: "contain",
    },
    {
      label: "Boru Hattı Montajı",
      alt: "Kazı alanında beton boru hattı montaj ve ölçüm çalışması",
      src: "/images/construction-3.jpg",
      width: 760,
      height: 884,
      fit: "contain",
    },
    {
      "label": "Beton Yapı İç Detayı",
      "alt": "Dairesel beton yapının içinde mavi merdivenler ve kat döşemeleri",
      "src": "/images/construction/real/construction-tower-interior.jpg",
      "width": 1448,
      "height": 1086,
      "fit": "contain",
      "position": "50% 50%"
    },
    {
      "label": "Beton Yapı Dış Görünümü",
      "alt": "Çok katlı dairesel beton yapının dışarıdan görünümü",
      "src": "/images/construction/real/construction-tower-exterior.jpg",
      "width": 1086,
      "height": 1448,
      "fit": "contain",
      "position": "50% 45%"
    },
    {
      "label": "Saha Kurulumu",
      "alt": "Vinç, kırmızı jeneratör ve çalışanların bulunduğu kurulum sahası",
      "src": "/images/construction/real/construction-generator-installation.jpg",
      "width": 1448,
      "height": 1086,
      "fit": "contain",
      "position": "50% 55%"
    }
  ],
  petroleum: [
    {
      label: "Karaoğlu Petrol İstasyonu",
      alt: "Energy markalı Karaoğlu Petrol istasyonunun dış görünümü",
      src: "/images/petrol-energy-1.jpg",
      width: 960,
      height: 292,
      fit: "contain",
    },
    {
      label: "Akaryakıt Saha Operasyonu",
      alt: "Akaryakıt istasyonu pompa ve saha operasyon alanı",
      src: "/images/petrol-energy-2.jpg",
      width: 960,
      height: 492,
    },
    {
      label: "Enerji Tesisi Genel Görünüm",
      alt: "Yol kenarında yer alan Karaoğlu Petrol enerji tesisinin genel görünümü",
      src: "/images/petrol-energy-3.jpg",
      width: 960,
      height: 404,
      fit: "contain",
    },
  ],
  agriculture: [
    {
      "label": "Hasat ve Ürün Nakliyesi",
      "alt": "Kırmızı biçerdöverden yeşil kamyona tahıl aktarımı",
      "src": "/images/agriculture/real/agriculture-grain-transfer.jpg",
      "width": 1086,
      "height": 1448,
      "fit": "contain",
    "position": "50% 40%"
    },
    {
      "label": "Tarımsal Hasat Faaliyetleri",
      "alt": "Sarı biçerdöverin tarlada sarı kamyona tahıl aktarması",
      "src": "/images/agriculture/real/agriculture-harvest-yellow.jpg",
      "width": 1086,
      "height": 1448,
      "fit": "contain",
    "position": "50% 52%"
    },
    {
      "label": "Ayçiçeği Hasadı",
      "alt": "Ayçiçeği tarlasında görünen sarı biçerdöver",
      "src": "/images/agriculture/real/agriculture-sunflower-field.jpg",
      "width": 1448,
      "height": 1086,
      "fit": "contain",
      "position": "50% 55%"
    },
    {
      "label": "Buğday Hasadı",
      "alt": "Buğday tarlasında çalışan kırmızı biçerdöver",
      "src": "/images/agriculture/real/agriculture-wheat-harvest.jpg",
      "width": 1086,
      "height": 1448,
      "fit": "contain",
    "position": "50% 40%"
    },
    {
      "label": "Tarımsal Ürün Depolama",
      "alt": "Depo içinde düzenli istiflenmiş gübre çuvalları",
      "src": "/images/agriculture/real/agriculture-fertilizer-storage.jpg",
      "width": 1086,
      "height": 1448,
      "fit": "contain",
      "position": "50% 55%"
    },
    {
      "label": "Tarla Operasyonları",
      "alt": "Yol kenarında sarı biçerdöverden kamyona ürün aktarımı",
      "src": "/images/agriculture/real/agriculture-roadside-harvest.jpg",
      "width": 1448,
      "height": 1086,
      "fit": "contain",
      "position": "50% 55%"
    }
  ],
  rental: [
    {
      label: "Filo Planlama",
      alt: "Kurumsal filo kiralama araclarinin kapali saha altinda konumlandigi operasyon alani",
      src: "/images/fleet-rental-1.jpg",
      width: 1200,
      height: 481,
    },
    {
      label: "Toplu Araç Teslimi",
      alt: "Toplu araç portföyü ve ticari filo araçlarının yer aldığı geniş filo sahası",
      src: "/images/fleet-rental-2.jpg",
      width: 1200,
      height: 449,
    },
    {
      label: "Kurumsal Operasyon",
      alt: "Pickup araçlardan oluşan kurumsal filo kiralama araç sırası",
      src: "/images/fleet-rental-3.jpg",
      width: 1200,
      height: 437,
    },
  ],
};

export const getServiceGallery = (serviceId, serviceContent = {}, placement = 'detail') => {
  const translatedGallery = Array.isArray(serviceContent.gallery) ? serviceContent.gallery : [];
  const images = (serviceGalleries[serviceId] || []).map((image, index) => {
    const translated = translatedGallery[index];
    return translated && typeof translated === 'object' ? { ...image, ...translated } : image;
  });
  // Detail starts with grain transfer; the home agriculture group starts with wheat harvesting.
  return serviceId === 'agriculture' && placement === 'preview'
    ? [images[3], ...images.filter((_, index) => index !== 3)].filter(Boolean)
    : images;
};
