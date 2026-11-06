import { ArrowRight, Flag, ShieldCheck, TrendingUp } from "lucide-react";
import ChairmanMessage from "./ChairmanMessage.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Corporate({ t, onNavigate }) {
  const c = t.corporate;

  return (
    <section id="kurumsal" className="section-band bg-white/[0.025]">
      <div className="section-shell">
        <div id="hakkimizda">
          <Reveal>
            <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.intro} />
          </Reveal>
        </div>

        {/* İstatistikler */}
        {c.stats && (
          <Reveal delay={60}>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {c.stats.map(({ value, label }) => (
                <div key={label} className="glass-card p-5 text-center">
                  <p className="text-3xl font-black text-gold">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Hakkımızda paragrafı */}
        <Reveal delay={80}>
          <p className="mt-12 max-w-4xl text-base leading-8 text-steel sm:text-lg">{c.about ?? c.text}</p>
        </Reveal>

        <div id="kurucumuz" className="mt-12">
          <Reveal delay={90}>
            <div className="premium-card p-7 sm:p-8">
              <p className="eyebrow">{c.founderEyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{c.founderTitle}</h3>
              <p className="mt-4 text-sm leading-8 text-steel sm:text-base">{c.founderText}</p>
            </div>
          </Reveal>
        </div>

        <ChairmanMessage t={t} />

        {/* Misyon / Vizyon / Değerler */}
        <div id="degerlerimiz" className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal delay={100}>
            <div className="premium-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber/[0.12]">
                <Flag size={20} className="text-amber" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{c.missionTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-steel">{c.mission}</p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="premium-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber/[0.12]">
                <TrendingUp size={20} className="text-amber" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{c.visionTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-steel">{c.vision}</p>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="premium-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber/[0.12]">
                <ShieldCheck size={20} className="text-amber" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{c.valuesTitle}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.values.map((v) => (
                  <span key={v} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-1.5 text-xs font-semibold text-white/80">
                    {v}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-steel">
                {c.valuesDescription}
              </p>
            </div>
          </Reveal>
        </div>

        <div id="insan-kaynaklari" className="mt-12">
          <Reveal delay={260}>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.048] to-white/[0.026] p-6 shadow-premium sm:p-7">
              <p className="eyebrow">{c.hrEyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{c.hrTitle}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-steel sm:text-base">{c.hrText}</p>
              <button className="btn-secondary mt-5" onClick={() => onNavigate?.("career")}>
                {c.hrButton}
                <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
