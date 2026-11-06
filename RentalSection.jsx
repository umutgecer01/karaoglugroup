import { ArrowRight, Award, BriefcaseBusiness, FileText, Layers, Truck } from "lucide-react";
import { company } from "../data/company.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const icons = [BriefcaseBusiness, Award, FileText, Layers, Truck];
const rentalVideo = "/videos/filo-kiralama.mp4?v=enhanced";

export default function RentalSection({ t }) {
  return (
    <section id="kiralama" className="section-band bg-white/[0.025]">
      <div className="section-shell">
        <div className="rental-panel grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <Reveal className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-xl border border-white/12 bg-ink/45 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <video
                className="pointer-events-none aspect-[79/35] w-full bg-ink object-cover opacity-95"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-hidden="true"
                tabIndex={-1}
              >
                <source src={rentalVideo} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/46 via-transparent to-ink/18" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sun/45 to-transparent" />
            </div>
          </Reveal>

          <Reveal>
            <SectionHeading eyebrow={t.rental.eyebrow} title={t.rental.title} description={t.rental.text} />
            <div className="mt-8">
              <a className="btn-primary" href={company.whatsappUrl} target="_blank" rel="noreferrer">
                {t.rental.button}
                <ArrowRight size={18} />
              </a>
            </div>
            <p className="mt-8 text-xs leading-6 tracking-wide text-white/40 uppercase">
              {t.rental.note || "Bireysel kiralama hizmeti verilmemektedir. Yalnızca kurum ve kuruluşlara hizmet sunulmaktadır."}
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {t.rental.cards.map((card, index) => {
              const Icon = icons[index] || BriefcaseBusiness;
              const title = typeof card === "string" ? card : card.title;
              const desc = typeof card === "string" ? t.rental.text : card.desc;
              return (
                <Reveal key={title} delay={index * 60} className="glass-card p-5">
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
