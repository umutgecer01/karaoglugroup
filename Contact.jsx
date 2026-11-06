import { CheckCircle2, MapPin, MessageCircle, Phone, Send, Store } from "lucide-react";
import { useState } from "react";
import { company } from "../data/company.js";
import PhoneModal from "./PhoneModal.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Contact({ t }) {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors = {};
    ["name", "phone", "service", "message"].forEach((field) => {
      if (!form.get(field)?.trim()) nextErrors[field] = t.common.required;
    });
    setErrors(nextErrors);
    setSuccess(false);
    if (Object.keys(nextErrors).length) return;
    event.currentTarget.reset();
    setSuccess(true);
  };

  return (
    <section id="iletisim" className="section-band bg-white/[0.025]">
      <PhoneModal isOpen={showPhoneModal} onClose={() => setShowPhoneModal(false)} t={t} />
      <div className="section-shell">
        <Reveal>
          <SectionHeading align="center" eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description} />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="space-y-4">
            <div className="premium-card p-6">
              <p className="eyebrow">{company.name}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {company.city} / {company.district}
              </h3>
              <div className="mt-6 space-y-4">
                <ContactLine icon={Phone} label={t.contact.phone} value={company.phone} href={company.phoneHref} />
                <ContactLine icon={MessageCircle} label={t.contact.whatsapp} value={company.whatsapp} href={company.whatsappUrl} />
                <ContactLine icon={MapPin} label={t.contact.address} value={company.address} href={company.mapsUrl} />
                <ContactLine icon={Store} label={t.contact.sahibinden} value={t.common.sahibinden} href={company.sahibindenUrl} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setShowPhoneModal(true)}
                className="btn-secondary justify-center px-3 py-3 text-sm"
                aria-label={t.common.callNow}
              >
                {t.common.callNow}
              </button>
              <a className="btn-primary justify-center px-3 py-3 text-sm" href={company.whatsappUrl} target="_blank" rel="noreferrer">
                {t.common.whatsappContact}
              </a>
              <a className="btn-ghost justify-center px-3 py-3 text-sm" href={company.mapsUrl} target="_blank" rel="noreferrer">
                {t.common.directions}
              </a>
              <a className="btn-ghost justify-center px-3 py-3 text-sm" href={company.sahibindenUrl} target="_blank" rel="noreferrer">
                {t.contact.sahibinden}
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-premium">
              <iframe
                title={t.contact.mapTitle}
                className="h-72 w-full border-0 grayscale-[0.25] invert-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Karao%C4%9Flu%20Otomotiv%20Sanayi%20Sitesi%2046003.%20Sk.%20No%3A2%20Seyhan%20Adana&output=embed"
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="premium-card p-5 sm:p-6">
            <h3 className="text-2xl font-semibold text-white">{t.contact.formTitle}</h3>
            <form className="mt-6 grid gap-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.contact.form.name} error={errors.name}>
                  <input name="name" type="text" autoComplete="name" placeholder={t.contact.form.namePlaceholder} />
                </Field>
                <Field label={t.contact.form.phone} error={errors.phone}>
                  <input name="phone" type="tel" autoComplete="tel" placeholder={t.contact.form.phonePlaceholder} />
                </Field>
              </div>
              <Field label={t.contact.form.service} error={errors.service}>
                <select name="service" defaultValue="">
                  <option value="" disabled>
                    {t.contact.form.select}
                  </option>
                  {t.contact.form.services.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label={t.contact.form.message} error={errors.message}>
                <textarea name="message" rows="5" placeholder={t.contact.form.messagePlaceholder} />
              </Field>
              <button className="btn-primary justify-center" type="submit">
                {t.common.submit}
                <Send size={17} />
              </button>
              {success ? (
                <p className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
                  <CheckCircle2 size={19} />
                  {t.contact.success}
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
      className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.032] p-4 transition hover:border-amber/20 hover:bg-white/[0.05]"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-sun/20 bg-sun/[0.10] text-sun">
        <Icon size={20} />
      </span>
      <span>
        <span className="block text-xs font-bold uppercase tracking-[0.18em] text-steel">{label}</span>
        <span className="mt-1 block text-sm font-semibold leading-6 text-white">{value}</span>
      </span>
    </a>
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
