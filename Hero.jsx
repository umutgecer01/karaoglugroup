import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal.jsx";

export default function Hero({ t, onNavigate }) {
  return (
    <section id="home" className="section-band relative isolate overflow-hidden bg-white/[0.025]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sun/[0.12] via-amber/[0.14] to-transparent" />

      <div className="section-shell relative z-10">
        <Reveal>
          <div className="premium-card p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight tracking-normal text-white sm:text-3xl lg:text-4xl">
              {t.hero.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-snug text-amber sm:text-lg lg:text-xl">
              {t.hero.subtitle}
            </p>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-steel sm:text-base sm:leading-8">
              {t.hero.description}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button className="btn-primary" onClick={() => onNavigate?.("corporate")}>
                {t.hero.aboutButton}
                <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => onNavigate?.("services")}>
                {t.hero.servicesButton}
              </button>
              <button className="btn-ghost" onClick={() => onNavigate?.("contact")}>
                {t.hero.contactButton}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
