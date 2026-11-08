import { ArrowRight, Building2, ShieldCheck, TrendingUp } from "lucide-react";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const previewIcons = [Building2, TrendingUp, ShieldCheck, Building2];

export default function CorporatePreview({ t, onNavigate }) {
  const c = t.corporate;

  return (
    <section className="section-band bg-white/[0.02]">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow={c.previewEyebrow || c.eyebrow}
              title={c.previewTitle || c.title}
              description={c.previewDescription || c.intro}
            />
            <p className="mt-6 max-w-2xl text-sm leading-7 text-steel sm:text-base sm:leading-8">
              {c.previewText || c.about || c.text}
            </p>
            <button className="btn-secondary mt-7" type="button" onClick={() => onNavigate?.("corporate")}>
              {t.common.details}
              <ArrowRight size={17} />
            </button>
          </Reveal>

          <Reveal delay={90}>
            <div className="corporate-overview-list divide-y divide-white/10 border-y border-white/10">
              {c.stats.map(({ value, label }, index) => {
                const Icon = previewIcons[index] || ShieldCheck;
                return (
                  <div key={label} className="flex items-center gap-4 py-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center text-sun">
                      <Icon size={20} />
                    </span>
                    <p className="min-w-0 text-sm text-steel sm:text-base">
                      <strong className="mr-2 text-xl font-semibold text-white">{value}</strong>
                      {label}
                    </p>
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
