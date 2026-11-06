import { useState } from "react";
import { Building2, Car, Fuel, KeyRound, Truck, Tractor, X } from "lucide-react";
import { serviceDefinitions } from "../data/services.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const iconMap = {
  car: Car,
  key: KeyRound,
  truck: Truck,
  building: Building2,
  fuel: Fuel,
  tractor: Tractor,
};

export default function Services({ t }) {
  const [activeId, setActiveId] = useState(null);
  const active = activeId ? t.services.items[activeId] : null;

  return (
    <section id="faaliyetler" className="section-band bg-white/[0.025]">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow={t.services.eyebrow}
            title={t.services.title}
            description={t.services.description}
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {serviceDefinitions.map((service, index) => {
            const item = t.services.items[service.id];
            const Icon = iconMap[service.icon] || Building2;
            return (
              <Reveal key={service.id} delay={index * 55} className="premium-card group p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-amber/20 bg-amber/[0.08] text-amber transition duration-300 group-hover:-translate-y-1 group-hover:bg-amber/[0.12]">
                    <Icon size={25} />
                  </span>
                  <span className="mt-4 h-px flex-1 bg-gradient-to-r from-amber/30 to-transparent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 min-h-[82px] text-sm leading-7 text-steel">{item.description}</p>
                <button
                  className="btn-secondary mt-6 w-full justify-center px-4 py-3 text-sm"
                  type="button"
                  onClick={() => setActiveId(service.id)}
                >
                  {t.common.details}
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {active ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/15 bg-[#1b5b86]/95 p-6 shadow-premium">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow">{t.services.modalTitle}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{active.title}</h3>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                onClick={() => setActiveId(null)}
                aria-label={t.services.close}
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-5 text-base leading-8 text-steel">{active.detail}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
