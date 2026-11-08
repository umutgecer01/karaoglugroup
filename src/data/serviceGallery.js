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
      label: "Bahçe ve Tarla Üretimi",
      alt: "Karaoğlu Group bünyesindeki bahçe ve tarla üretim alanları",
      src: "/images/agriculture-1.jpg",
      width: 1408,
      height: 530,
      fit: "contain",
    },
    {
      label: "Mısır ve Buğday Tarlaları",
      alt: "Mısır ve buğday ekili tarım arazilerinin genel görünümü",
      src: "/images/agriculture-2.jpg",
      width: 1408,
      height: 622,
      fit: "contain",
    },
    {
      label: "Sezonluk Üretim Alanları",
      alt: "Dağ eteklerinde yer alan sezonluk tarımsal üretim alanları",
      src: "/images/agriculture-3.jpg",
      width: 1408,
      height: 611,
      fit: "contain",
    },
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

export const getServiceGallery = (serviceId, serviceContent = {}) => {
  const translatedGallery = Array.isArray(serviceContent.gallery) ? serviceContent.gallery : [];
  const translatedImages = translatedGallery.filter((item) => item && typeof item !== "string" && item.src);

  return translatedImages.length
    ? translatedImages.map((image, index) => ({ ...serviceGalleries[serviceId]?.[index], ...image }))
    : serviceGalleries[serviceId] || [];
};
