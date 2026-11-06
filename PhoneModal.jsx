import { MessageCircle, Phone, X } from "lucide-react";
import { company } from "../data/company.js";

export default function PhoneModal({ isOpen, onClose, t }) {
  if (!isOpen) return null;

  const content = t?.phoneModal || {
    title: "Hemen Arayın",
    description: "Aşağıdaki numaraya tıklayarak doğrudan arayabilirsiniz.",
    note: "Telefonunuzdan doğrudan arayın veya WhatsApp'tan mesaj gönderin.",
    whatsapp: "WhatsApp'tan Yaz",
    close: "Kapat",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div
          className="relative w-full max-w-md rounded-2xl border border-amber/20 bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-petrol/15 p-5 shadow-2xl sm:rounded-3xl sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.1] sm:right-4 sm:top-4 sm:h-10 sm:w-10"
            aria-label={content.close}
          >
            <X size={18} className="sm:h-5 sm:w-5" />
          </button>

          <div className="text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber/[0.18] to-amber/[0.08] sm:mb-6 sm:h-16 sm:w-16">
              <Phone size={28} className="text-amber sm:h-8 sm:w-8" />
            </div>

            <h2 className="text-lg font-bold text-white sm:text-xl">{content.title}</h2>
            <p className="mt-3 text-xs leading-6 text-steel sm:mt-4 sm:text-sm">{content.description}</p>

            <a
              href={company.phoneHref}
              className="mt-6 block rounded-xl border border-amber/25 bg-gradient-to-r from-amber/[0.14] to-amber/[0.07] p-4 transition hover:border-amber/30 hover:from-amber/20 hover:to-amber/10 sm:mt-8 sm:rounded-2xl sm:p-6"
            >
              <span className="block text-3xl font-black text-amber sm:text-5xl lg:text-6xl">{company.phone}</span>
            </a>

            <p className="mt-4 text-xs leading-6 text-platinum/70 sm:mt-6">{content.note}</p>

            <a
              href={company.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 transition hover:border-emerald-500/50 hover:from-emerald-500/30 hover:to-emerald-600/20 sm:mt-6 sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"
            >
              <MessageCircle size={17} />
              {content.whatsapp}
            </a>

            <button
              onClick={onClose}
              className="mt-4 block w-full rounded-lg border border-white/10 bg-white/[0.05] py-2.5 text-xs font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08] sm:mt-6 sm:rounded-xl sm:py-3 sm:text-sm"
            >
              {content.close}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
