// Homepage fleet feature. Uses the already-shipped fleet image and existing translations.
import { ArrowRight } from 'lucide-react';
import { pagePath } from '../utils/routes.js';
import ResponsiveImage from './ResponsiveImage.jsx';

export default function HomeFleetFeature({ t, onNavigate }) {
  const language = t?.ui?.locale || 'tr';
  const handleClick = event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate('rental');
  };
  return (
    <section className="section-band bg-white/[0.025]" aria-label={t.rental.title}>
      <div className="section-shell">
        <div className="grid items-center gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="eyebrow">{t.rental.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {t.rental.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-platinum/85">
              {t.rental.text}
            </p>
            <a
              href={pagePath('rental', language)}
              onClick={handleClick}
              className="btn-secondary mt-7 inline-flex items-center gap-2"
            >
              {t.common.details}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <figure className="overflow-hidden rounded-xl border border-white/15 bg-black/15">
            <ResponsiveImage
              src="/images/fleet-rental-city-fleet.png"
              alt={t.ui.fleetImageAlt}
              width={1024}
              height={768}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="aspect-[4/3] h-full w-full object-contain object-center"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
