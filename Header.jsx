import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/karaoglu-logo.jpeg";
import { company } from "../data/company.js";

const Header = ({ t, onNavigate, activeView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (event, view) => {
    event.preventDefault();
    setIsOpen(false);
    onNavigate?.(view);
  };

  const handleCorporateSubLink = (event, href) => {
    event.preventDefault();
    setIsOpen(false);
    onNavigate?.("corporate");

    const targetId = href.replace("#", "");
    setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState({}, "", href);
      }
    }, 90);
  };

  const corporateLinks = t?.nav?.corporateLinks || [];

  const navItems = [
    { view: "home", label: t?.nav?.home || "Ana Sayfa" },
    { view: "corporate", label: t?.nav?.corporate || "Kurumsal" },
    { view: "services", label: t?.nav?.services || "Hizmetler" },
    { view: "portfolio", label: t?.nav?.portfolio || "Referanslarımız" },
    { view: "rental", label: t?.nav?.rental || "Filo Kiralama" },
    { view: "career", label: t?.nav?.career || "Kariyer" },
    { view: "contact", label: t?.nav?.contact || "İletişim" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ink/55 backdrop-blur-xl">
      {/* Üst altın çizgi */}
      <div className="h-[2px] bg-gradient-to-r from-sun/[0.18] via-amber/[0.16] to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <button type="button" onClick={(event) => handleNavClick(event, "home")} className="brand-logo-card logo-3d-shell group flex items-center">
          <span className="brand-logo-mark">
            <img
              src={logo}
              alt={company.name}
              className="logo-3d-image h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(185,101,50,0.08)] group-hover:drop-shadow-[0_0_14px_rgba(185,101,50,0.14)] sm:h-12 lg:h-14"
            />
          </span>
        </button>

        {/* Navigasyon */}
        <nav className="hidden items-center xl:flex">
          {navItems.map((item) => {
            const isActive = activeView === item.view;

            if (item.view === "corporate" && corporateLinks.length) {
              return (
                <div key={item.view} className="group relative">
                  <button
                    type="button"
                    onClick={(event) => handleNavClick(event, item.view)}
                    className={`nav-3d-item relative inline-flex items-center gap-1 px-3 py-2 text-[13px] font-medium transition-colors duration-200 xl:px-4 xl:text-sm ${
                      isActive ? "text-amber" : "text-white/65 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={14} className="opacity-70" />
                    {isActive && (
                      <span className="nav-3d-underline absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-sun/30" />
                    )}
                  </button>

                  <div className="pointer-events-none absolute start-0 top-full z-50 w-56 pt-2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="menu-panel-3d rounded-xl border border-white/15 bg-ink/90 p-2 backdrop-blur-xl">
                      {corporateLinks.map((link) => (
                        <button
                          key={link.href}
                          type="button"
                          onClick={(event) => handleCorporateSubLink(event, link.href)}
                          className="dropdown-3d-item block w-full rounded-lg px-3 py-2 text-start text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                          {link.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.view}
                type="button"
                onClick={(event) => handleNavClick(event, item.view)}
                className={`nav-3d-item relative px-3 py-2 text-[13px] font-medium transition-colors duration-200 xl:px-4 xl:text-sm ${
                  isActive ? "text-amber" : "text-white/65 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="nav-3d-underline absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-sun/30" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobil hamburger */}
        <button type="button" className="rounded-md border border-white/10 bg-white/5 p-2 text-white xl:hidden" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Alt sınır çizgisi */}
      <div className="h-px bg-white/10" />

      {/* Mobil menü */}
      {isOpen && (
        <div className="border-t border-white/10 bg-ink/75 backdrop-blur-xl px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <div key={item.view}>
                  <button
                    type="button"
                    onClick={(event) => handleNavClick(event, item.view)}
                    className={`w-full rounded-lg px-4 py-3 text-start text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber/10 text-amber"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>

                  {item.view === "corporate" && corporateLinks.length ? (
                    <div className="mt-1 grid gap-1 pl-3">
                      {corporateLinks.map((link) => (
                        <button
                          key={link.href}
                          type="button"
                          onClick={(event) => handleCorporateSubLink(event, link.href)}
                          className="rounded-lg px-4 py-2 text-start text-xs font-semibold tracking-wide text-white/70 transition hover:bg-white/5 hover:text-white"
                        >
                          {link.title}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
