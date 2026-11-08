import { pagePath } from '../utils/routes.js';
import { ArrowRight, Facebook, Instagram, MapPin, Phone } from "lucide-react";
const logo = "/images/karaoglu-logo.jpeg";
import { company } from "../data/company";

const serviceKeys = ["automotive", "construction", "petroleum", "agriculture", "rental"];

const Footer = ({ t, onNavigate, onPrivacy }) => {
  const handleNavClick = (event, view) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onNavigate?.(view);
  };

  const links = [
    { view: "corporate", label: t?.nav?.corporate || "Kurumsal" },
    { view: "services", label: t?.nav?.services || "Hizmetler" },
    { view: "portfolio", label: t?.nav?.portfolio || "Referanslarımız" },
    { view: "contact", label: t?.nav?.contact || "İletişim" },
  ];

  return (
    <footer className="border-t border-white/15 bg-ink/55 pb-20 backdrop-blur-sm md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.25fr_0.7fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <div className="brand-logo-card footer-brand-card logo-3d-shell group inline-flex items-center">
            <span className="brand-logo-mark footer-brand-mark">
              <img
                src={logo}
                width="588" height="164"
                alt={company.name}
                loading="lazy"
                decoding="async"
                className="logo-3d-image h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(185,101,50,0.07)] group-hover:drop-shadow-[0_0_14px_rgba(185,101,50,0.13)] sm:h-20"
              />
            </span>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">{t?.footer?.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a className="footer-social inline-flex items-center gap-2" href={company.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram size={15} />
              Instagram
            </a>
            <a className="footer-social inline-flex items-center gap-2" href={company.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
              <Facebook size={15} />
              Facebook
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer-title">{t?.footer?.menu || "Menü"}</h4>
          <div className="mt-5 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.view}
                href={pagePath(link.view, t.ui.locale)}
                onClick={(event) => handleNavClick(event, link.view)}
                className="text-start text-sm text-white/70 transition hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="footer-title">{t?.footer?.services || "Faaliyet Alanları"}</h4>
          <div className="mt-5 flex flex-col gap-3">
            {serviceKeys.map((key) => (
              <a
                key={key}
                href={pagePath(`service-${key}`, t.ui.locale)}
                onClick={(event) => handleNavClick(event, `service-${key}`)}
                className="text-start text-sm text-white/70 transition hover:text-gold"
              >
                {t?.services?.items?.[key]?.title}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="footer-title">{t?.footer?.contact || "İletişim"}</h4>
          <div className="mt-5 space-y-3 text-sm text-white/70">
            <a href={company.phoneHref} className="flex items-center gap-3 transition hover:text-gold">
              <Phone size={16} className="text-gold" />
              <span>{company.phone}</span>
            </a>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>{company.address}</span>
            </div>
          </div>
          <a href={pagePath("contact", t.ui.locale)} onClick={(event) => handleNavClick(event, "contact")} className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.08] px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/[0.14]">
            {t?.footer?.cta || t?.contact?.title || "Bize Ulaşın"}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/55 sm:px-6">
        {t?.footer?.copyright}
        <button type="button" className="mt-3 block min-h-11 w-full underline underline-offset-4" onClick={onPrivacy}>{t.ui.privacy}</button>
      </div>
    </footer>
  );
};

export default Footer;
