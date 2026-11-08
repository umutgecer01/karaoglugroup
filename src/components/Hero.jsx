import ResponsiveImage from './ResponsiveImage.jsx';
import { ArrowRight, MapPin } from "lucide-react";
import { company } from "../data/company.js";
import Reveal from "./Reveal.jsx";

export default function Hero({ t, onNavigate }) {
  return (
    <section id="home" className="hero-section section-band relative isolate overflow-hidden">
      <div className="section-shell relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-orange-200 sm:text-2xl">
              {t.hero.subtitle}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-platinum/80 sm:text-lg">
              {t.hero.description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button className="btn-primary" onClick={() => onNavigate?.("corporate")}>
                {t.hero.aboutButton}
                <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => onNavigate?.("contact")}>
                {t.hero.contactButton}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-platinum/65">
              <MapPin size={16} className="text-sun" />
              {company.city} / {company.district}
            </div>
          </Reveal>

          <div className="hero-image-frame">
            <ResponsiveImage
              src="/images/automotive-gallery-1.jpg"
              alt={t.ui.heroAlt}
              sizes="(min-width: 1024px) 550px, calc(100vw - 32px)"
              width="960"
              height="540"
              fetchPriority="high"
              decoding="sync"
            />
            <div className="hero-image-caption">
              <span className="eyebrow">Karaoğlu Group</span>
              <span>{t.ui.heroCaption}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
