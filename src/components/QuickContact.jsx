import { formsEnabled } from '../utils/netlifyForms.js';
import { useFormSubmission } from '../utils/useFormSubmission.js';
import { AlertCircle, CheckCircle2, MapPin, MessageCircle, Phone, Send, Store } from "lucide-react";
import { company } from "../data/company.js";
import { CONTACT_FORM_NAME, isValidEmail, isValidPhone } from "../utils/netlifyForms.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function QuickContact({ t }) {

  const validate = (form) => {
    const nextErrors = {};
    ["name", "phone", "email", "service"].forEach((field) => {
      if (!form.get(field)?.trim()) nextErrors[field] = t.common.required;
    });

    if (form.get("email")?.trim() && !isValidEmail(form.get("email"))) {
      nextErrors.email = t.common.emailError;
    }

    if (form.get("phone")?.trim() && !isValidPhone(form.get("phone"))) {
      nextErrors.phone = t.common.phoneError;
    }

    if (form.get("consent") !== "accepted") {
      nextErrors.consent = t.heroForm.consentError;
    }

    return nextErrors;
  };

  const { errors, status, handleSubmit, isSubmitting } = useFormSubmission(validate);

  return (
    <section className="quick-contact-section section-band">
      <div className="section-shell">
        <Reveal>
          <SectionHeading align="left" eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description} />
        </Reveal>

        <div className="quick-contact-layout mt-10">
          <Reveal className="quick-contact-links">
            <QuickLink icon={Phone} label={t.common.callNow} href={company.phoneHref} value={company.phone} />
            <QuickLink icon={MessageCircle} label={t.common.whatsappContact} href={company.whatsappUrl} value={company.whatsapp} external />
            <QuickLink icon={MapPin} label={t.common.directions} href={company.mapsUrl} value={`${company.city} / ${company.district}`} external />
            <QuickLink icon={Store} label={t.contact.sahibinden} href={company.sahibindenUrl} value={t.common.sahibinden} external />
          </Reveal>

          <Reveal delay={100} className="quick-contact-form p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-white">{t.heroForm.title}</h3>
            {!formsEnabled && <p role="status" className="mt-3 text-sm leading-7 text-orange-200">{t.ui.formsUnavailable}</p>}
            <p className="mt-2 text-sm leading-7 text-steel">{t.heroForm.subtitle}</p>
            <form
              className="mt-5 grid gap-4 sm:grid-cols-2"
              name={CONTACT_FORM_NAME}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              noValidate
            >
              <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
              <input type="hidden" name="source" value="quick-contact" />
              <p className="hidden" aria-hidden="true">
                <label>
                  Bot
                  <input name="bot-field" aria-label="Bot" tabIndex="-1" autoComplete="off" />
                </label>
              </p>
              <label className="form-field">
                <span>{t.heroForm.name}</span>
                <input name="name" maxLength={120} required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'quick-name-error' : undefined} type="text" autoComplete="name" placeholder={t.heroForm.namePlaceholder} />
                {errors.name ? <small id="quick-name-error" className="text-sm font-semibold text-orange-200">{errors.name}</small> : null}
              </label>
              <label className="form-field">
                <span>{t.heroForm.phone}</span>
                <input name="phone" maxLength={32} required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'quick-phone-error' : undefined} type="tel" autoComplete="tel" placeholder={t.heroForm.phonePlaceholder} />
                {errors.phone ? <small id="quick-phone-error" className="text-sm font-semibold text-orange-200">{errors.phone}</small> : null}
              </label>
              <label className="form-field sm:col-span-2">
                <span>{t.heroForm.email}</span>
                <input name="email" maxLength={254} required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'quick-email-error' : undefined} type="email" autoComplete="email" placeholder={t.heroForm.emailPlaceholder} />
                {errors.email ? <small id="quick-email-error" className="text-sm font-semibold text-orange-200">{errors.email}</small> : null}
              </label>
              <label className="form-field sm:col-span-2">
                <span>{t.heroForm.service}</span>
                <select name="service" aria-invalid={!!errors.service} aria-describedby={errors.service ? 'quick-service-error' : undefined} defaultValue="">
                  <option value="" disabled>{t.heroForm.servicePlaceholder}</option>
                  {t.heroForm.services.map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
                {errors.service ? <small id="quick-service-error" className="text-sm font-semibold text-orange-200">{errors.service}</small> : null}
              </label>
              <label className="form-field sm:col-span-2">
                <span>{t.heroForm.message}</span>
                <textarea name="message" maxLength={5000} rows="3" placeholder={t.heroForm.messagePlaceholder} />
              </label>
              <label className="form-consent sm:col-span-2">
                <input type="checkbox" name="consent" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'quick-consent-error' : undefined} value="accepted" />
                <span>{t.heroForm.consentLabel}</span>
                {errors.consent ? <small id="quick-consent-error">{errors.consent}</small> : null}
              </label>
              <button className="btn-primary justify-center disabled:cursor-wait disabled:opacity-70 sm:col-span-2" type="submit" disabled={isSubmitting || !formsEnabled}>
                {isSubmitting ? t.common.sending : t.heroForm.submit}
                <Send size={17} />
              </button>
              {status === "success" ? (
                <p role="status" className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 sm:col-span-2">
                  <CheckCircle2 size={19} />
                  {t.heroForm.success}
                </p>
              ) : null}
              {status === "error" ? (
                <p role="alert" className="flex items-start gap-3 rounded-xl border border-orange-300/25 bg-orange-300/10 px-4 py-3 text-sm font-semibold text-orange-100 sm:col-span-2">
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

function QuickLink({ icon: Icon, label, value, href, external = false }) {
  return (
    <a
      className="quick-contact-link"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span className="quick-contact-link__icon">
        <Icon size={22} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-steel">{value}</span>
      </span>
    </a>
  );
}
