import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Process({ t }) {
  return (
    <section className="hologram-section section-band">
      <div className="section-shell">
        <Reveal>
          <SectionHeading align="center" eyebrow={t.process.eyebrow} title={t.process.title} />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.process.steps.map((step, index) => (
            <Reveal key={step} delay={index * 70} className="premium-card relative overflow-hidden p-6">
              <span className="text-sm font-bold text-sun">0{index + 1}</span>
              <h3 className="mt-5 min-h-[56px] text-xl font-semibold leading-7 text-white">{step}</h3>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-sun/55 to-transparent" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
