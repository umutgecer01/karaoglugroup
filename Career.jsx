import { CheckCircle2, Upload } from "lucide-react";
import { useState } from "react";
import { careerPositionIds } from "../data/careerPositions.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Career({ t }) {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [cvName, setCvName] = useState("");

  const validate = (form) => {
    const next = {};
    if (!form.get("name")?.trim()) next.name = t.common.required;
    if (!form.get("phone")?.trim()) next.phone = t.common.required;
    if (!form.get("position")) next.position = t.common.required;
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSuccess(false);
    if (Object.keys(nextErrors).length) return;
    event.currentTarget.reset();
    setCvName("");
    setSuccess(true);
  };

  return (
    <section id="kariyer" className="section-band">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t.career.eyebrow}
            title={t.career.title}
            description={`${t.career.subtitle}. ${t.career.text}`}
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="premium-card p-6 space-y-5">
              <p className="eyebrow">{t.career.whyTitle}</p>
              {t.career.whyParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-white/80">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="premium-card p-5 sm:p-6">
            <h3 className="text-2xl font-semibold text-white">{t.career.formTitle}</h3>
            <form className="mt-6 grid gap-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.career.fields.name} error={errors.name}>
                  <input name="name" type="text" autoComplete="name" placeholder={t.career.placeholders.name} />
                </Field>
                <Field label={t.career.fields.phone} error={errors.phone}>
                  <input name="phone" type="tel" autoComplete="tel" placeholder={t.career.placeholders.phone} />
                </Field>
                <Field label={t.career.fields.email}>
                  <input name="email" type="email" autoComplete="email" placeholder={t.career.placeholders.email} />
                </Field>
                <Field label={t.career.fields.position} error={errors.position}>
                  <select name="position" defaultValue="">
                    <option value="" disabled>
                      {t.career.placeholders.position}
                    </option>
                    {careerPositionIds.map((id) => (
                      <option value={id} key={id}>
                        {t.career.positions[id]}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label={t.career.fields.experience}>
                <select name="experience" defaultValue="">
                  <option value="" disabled>
                    {t.career.placeholders.experience}
                  </option>
                  {t.career.experience.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>

              <Field label={t.career.fields.message}>
                <textarea name="message" rows="4" placeholder={t.career.placeholders.message} />
              </Field>

              <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.04] p-4 text-sm text-steel">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="text-amber" size={20} />
                    <span className="font-semibold text-white">{t.career.fields.cv}</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-platinum/70">
                    {cvName || t.career.fields.cvPlaceholder}
                  </span>
                </div>
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none file:cursor-pointer file:border-0 file:bg-amber/20 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                  onChange={(event) => setCvName(event.target.files?.[0]?.name || "")}
                />
              </div>

              <button className="btn-primary justify-center" type="submit">
                {t.career.fields.submit}
              </button>

              {success ? (
                <p className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
                  <CheckCircle2 size={19} />
                  {t.career.success}
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error ? <small className="text-sm font-semibold text-orange-200">{error}</small> : null}
    </label>
  );
}
