import { ArrowRight, Building2, Car, Fuel, Leaf, Store, Truck } from "lucide-react";
import { company } from "../data/company.js";
import { publishableReferences } from "../data/approvedReferences.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const iconMap = {
  automotive: Car,
  fleet: Truck,
  construction: Building2,
  petroleum: Fuel,
  agriculture: Leaf,
  operations: Truck,
};

export default function VehiclePortfolio({ t }) {
  const items = t?.portfolio?.items || [];
  const references = publishableReferences();

  return (
    <section id="portfoy" className="section-band bg-white/[0.025]">
      <div className="section-shell">
        <Reveal>
          <SectionHeading as="h1"
            align="center"
            eyebrow={t.portfolio.eyebrow}
            title={t.portfolio.title}
            description={t.portfolio.description}
          />
        </Reveal>

        {t.portfolio.notice ? (
          <Reveal delay={60} className="mx-auto mt-8 max-w-4xl rounded-xl border border-sun/20 bg-sun/[0.075] px-5 py-4 text-center shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:px-7">
            <p className="text-sm font-semibold leading-7 text-platinum/90 sm:text-base">
              {t.portfolio.notice}
            </p>
          </Reveal>
        ) : null}

        {references.length > 0 && (
          <section className="mt-12" aria-label={t.portfolio.approvedTitle}>
            <h2 className="text-center text-2xl font-semibold text-white">{t.portfolio.approvedTitle}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {references.map(reference => (
                <article key={reference.id} className="premium-card flex h-full flex-col gap-3 p-6">
                  {reference.logoSrc && <img src={reference.logoSrc} alt={reference.name}
                    width="160" height="64" className="h-16 max-w-full object-contain object-left" loading="lazy" decoding="async" />}
                  <h3 className="text-xl font-semibold text-white">{reference.name}</h3>
                  <p className="text-sm font-medium text-amber">{reference.sector?.[t.ui.locale] || ''}</p>
                  <p className="text-sm leading-7 text-steel">{reference.description?.[t.ui.locale] || ''}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.key] || Building2;
            const isAutomotive = item.key === "automotive";

            return (
              <Reveal key={item.key} delay={index * 55} className="premium-card flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-sun/25 bg-sun/[0.10] text-sun">
                    <Icon size={25} />
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-sun/40 to-transparent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-steel">{item.description}</p>

                {isAutomotive ? (
                  <a
                    className="btn-secondary mt-6 justify-center px-4 py-3 text-sm"
                    href={company.sahibindenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Store size={17} />
                    {item.action || t.portfolio.cta}
                    <ArrowRight size={16} />
                  </a>
                ) : null}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
