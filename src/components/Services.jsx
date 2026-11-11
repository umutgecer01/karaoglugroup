import { ArrowLeft, ArrowRight, Building2, Car, Fuel, KeyRound, Store, Tractor } from 'lucide-react';
import { company } from '../data/company.js';
import { getServiceGallery } from '../data/serviceGallery.js';
import { serviceDefinitions } from '../data/services.js';
import { pagePath } from '../utils/routes.js';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import ResponsiveImage from './ResponsiveImage.jsx';

const icons = { car: Car, key: KeyRound, building: Building2, fuel: Fuel, tractor: Tractor };
export default function Services({ t, serviceId, onNavigate }) {
  const language = t === undefined ? 'tr' : t.ui.locale;
  const go = (event, view) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); onNavigate(view);
  };
  const active = serviceId && t.services.items[serviceId];
  if (active) return <section className="section-band"><div className="section-shell">
    <a className="inline-flex min-h-11 items-center gap-2 text-sm text-orange-200" href={pagePath('services', language)} onClick={event => go(event, 'services')}><ArrowLeft size={17} />{t.ui.backServices}</a>
    <SectionHeading as="h1" eyebrow={t.services.eyebrow} title={active.title} description={active.description} />
    <div className="mt-10 grid gap-10 lg:grid-cols-2">
      <div className="space-y-5 text-base leading-8 text-platinum/90">
        {(Array.isArray(active.detail) ? active.detail : [active.detail]).filter(Boolean).map(text => <p key={text}>{text}</p>)}
        <a className="btn-primary" href={pagePath('contact', language)} onClick={event => go(event, 'contact')}>{t.ui.contact}<ArrowRight size={17} /></a>
        {serviceId === 'automotive' && <a className="btn-secondary" href={company.sahibindenUrl} target="_blank" rel="noopener noreferrer"><Store size={17} />{t.portfolio.cta}</a>}
      </div>
      <div className="grid gap-4" role="group" aria-label={t.services.galleryTitle}>
        {getServiceGallery(serviceId, active).map((image, index) => <figure key={image.src} className="aspect-[4/3] overflow-hidden rounded border border-white/15 bg-black/10">
          <ResponsiveImage {...image} sizes="(min-width: 1024px) 550px, 100vw" className="h-full w-full object-cover" loading={index ? 'lazy' : 'eager'} fetchPriority={serviceId === 'agriculture' && index === 0 ? 'high' : undefined} />
        </figure>)}
      </div>
    </div>
  </div></section>;
  return <section id="faaliyetler" className="section-band"><div className="section-shell">
    <SectionHeading as="h1" eyebrow={t.services.eyebrow} title={t.services.title} description={t.services.description} align="center" />
    <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
      {serviceDefinitions.map((service, index) => {
        const item = t.services.items[service.id]; const Icon = icons[service.icon];
        return <Reveal key={service.id} className={`premium-card flex h-full flex-col p-6 ${index >= 3 ? 'xl:col-span-3' : 'xl:col-span-2'} ${index === 4 ? 'md:col-span-2' : ''}`}>
          <Icon size={28} className="text-sun" />
          <h2 className="mt-6 text-xl font-semibold">{item.title}</h2>
          <p className="mt-3 flex-1 text-sm leading-7 text-steel">{item.description}</p>
          <a className="btn-secondary mt-6 justify-center" href={pagePath(`service-${service.id}`, language)} onClick={event => go(event, `service-${service.id}`)}>{t.common.details}<span className="sr-only"> — {item.title}</span></a>
        </Reveal>;
      })}
    </div>
  </div></section>;
}
