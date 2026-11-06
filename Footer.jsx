import { ArrowRight, Facebook, Instagram, MapPin, Phone, Store } from "lucide-react";
import logo from "../assets/karaoglu-logo.jpeg";
import { company } from "../data/company";

const serviceKeys = ["automotive", "construction", "petroleum", "agriculture", "rental"];

const Footer = ({ t, onNavigate }) => {
  const handleNavClick = (event, view) => {
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
                alt={company.name}
                className="logo-3d-image h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(185,101,50,0.07)] group-hover:drop-shadow-[0_0_14px_rgba(185,101,50,0.13)] sm:h-20"
              />
            </span>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">{t?.footer?.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a className="footer-social inline-flex items-center gap-2" href={company.socialLinks.instagram} target="_blank" rel="noreferrer">
              <Instagram size={15} />
              Instagram
            </a>
            <a className="footer-social inline-flex items-center gap-2" href={company.socialLinks.facebook} target="_blank" rel="noreferrer">
              <Facebook size={15} />
              Facebook
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer-title">{t?.footer?.menu || "Menü"}</h4>
          <div className="mt-5 flex flex-col gap-3">
            {links.map((link) => (
              <button
                key={link.view}
                type="button"
                onClick={(event) => handleNavClick(event, link.view)}
                className="text-start text-sm text-white/70 transition hover:text-gold"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="footer-title">{t?.footer?.services || "Faaliyet Alanları"}</h4>
          <div className="mt-5 flex flex-col gap-3">
            {serviceKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={(event) => handleNavClick(event, "services")}
                className="text-start text-sm text-white/70 transition hover:text-gold"
              >
                {t?.services?.items?.[key]?.title}
              </button>
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
            <a href={company.sahibindenUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-gold">
              <Store size={16} className="text-gold" />
              <span>{t?.footer?.sahibinden || t?.contact?.sahibinden || "Sahibinden"}</span>
            </a>
          </div>
          <button type="button" onClick={(event) => handleNavClick(event, "contact")} className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.08] px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/[0.14]">
            {t?.footer?.cta || t?.contact?.title || "Bize Ulaşın"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/55 sm:px-6">
        {t?.footer?.copyright}
      </div>
    </footer>
  );
};

export default Footer;
