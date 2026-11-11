import { formsEnabled } from '../utils/netlifyForms.js';
import { useFormSubmission } from '../utils/useFormSubmission.js';
import { Field, ConsentField } from './FormField.jsx';
import { AlertCircle, BriefcaseBusiness, CheckCircle2, ClipboardCheck, Send, Upload, Users } from "lucide-react";
import { useState } from "react";
import { careerPositionIds } from "../data/careerPositions.js";
import {
  CAREER_FORM_NAME,
  cvValidationError,
  isValidEmail,
  isValidPhone,
} from "../utils/netlifyForms.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Career({ t }) {
  const [cvName, setCvName] = useState("");

  const validate = (form) => {
    const next = {};
    if (!form.get("name")?.trim()) next.name = t.common.required;
    if (!form.get("phone")?.trim()) next.phone = t.common.required;
    if (!form.get("email")?.trim()) next.email = t.common.required;
    if (!form.get("position")) next.position = t.common.required;
    if (!form.get("experience")) next.experience = t.common.required;
    if (form.get("email")?.trim() && !isValidEmail(form.get("email"))) next.email = t.common.emailError;
    if (form.get("phone")?.trim() && !isValidPhone(form.get("phone"))) next.phone = t.common.phoneError;
    if (form.get("consent") !== "accepted") next.consent = t.career.fields.consentError;

    const cvError = cvValidationError(form.get("cv"));
    if (cvError === 'required') next.cv = t.career.fields.cvRequired;
    else if (cvError === 'type') next.cv = t.career.fields.cvTypeError;
    else if (cvError === 'size') next.cv = t.career.fields.cvSizeError;

    return next;
  };

  const { errors, status, handleSubmit, isSubmitting } = useFormSubmission(validate, { multipart: true, onSuccess: () => setCvName("") });

  return (
    <section id="kariyer" className="section-band career-section">
      <div className="section-shell">
        <Reveal>
          <SectionHeading as="h1"
            align="left"
            eyebrow={t.career.eyebrow}
            title={t.career.title}
            description={`${t.career.subtitle}. ${t.career.text}`}
          />
        </Reveal>

        <div className="career-layout mt-12">
          <Reveal className="career-aside">
            <div className="career-intro">
              <span className="career-intro__icon" aria-hidden="true">
                <BriefcaseBusiness size={24} />
              </span>
              <p className="eyebrow">{t.career.whyTitle}</p>
              <div className="career-steps" role="group" aria-label={t.career.applicationStepsLabel}>
                {t.career.applicationSteps.map((step, index) => {
                  const icons = [Users, ClipboardCheck, Upload];
                  const Icon = icons[index] || ClipboardCheck;
                  return (
                    <div className="career-step" key={step.title}>
                      <span className="career-step__icon" aria-hidden="true">
                        <Icon size={17} />
                      </span>
                      <span>
                        <strong>{step.title}</strong>
                        <small>{step.description}</small>
                      </span>
                    </div>
                  );
                })}
              </div>
              {t.career.whyParagraphs.map((paragraph) => (
                <p key={paragraph} className="career-intro__paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="career-form-panel p-5 sm:p-7">
            <h3 className="text-2xl font-semibold text-white">{t.career.formTitle}</h3>
            {!formsEnabled && <p role="status" className="mt-3 text-sm leading-7 text-orange-200">{t.ui.formsUnavailable}</p>}
            <p className="mt-2 text-sm leading-7 text-steel">{t.career.formIntro}</p>
            <form
              className="mt-6 grid gap-5"
              name={CAREER_FORM_NAME}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              aria-busy={isSubmitting}
              noValidate
            >
              <input type="hidden" name="form-name" value={CAREER_FORM_NAME} />
              <p className="hidden" aria-hidden="true">
                <label>
                  Bot
                  <input name="bot-field" aria-label="Bot" tabIndex="-1" autoComplete="off" />
                </label>
              </p>
              <div className="grid min-w-0 gap-5 lg:grid-cols-2">
                <Field label={t.career.fields.name} error={errors.name}>
                  <input name="name" maxLength={120} required type="text" autoComplete="name" placeholder={t.career.placeholders.name} />
                </Field>
                <Field label={t.career.fields.phone} error={errors.phone}>
                  <input name="phone" maxLength={32} required type="tel" autoComplete="tel" placeholder={t.career.placeholders.phone} />
                </Field>
                <Field label={t.career.fields.email} error={errors.email}>
                  <input name="email" maxLength={254} required type="email" autoComplete="email" placeholder={t.career.placeholders.email} />
                </Field>
                <Field label={t.career.fields.position} error={errors.position}>
                  <select name="position" required defaultValue="">
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

              <Field label={t.career.fields.experience} error={errors.experience}>
                <select name="experience" required defaultValue="">
                  <option value="" disabled>
                    {t.career.placeholders.experience}
                  </option>
                  {t.career.experience.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>

              <Field label={t.career.fields.message}>
                <textarea name="message" maxLength={5000} rows="4" placeholder={t.career.placeholders.message} />
              </Field>

              <div className="career-cv-upload min-w-0 rounded-xl border border-dashed border-white/20 bg-white/[0.04] p-4 text-sm text-steel">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="text-amber" size={20} />
                    <label id="career-cv-label" htmlFor="career-cv" className="font-semibold text-white">{t.career.fields.cv}</label>
                  </div>
                  <span dir="auto" className="min-w-0 text-xs leading-5 text-platinum/70 [overflow-wrap:anywhere]">
                    {cvName || t.career.fields.cvPlaceholder}
                  </span>
                </div>
                <p id="career-cv-help" className="mt-3 text-xs leading-5 text-steel">{t.career.fields.cvHelp}</p>
                <input
                  type="file"
                  name="cv"
                  required
                  id="career-cv" aria-labelledby="career-cv-label" aria-describedby={errors.cv ? 'career-cv-help career-cv-error' : 'career-cv-help'} aria-invalid={!!errors.cv}
                  accept=".pdf,.doc,.docx"
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none file:cursor-pointer file:border-0 file:bg-amber/20 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                  onChange={(event) => setCvName(event.target.files?.[0]?.name || "")}
                />
                {errors.cv ? <small id="career-cv-error" className="mt-3 block text-sm font-semibold text-orange-200">{errors.cv}</small> : null}
              </div>

              <ConsentField label={t.career.fields.consentLabel} error={errors.consent} />

              <button className="btn-primary justify-center disabled:cursor-wait disabled:opacity-70" type="submit" disabled={isSubmitting || !formsEnabled}>
                {isSubmitting ? t.common.sending : t.career.fields.submit}
                <Send size={17} />
              </button>

              {status === "success" ? (
                <p role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
                  <CheckCircle2 size={19} />
                  {t.career.success}
                </p>
              ) : null}
              {status === "error" ? (
                <p role="alert" aria-live="assertive" className="flex items-start gap-3 rounded-xl border border-orange-300/25 bg-orange-300/10 px-4 py-3 text-sm font-semibold text-orange-100">
                  <AlertCircle size={19} />
                  {t.common.submitError}
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
