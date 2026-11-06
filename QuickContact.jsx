import { CheckCircle2, MapPin, MessageCircle, Phone, Send, Store } from "lucide-react";
import { useState } from "react";
import { company } from "../data/company.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function QuickContact({ t }) {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccess(true);
    event.currentTarget.reset();
  };

  return (
    <section className="section-band bg-white/[0.025]">
      <div className="section-shell">
        <Reveal>
          <SectionHeading align="center" eyebrow={t.contact.eyebrow} title={t.contact.title} description={t.contact.description} />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="grid gap-4 sm:grid-cols-2">
            <QuickLink icon={Phone} label={t.common.callNow} href={company.phoneHref} value={company.phone} />
            <QuickLink icon={MessageCircle} label={t.common.whatsappContact} href={company.whatsappUrl} value={company.whatsapp} external />
            <QuickLink icon={MapPin} label={t.common.directions} href={company.mapsUrl} value={`${company.city} / ${company.district}`} external />
            <QuickLink icon={Store} label={t.contact.sahibinden} href={company.sahibindenUrl} value={t.common.sahibinden} external />
          </Reveal>

          <Reveal delay={100} className="premium-card p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-white">{t.heroForm.title}</h3>
            <p className="mt-2 text-sm leading-7 text-steel">{t.heroForm.subtitle}</p>
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              <label className="form-field">
                <span>{t.heroForm.name}</span>
                <input name="name" type="text" placeholder={t.heroForm.namePlaceholder} required />
              </label>
              <label className="form-field">
                <span>{t.heroForm.phone}</span>
                <input name="phone" type="tel" placeholder={t.heroForm.phonePlaceholder} required />
              </label>
              <label className="form-field sm:col-span-2">
                <span>{t.heroForm.service}</span>
                <select name="service" defaultValue="" required>
                  <option value="" disabled>{t.heroForm.servicePlaceholder}</option>
                  {t.heroForm.services.map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
              </label>
              <button className="btn-primary justify-center sm:col-span-2" type="submit">
                {t.heroForm.submit}
                <Send size={17} />
              </button>
              {success ? (
                <p className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 sm:col-span-2">
                  <CheckCircle2 size={19} />
                  {t.heroForm.success}
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
      className="premium-card flex min-h-36 flex-col justify-between p-5 transition hover:border-amber/25"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-sun/20 bg-sun/[0.10] text-sun">
        <Icon size={22} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-steel">{value}</span>
      </span>
    </a>
  );
}
