import { Award, Building2, CheckCircle2, Handshake, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal.jsx";

const icons = [Award, Building2, ShieldCheck, Handshake];

export default function WhyUs({ t }) {
  const items = Array.isArray(t?.why?.items) ? t.why.items : [];
  const metrics =
    t?.why?.metrics || [
      { value: "1000+", label: "Kurumsal Çözüm" },
      { value: "30+", label: "Yılı Aşkın Deneyim" },
      { value: "5", label: "Faaliyet Alanı" },
      { value: "Adana", label: "Genel Merkez" },
    ];
  const highlights =
    t?.why?.highlights || [
      "Tek merkezden koordine edilen çok sektörlü hizmet modeli",
      "İhtiyaca göre planlanan şeffaf teklif ve süreç yönetimi",
      "Saha operasyonları, teslimat ve destek adımlarında kurumsal takip",
    ];
  const description =
    t?.why?.description ||
    "Karaoğlu Group, çok sektörlü deneyimini güvenilir operasyon, net iletişim ve uzun vadeli iş ortaklığı anlayışıyla birleştirir.";

  return (
    <section className="why-section section-band bg-white/[0.025] py-16 sm:py-20 lg:py-20">
      <div className="section-shell">
        <div className="max-w-5xl">
          <p className="eyebrow">{t?.why?.eyebrow}</p>
          <h2 className="mt-4 max-w-[21rem] break-words text-3xl font-bold leading-tight tracking-normal text-white sm:max-w-4xl sm:text-4xl lg:text-5xl">
            {t?.why?.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-platinum/88 sm:text-lg">
            {description}
          </p>

          <div className="mt-7 grid gap-3 border-l border-sun/45 pl-4 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex min-w-0 gap-3 text-sm leading-6 text-platinum/88">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-sun/90" />
                <span className="min-w-0">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((metric) => (
            <div key={`${metric.value}-${metric.label}`} className="min-w-0 rounded-lg border border-white/14 bg-white/[0.07] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(185,101,50,0.10)]">
              <span className="block text-2xl font-bold text-white sm:text-3xl">{metric.value}</span>
              <span className="mt-2 block min-w-0 break-words text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.04em] text-orange-200 sm:text-xs sm:tracking-[0.08em]">{metric.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[index] || ShieldCheck;
            const title = typeof item === "string" ? item : item.title;
            const itemDescription = typeof item === "string" ? "" : item.description;
            return (
              <Reveal
                key={title}
                delay={index * 45}
                className="why-item"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-sun/20 bg-sun/[0.11] text-sun">
                    <Icon size={21} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    {itemDescription ? (
                      <p className="mt-3 text-sm leading-7 text-platinum/78">{itemDescription}</p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
