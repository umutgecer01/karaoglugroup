import ResponsiveImage from './ResponsiveImage.jsx';
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, Building2, Car, Fuel, KeyRound, Tractor } from "lucide-react";
import { getServiceGallery } from "../data/serviceGallery.js";
import { serviceDefinitions } from "../data/services.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const iconMap = {
  car: Car,
  key: KeyRound,
  building: Building2,
  fuel: Fuel,
  tractor: Tractor,
};

export default function ServicesPreview({ t, onNavigate }) {
  const showreelRef = useRef(null);
  useEffect(() => {
    const node = showreelRef.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.style.setProperty('--showreel-visibility', entry.isIntersecting ? 'running' : 'paused');
    }, { rootMargin: '150px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const showreelItems = useMemo(
    () =>
      serviceDefinitions.flatMap((service) => {
        const item = t.services.items[service.id];

        return getServiceGallery(service.id, item, 'preview').map((image, imageIndex) => ({
          ...image,
          id: `${service.id}-${image.src}-${imageIndex}`,
          serviceTitle: item?.title || image.label,
          label: image.label || item?.title || "",
          alt: image.alt || image.label || item?.title || t.services.galleryAltFallback,
        }));
      }),
    [t],
  );

  return (
    <section id="home-services" className="hologram-section section-band bg-white/[0.025]">
      <div className="section-shell">
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} description={t.services.description} />
            <button className="btn-secondary w-full justify-center sm:w-auto" type="button" onClick={() => onNavigate?.("services")}>
              {t.common.details}
              <ArrowRight size={17} />
            </button>
          </div>
        </Reveal>

        {showreelItems.length ? (
          <Reveal delay={120} className="mt-10">
            <div ref={showreelRef} className="service-showreel" aria-label={t.services.galleryTitle || t.services.eyebrow}>
              <div className="service-showreel__viewport" tabIndex={0} role="region" aria-label={t.services.galleryTitle}>
                <div
                  className="service-showreel__track"
                  style={{ "--showreel-duration": `${Math.max(44, showreelItems.length * 4)}s` }}
                >
                  {[0, 1].map((groupIndex) => (
                    <div
                      key={groupIndex}
                      className="service-showreel__group"
                      aria-hidden={groupIndex === 1 ? "true" : undefined}
                    >
                      {showreelItems.map((image) => (
                        <figure key={`${groupIndex}-${image.id}`} className="service-showreel__item">
                          <ResponsiveImage
                            src={image.src}
                            alt={groupIndex === 1 ? "" : image.alt}
                            className="service-showreel__image"
                            sizes="(min-width: 1024px) 400px, (min-width: 640px) 320px, 80vw"
                            width={image.width}
                            height={image.height}
                            position={image.position}
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                          />
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ) : null}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {serviceDefinitions.map((service, index) => {
            const item = t.services.items[service.id];
            const Icon = iconMap[service.icon] || Building2;
            const isBottomDesktopCard = index >= serviceDefinitions.length - 2;
            const isLastCard = index === serviceDefinitions.length - 1;
            const layoutClass = [
              isBottomDesktopCard ? "lg:col-span-3" : "lg:col-span-2",
              isLastCard ? "sm:col-span-2 lg:col-span-3" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Reveal key={service.id} delay={index * 55} className={`premium-card h-full p-5 ${layoutClass}`}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-sun/20 bg-sun/[0.10] text-sun">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-steel">{item.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
