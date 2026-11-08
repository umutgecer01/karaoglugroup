import { MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "../data/company.js";

export default function MobileActionBar({ t }) {
  const actions = [
    { label: t.mobileBar.call, href: company.phoneHref, icon: Phone },
    { label: t.mobileBar.whatsapp, href: company.whatsappUrl, icon: MessageCircle, external: true },
    { label: t.mobileBar.directions, href: company.mapsUrl, icon: MapPin, external: true },
  ];

  return (
    <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-ink/80 px-3 py-2 shadow-2xl backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-3 gap-2">
        {actions.map(({ label, href, icon: Icon, external }) => (
          <a
            key={label}
            className="flex min-h-12 min-w-0 flex-col items-center justify-center rounded-lg bg-white/[0.09] px-1 text-xs font-bold text-white transition active:bg-amber active:text-ink"
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            <Icon size={18} />
            <span className="mt-1 max-w-full text-center leading-tight">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
