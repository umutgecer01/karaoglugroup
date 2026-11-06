import { Award, Building2, CheckCircle2, Handshake, ShieldCheck } from "lucide-react";
import whyBackground from "../assets/karaoglu-why-bg.jpeg";
import Reveal from "./Reveal.jsx";

const icons = [Award, Building2, ShieldCheck, Handshake];

export default function WhyUs({ t }) {
  const items = Array.isArray(t?.why?.items) ? t.why.items : [];
  const metrics =
    t?.why?.metrics || [
      { value: "1000+", label: "Kurumsal Cozum" },
      { value: "30+", label: "Yillik Deneyim" },
      { value: "5", label: "Faaliyet Alani" },
      { value: "Adana", label: "Genel Merkez" },
    ];
  const highlights =
    t?.why?.highlights || [
      "Tek merkezden koordine edilen cok sektorlu hizmet modeli",
      "Ihtiyaca gore planlanan seffaf teklif ve surec yonetimi",
      "Saha operasyonlari, teslimat ve destek adimlarinda kurumsal takip",
    ];
  const description =
    t?.why?.description ||
    "Karaoglu Grup, cok sektorlu deneyimini guvenilir operasyon, net iletisim ve uzun vadeli is ortakligi anlayisi ile birlestirir.";

  return (
    <section className="relative isolate overflow-hidden bg-ink py-16 sm:py-20 lg:py-24">
      <img
        src={whyBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/98 via-ink/90 to-ink/52" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/96 via-petrol/26 to-black/28" />
      <div className="absolute inset-y-0 left-0 -z-10 w-[58%] bg-gradient-to-r from-ink via-ink/82 to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-ink/84 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-ink to-transparent" />

      <div className="section-shell relative z-10">
        <Reveal className="max-w-5xl">
          <div className="max-w-4xl rounded-2xl border border-white/14 bg-ink/76 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:p-8">
            <p className="eyebrow">{t?.why?.eyebrow}</p>
            <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-normal text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl">
              {t?.why?.title}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-platinum sm:text-lg">
              {description}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal delay={60} className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {metrics.map((metric) => (
                <div key={`${metric.value}-${metric.label}`} className="rounded-lg border border-white/14 bg-ink/62 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(185,101,50,0.10)] backdrop-blur-md">
                  <span className="block text-2xl font-black text-white sm:text-3xl">{metric.value}</span>
                  <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.14em] text-sun/90">{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-l border-sun/45 bg-ink/34 py-1 pl-4 backdrop-blur-sm">
              {highlights.map((highlight) => (
                <div key={highlight} className="flex gap-3 text-sm leading-6 text-platinum/90">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-sun/90" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item, index) => {
              const Icon = icons[index] || ShieldCheck;
              const title = typeof item === "string" ? item : item.title;
              const itemDescription = typeof item === "string" ? "" : item.description;
              return (
                <Reveal
                  key={title}
                  delay={index * 45}
                  className="rounded-lg border border-white/14 bg-ink/62 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
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
      </div>
    </section>
  );
}
