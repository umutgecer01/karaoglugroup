import { MessageCircle } from "lucide-react";
import { company } from "../data/company.js";

export default function WhatsAppButton({ t }) {
  return (
    <a
      className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_18px_42px_rgba(37,211,102,0.32)] transition hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(37,211,102,0.42)] md:flex"
      href={company.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={t.common.whatsappContact}
    >
      <MessageCircle size={25} />
    </a>
  );
}
