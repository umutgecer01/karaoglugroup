import { getServiceGallery } from '../data/serviceGallery.js';
import ResponsiveImage from './ResponsiveImage.jsx';
import { ArrowRight, Award, BriefcaseBusiness, FileText, Layers, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { company } from "../data/company.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const icons = [BriefcaseBusiness, Award, FileText, Layers, Truck];
const rentalShowcaseVideo = "/videos/fleet-rental-showcase.mp4";
function RentalShowcaseVideo({ t }) {
  const videoRef = useRef(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = videoRef.current;
    if (!node || !loadVideo) return;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) node.pause(); });
    observer.observe(node);
    const visibility = () => { if (document.hidden) node.pause(); };
    document.addEventListener('visibilitychange', visibility);
    node.play().catch(() => {});
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [loadVideo]);
  return <div className="relative">
    <video ref={videoRef} className="aspect-[1280/568] w-full object-cover" width="1280" height="568" controls={loadVideo} playsInline preload="none" poster="/images/fleet-rental-video-poster-1280.webp" aria-label={t.ui.video} onError={() => setFailed(true)}>
      {loadVideo && <source src={rentalShowcaseVideo} type="video/mp4" />}
    </video>
    {!loadVideo && <button type="button" className="absolute inset-0 grid place-items-center bg-black/20" onClick={() => setLoadVideo(true)}><span className="btn-primary">{t.ui.playVideo}</span></button>}
    {failed && <p role="alert" className="p-3 text-sm">{t.ui.videoError}</p>}
  </div>;
}

export default function RentalSection({ t }) {
  const rentalImages = getServiceGallery("rental", t.services.items.rental);
  return (
    <section id="kiralama" className="section-band bg-white/[0.025]">
      <div className="section-shell">
        <div className="rental-panel grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <Reveal className="lg:col-span-2">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <SectionHeading as="h1" eyebrow={t.rental.eyebrow} title={t.rental.title} description={t.rental.text} />
              <div className="lg:max-w-xs">
                <div>
                  <a className="btn-primary w-full justify-center sm:w-auto" href={company.whatsappUrl} target="_blank" rel="noopener noreferrer">
                    {t.rental.button}
                    <ArrowRight size={18} />
                  </a>
                </div>
            <p className="mt-5 text-xs font-medium uppercase leading-6 tracking-[0.08em] text-white/55">
              {t.rental.note}
            </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2">
            <div className="grid gap-3 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="relative overflow-hidden rounded-xl border border-white/12 bg-ink/45 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                <RentalShowcaseVideo t={t} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/34 via-transparent to-ink/10" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {rentalImages.slice(1).map((image) => (
                  <figure key={image.src} className="relative overflow-hidden rounded-xl border border-white/12 bg-ink/45 shadow-[0_18px_46px_rgba(0,0,0,0.22)]">
                    <ResponsiveImage
                      className="aspect-[1200/449] h-full w-full object-cover opacity-95 lg:aspect-[1200/437]"
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <figcaption className="sr-only">{image.alt}</figcaption>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/24 via-transparent to-transparent" />
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-6">
            {t.rental.cards.map((card, index) => {
              const Icon = icons[index] || BriefcaseBusiness;
              const title = typeof card === "string" ? card : card.title;
              const desc = typeof card === "string" ? t.rental.text : card.desc;
              const isBottomDesktopCard = index >= t.rental.cards.length - 2;
              const isLastCard = index === t.rental.cards.length - 1;
              const layoutClass = [
                isBottomDesktopCard ? "xl:col-span-3" : "xl:col-span-2",
                isLastCard ? "sm:col-span-2 xl:col-span-3" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <Reveal key={title} delay={index * 60} className={`glass-card h-full p-5 ${layoutClass}`}>
                  <span className="grid h-12 w-12 place-items-center rounded-lg border border-sun/20 bg-sun/[0.10] text-sun">
                    <Icon size={23} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-steel">{desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
