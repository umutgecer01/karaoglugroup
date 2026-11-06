import Reveal from "./Reveal.jsx";

export default function ChairmanMessage({ t, compact = false, onOpen }) {
  const m = t?.chairmanMessage;
  if (!m) return null;

  if (compact) {
    return (
      <section className="section-band bg-white/[0.025]">
        <div className="section-shell">
          <Reveal>
            <div className="max-w-4xl">
              <p className="eyebrow">{m.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{m.title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-platinum/85 sm:text-base sm:leading-8">
                {m.preview}
              </p>
              <button className="btn-primary mt-5" onClick={onOpen}>
                {m.openButton}
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="baskan-mesaji" className="section-band bg-white/[0.02]">
      <div className="section-shell">
        <Reveal>
          <div className="max-w-5xl">
            <p className="eyebrow">{m.eyebrow}</p>
            <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl lg:text-3xl">{m.title}</h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-platinum/85 sm:text-base sm:leading-8">
              {m.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-base font-semibold text-white sm:text-lg">{m.signatureName}</p>
              <p className="text-xs text-steel sm:text-sm">{m.signatureTitle}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
