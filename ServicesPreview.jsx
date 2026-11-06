import { ArrowRight, Building2, Car, Fuel, KeyRound, Tractor } from "lucide-react";
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
  return (
    <section className="section-band bg-white/[0.025]">
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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {serviceDefinitions.map((service, index) => {
            const item = t.services.items[service.id];
            const Icon = iconMap[service.icon] || Building2;
            return (
              <Reveal key={service.id} delay={index * 55} className="premium-card p-5">
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
