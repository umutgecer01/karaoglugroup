import { ArrowRight, Building2, ShieldCheck, TrendingUp } from "lucide-react";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const previewIcons = [Building2, TrendingUp, ShieldCheck, Building2];

export default function CorporatePreview({ t, onNavigate }) {
  const c = t.corporate;

  return (
    <section className="section-band bg-white/[0.02]">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.intro} />
            <p className="mt-6 text-sm leading-7 text-steel sm:text-base sm:leading-8">{c.about ?? c.text}</p>
            <button className="btn-secondary mt-7" type="button" onClick={() => onNavigate?.("corporate")}>
              {t.common.details}
              <ArrowRight size={17} />
            </button>
          </Reveal>

          <Reveal delay={90}>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.stats.map(({ value, label }, index) => {
                const Icon = previewIcons[index] || ShieldCheck;
                return (
                  <div key={label} className="premium-card p-5">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-sun/20 bg-sun/[0.10] text-sun">
                      <Icon size={20} />
                    </span>
                    <p className="mt-5 text-3xl font-black text-white">{value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-steel">{label}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
