import { ArrowLeft, Phone } from "lucide-react";
import { company } from "../data/company.js";

export default function NotFound({ t, onNavigate }) {
  return (
    <section className="section-band page-not-found">
      <div className="section-shell">
        <div className="max-w-2xl border-l-2 border-sun pl-6 sm:pl-8">
          <p className="eyebrow">{t.ui.notFound}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {t.ui.notFoundTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-steel">
            {t.ui.notFoundText}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn-primary" onClick={() => onNavigate?.("home")}>
              <ArrowLeft size={17} />
              {t.ui.backHome}
            </button>
            <a className="btn-secondary" href={company.phoneHref}>
              <Phone size={17} />
              {company.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
