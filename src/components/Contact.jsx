import { formsEnabled } from '../utils/netlifyForms.js';
import { useState } from 'react';
import { useFormSubmission } from '../utils/useFormSubmission.js';
import { Field, ConsentField } from './FormField.jsx';
import { AlertCircle, CheckCircle2, MapPin, MessageCircle, Phone, Send, Store } from "lucide-react";
import { company } from "../data/company.js";
import { CONTACT_FORM_NAME, isValidEmail, isValidPhone } from "../utils/netlifyForms.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Contact({ t }) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const validate = (form) => {
    const nextErrors = {};
    ["name", "phone", "email", "service", "message"].forEach((field) => {
      if (!form.get(field)?.trim()) nextErrors[field] = t.common.required;
    });

    if (form.get("email")?.trim() && !isValidEmail(form.get("email"))) {
      nextErrors.email = t.common.emailError;
    }

    if (form.get("phone")?.trim() && !isValidPhone(form.get("phone"))) {
      nextErrors.phone = t.common.phoneError;
    }

    if (form.get("consent") !== "accepted") {
      nextErrors.consent = t.contact.form.consentError;
    }

    return nextErrors;
  };

  const { errors, status, handleSubmit, isSubmitting } = useFormSubmission(validate);

  return (
    <section id="iletisim" className="section-band contact-section">
      <div className="section-shell">
        <Reveal>
          <SectionHeading as="h1" align="left" eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description} />
        </Reveal>

        <div className="contact-layout mt-12">
          <Reveal className="contact-details">
            <div className="contact-details__intro">
              <p className="eyebrow">{company.name}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {company.city} / {company.district}
              </h3>
              <p className="mt-4 text-sm leading-7 text-platinum/80">
                {t.contact.corporateText}
              </p>
              <div className="mt-6 space-y-4">
                <ContactLine icon={Phone} label={t.contact.phone} value={company.phone} href={company.phoneHref} />
                <ContactLine icon={MessageCircle} label={t.contact.whatsapp} value={company.whatsapp} href={company.whatsappUrl} />
                <ContactLine icon={MapPin} label={t.contact.address} value={company.address} href={company.mapsUrl} />
                <ContactLine icon={Store} label={t.contact.sahibinden} value={t.common.sahibinden} href={company.sahibindenUrl} />
              </div>
            </div>

            <div className="contact-map overflow-hidden">
              {mapLoaded ? <iframe
                title={t.contact.mapTitle}
                className="h-72 w-full border-0 grayscale-[0.25] invert-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                src="https://www.google.com/maps?q=Karao%C4%9Flu%20Otomotiv%20Sanayi%20Sitesi%2046003.%20Sk.%20No%3A2%20Seyhan%20Adana&output=embed"
              /> : <button type="button" className="min-h-48 w-full p-6 text-sm font-semibold text-orange-200" onClick={() => setMapLoaded(true)}>{t.ui.mapLoad}</button>}
            </div>
          </Reveal>

          <Reveal delay={120} className="contact-form-panel p-5 sm:p-7">
            <h3 className="text-2xl font-semibold text-white">{t.contact.formTitle}</h3>
            {!formsEnabled && <p role="status" className="mt-3 text-sm leading-7 text-orange-200">{t.ui.formsUnavailable}</p>}
            <p className="mt-2 text-sm leading-7 text-steel">{t.contact.formIntro}</p>
            <form
              className="mt-6 grid gap-5"
              name={CONTACT_FORM_NAME}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              aria-busy={isSubmitting}
              noValidate
            >
              <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
              <input type="hidden" name="source" value="contact-page" />
              <p className="hidden" aria-hidden="true">
                <label>
                  Bot
                  <input name="bot-field" aria-label="Bot" tabIndex="-1" autoComplete="off" />
                </label>
              </p>
              <div className="grid min-w-0 gap-5 lg:grid-cols-2">
                <Field label={t.contact.form.name} error={errors.name}>
                  <input name="name" maxLength={120} required type="text" autoComplete="name" placeholder={t.contact.form.namePlaceholder} />
                </Field>
                <Field label={t.contact.form.phone} error={errors.phone}>
                  <input name="phone" maxLength={32} required type="tel" autoComplete="tel" placeholder={t.contact.form.phonePlaceholder} />
                </Field>
                <Field label={t.contact.form.email} error={errors.email}>
                  <input name="email" maxLength={254} required type="email" autoComplete="email" placeholder={t.contact.form.emailPlaceholder} />
                </Field>
                <Field label={t.contact.form.company}>
                  <input name="company" maxLength={160} type="text" autoComplete="organization" placeholder={t.contact.form.companyPlaceholder} />
                </Field>
              </div>
              <Field label={t.contact.form.service} error={errors.service}>
                <select name="service" required defaultValue="">
                  <option value="" disabled>
                    {t.contact.form.select}
                  </option>
                  {t.contact.form.services.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label={t.contact.form.message} error={errors.message}>
                <textarea name="message" required maxLength={5000} rows="5" placeholder={t.contact.form.messagePlaceholder} />
              </Field>
              <ConsentField label={t.contact.form.consentLabel} error={errors.consent} />
              <button className="btn-primary justify-center disabled:cursor-wait disabled:opacity-70" type="submit" disabled={isSubmitting || !formsEnabled}>
                {isSubmitting ? t.common.sending : t.common.submit}
                <Send size={17} />
              </button>
              {status === "success" ? (
                <p role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
                  <CheckCircle2 size={19} />
                  {t.contact.success}
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

function ContactLine({ icon: Icon, label, value, href }) {
  const external = href?.startsWith("http");
  return (
    <a
      className="contact-line flex gap-4 rounded-xl border border-white/10 bg-white/[0.032] p-4 transition hover:border-amber/20 hover:bg-white/[0.05]"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-sun/20 bg-sun/[0.10] text-sun">
        <Icon size={20} />
      </span>
      <span>
        <span className="block text-xs font-bold uppercase tracking-[0.08em] text-steel">{label}</span>
        <span className="mt-1 block text-sm font-semibold leading-6 text-white">{value}</span>
      </span>
    </a>
  );
}
