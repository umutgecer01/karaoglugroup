import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Flag,
  Handshake,
  Layers3,
  Network,
  Route,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import ChairmanMessage from "./ChairmanMessage.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const managementIcons = [Building2, ClipboardCheck, Network, Handshake];
const standardIcons = [Route, ClipboardCheck, Users, ShieldCheck];
const capabilityIcons = [Layers3, Building2, TrendingUp, Network, Handshake];
const corporateSectionIcons = [Building2, Network, Handshake, ShieldCheck, Users];

function IconBadge({ icon: Icon }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber/[0.12] text-amber">
      <Icon size={20} />
    </span>
  );
}

function ExpandableParagraphs({ paragraphs, label, closeLabel, className = "" }) {
  if (!paragraphs.length) return null;

  return (
    <div className={className}>
      <p>{paragraphs[0]}</p>
      {paragraphs.length > 1 ? (
        <details className="group mt-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-amber transition hover:text-white">
            <span className="group-open:hidden">{label}</span>
            <span className="hidden group-open:inline">{closeLabel}</span>
          </summary>
          <div className="mt-4 space-y-4">
            {paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

export default function Corporate({ t, onNavigate, focus = "all" }) {
  const c = t.corporate;
  const profileParagraphs = c.profileParagraphs || [];
  const aboutParagraphs = c.aboutParagraphs || [];
  const managementCards = c.managementCards || [];
  const operationalStandards = c.operationalStandards || [];
  const sectorCapabilities = c.sectorCapabilities || [];
  const commitments = c.commitments || [];
  const hrPoints = c.hrPoints || [];
  const overviewPillars = c.overviewPillars || [];
  const showAll = focus === "all";
  const showAbout = focus === "about";
  const showStructure = focus === "structure";
  const showChairman = focus === "chairman";
  const showValues = focus === "values";
  const showHr = focus === "hr";

  const hasProfile = profileParagraphs.length > 0 || managementCards.length > 0;

  return (
    <section id="kurumsal" className="section-band bg-white/[0.025]">
      <div className="section-shell">
        {showAll ? (
          <Reveal>
            <SectionHeading as="h1" eyebrow={c.eyebrow} title={c.title} description={c.intro} />
          </Reveal>
        ) : c.subpageHeaders?.[focus] ? (
          <Reveal>
            <SectionHeading as="h1"
              eyebrow={c.subpageHeaders[focus].eyebrow}
              title={c.subpageHeaders[focus].title}
              description={c.subpageHeaders[focus].description}
            />
          </Reveal>
        ) : null}

        {showAll ? (
          <Reveal delay={70}>
            <div className="corporate-overview mt-10 border-y border-white/10 py-8 lg:py-10">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div>
                <p className="eyebrow">{c.overviewEyebrow}</p>
                <h3 className="mt-3 max-w-2xl text-2xl font-semibold text-white sm:text-3xl">{c.overviewTitle}</h3>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-steel sm:text-base">{c.overviewText}</p>
              </div>
              <div className="lg:border-s lg:border-white/10 lg:ps-10">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/55">{c.overviewListTitle}</p>
                <ul className="mt-5 space-y-4">
                  {(commitments.length > 0 ? commitments.slice(0, 4) : [c.about ?? c.text]).map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-platinum/85 sm:text-base">
                      <CheckCircle2 className="mt-1 shrink-0 text-amber" size={18} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              </div>

              {overviewPillars.length > 0 ? (
                <div className="mt-10 grid gap-0 border-t border-white/10 md:grid-cols-3">
                  {overviewPillars.map((pillar, index) => (
                    <div key={pillar.title} className={`py-6 md:px-6 ${index > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : "md:ps-0"}`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber">{pillar.eyebrow}</p>
                      <h4 className="mt-3 text-lg font-semibold text-white">{pillar.title}</h4>
                      <p className="mt-3 line-clamp-4 text-sm leading-7 text-steel">{pillar.text}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        ) : null}

        {showAll ? (
          <Reveal delay={120}>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {["about", "structure", "chairman", "values", "hr"].map((key, index) => {
                const item = c.subpageHeaders?.[key];
                if (!item) return null;
                const Icon = corporateSectionIcons[index] || Building2;
                const positionClass = index === 3 ? "lg:col-start-2" : index === 4 ? "lg:col-start-4" : "";

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onNavigate?.(`corporate-${key}`)}
                    className={`group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-6 text-start shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:border-amber/40 hover:from-amber/[0.12] hover:to-white/[0.04] lg:col-span-2 ${positionClass}`}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl border border-amber/20 bg-amber/[0.10] text-amber">
                        <Icon size={20} />
                      </span>
                      <span className="text-3xl font-semibold text-white/10">0{index + 1}</span>
                    </span>
                    <span className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-amber">{item.eyebrow}</span>
                    <h3 className="mt-3 text-lg font-semibold leading-7 text-white">{item.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-steel">{item.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white/75 transition group-hover:text-amber">
                      {t.common.details}
                      <ArrowRight size={16} />
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        ) : null}

        {showAbout && c.stats ? (
          <Reveal delay={60}>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {c.stats.map(({ value, label }) => (
                <div key={label} className="glass-card min-w-0 p-5 text-center">
                  <p className="text-3xl font-bold text-gold">{value}</p>
                  <p className="mt-1 min-w-0 break-words text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.04em] text-white/60 sm:text-xs sm:tracking-[0.08em]">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}

        {showAbout ? (
          <Reveal delay={80}>
            <ExpandableParagraphs
              paragraphs={aboutParagraphs.length > 0 ? aboutParagraphs : [c.about ?? c.text]}
              label={t.common.readMore || "Devamını oku"}
              closeLabel={t.common.readLess || "Kapat"}
              className="mt-12 max-w-4xl text-base leading-8 text-steel sm:text-lg"
            />
          </Reveal>
        ) : null}

        {showStructure && hasProfile ? (
          <div id="kurumsal-yapi" className="mt-14 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            {profileParagraphs.length > 0 ? (
              <Reveal delay={100}>
                <div className="max-w-4xl">
                  {c.profileEyebrow ? <p className="eyebrow">{c.profileEyebrow}</p> : null}
                  {c.profileTitle ? <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{c.profileTitle}</h3> : null}
                  <ExpandableParagraphs
                    paragraphs={profileParagraphs}
                    label={t.common.readMore || "Devamını oku"}
                    closeLabel={t.common.readLess || "Kapat"}
                    className="mt-5 text-sm leading-7 text-platinum/85 sm:text-base sm:leading-8"
                  />
                </div>
              </Reveal>
            ) : null}

            {managementCards.length > 0 ? (
              <Reveal delay={150}>
                <div>
                  {c.managementTitle ? <h3 className="text-lg font-semibold text-white">{c.managementTitle}</h3> : null}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {managementCards.map((item, index) => {
                      const Icon = managementIcons[index] || ShieldCheck;

                      return (
                        <div key={item.title} className="premium-card p-5">
                          <IconBadge icon={Icon} />
                          <h4 className="mt-4 text-base font-semibold text-white">{item.title}</h4>
                          <p className="mt-2 text-sm leading-7 text-steel">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ) : null}
          </div>
        ) : null}

        {showStructure && operationalStandards.length > 0 ? (
          <div className="mt-14">
            <Reveal delay={120}>
              <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                <div>
                  {c.operationalStandardsEyebrow ? <p className="eyebrow">{c.operationalStandardsEyebrow}</p> : null}
                  {c.operationalStandardsTitle ? (
                    <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{c.operationalStandardsTitle}</h3>
                  ) : null}
                </div>
                {c.operationalStandardsText ? (
                  <p className="text-sm leading-7 text-steel sm:text-base sm:leading-8">{c.operationalStandardsText}</p>
                ) : null}
              </div>
            </Reveal>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {operationalStandards.map((item, index) => {
                const Icon = standardIcons[index] || CheckCircle2;

                return (
                  <Reveal key={item.title} delay={140 + index * 45}>
                    <div className="glass-card h-full p-5">
                      <IconBadge icon={Icon} />
                      <h4 className="mt-4 text-base font-semibold text-white">{item.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-steel">{item.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ) : null}

        {showChairman ? <ChairmanMessage t={t} /> : null}

        {showStructure && sectorCapabilities.length > 0 ? (
          <div className="mt-14">
            <Reveal delay={110}>
              <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
                <div>
                  {c.sectorDepthEyebrow ? <p className="eyebrow">{c.sectorDepthEyebrow}</p> : null}
                  {c.sectorDepthTitle ? <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{c.sectorDepthTitle}</h3> : null}
                </div>
                {c.sectorDepthText ? (
                  <p className="text-sm leading-7 text-steel sm:text-base sm:leading-8">{c.sectorDepthText}</p>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                {sectorCapabilities.map((item, index) => {
                  const Icon = capabilityIcons[index] || CheckCircle2;
                  const spanClass = index < 3 ? "lg:col-span-4" : "lg:col-span-6";

                  return (
                    <div key={item.title} className={`premium-card flex h-full min-h-[210px] flex-col p-6 sm:p-7 ${spanClass}`}>
                      <div className="flex items-start gap-4">
                        <IconBadge icon={Icon} />
                        <h4 className="min-w-0 pt-2 text-base font-semibold leading-6 text-white sm:text-lg">{item.title}</h4>
                      </div>
                      <p className="mt-5 text-sm leading-7 text-steel">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        ) : null}

        {showValues ? <div id="degerlerimiz" className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal delay={100}>
            <div className="premium-card h-full p-7">
              <IconBadge icon={Flag} />
              <h3 className="mt-5 text-lg font-semibold text-white">{c.missionTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-steel">{c.mission}</p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="premium-card h-full p-7">
              <IconBadge icon={TrendingUp} />
              <h3 className="mt-5 text-lg font-semibold text-white">{c.visionTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-steel">{c.vision}</p>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="premium-card h-full p-7">
              <IconBadge icon={ShieldCheck} />
              <h3 className="mt-5 text-lg font-semibold text-white">{c.valuesTitle}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.values.map((v) => (
                  <span key={v} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-1.5 text-xs font-semibold text-white/80">
                    {v}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-steel">{c.valuesDescription}</p>
            </div>
          </Reveal>
        </div> : null}

        {showValues && commitments.length > 0 ? (
          <div className="mt-12">
            <Reveal delay={240}>
              <div className="corporate-panel rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.052] to-white/[0.026] p-6 shadow-premium sm:p-7">
                <div className="grid gap-7 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
                  <div>
                    {c.commitmentEyebrow ? <p className="eyebrow">{c.commitmentEyebrow}</p> : null}
                    {c.commitmentTitle ? <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">{c.commitmentTitle}</h3> : null}
                    {c.commitmentText ? <p className="mt-4 text-sm leading-7 text-steel sm:text-base sm:leading-8">{c.commitmentText}</p> : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {commitments.map((item) => (
                      <div key={item} className="flex gap-3 border-b border-white/10 pb-3 text-sm leading-6 text-platinum/85 last:border-b-0 sm:border-b-0 sm:pb-0">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-amber" size={18} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        ) : null}

        {showHr ? <div id="insan-kaynaklari" className="mt-12">
          <Reveal delay={260}>
            <div className="corporate-panel rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.048] to-white/[0.026] p-6 shadow-premium sm:p-7">
              <p className="eyebrow">{c.hrEyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{c.hrTitle}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-steel sm:text-base">{c.hrText}</p>
              {c.hrDetail ? <p className="mt-3 max-w-3xl text-sm leading-7 text-steel sm:text-base">{c.hrDetail}</p> : null}
              {hrPoints.length > 0 ? (
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-platinum/85 sm:grid-cols-2">
                  {hrPoints.map((point) => (
                    <li key={point} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-amber" size={17} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <button className="btn-secondary mt-5" onClick={() => onNavigate?.("career")}>
                {c.hrButton}
                <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        </div> : null}
      </div>
    </section>
  );
}
