import { languages } from "../utils/i18n.js";

export default function LanguageSwitcher({ language, setLanguage, compact = false }) {
  return (
    <div
      className={`language-switcher inline-flex items-center rounded-lg border border-white/10 bg-white/[0.055] p-1 ${compact ? "w-full justify-between" : ""}`}
      aria-label="Dil seçimi"
    >
      {languages.map((item) => {
        const active = item.code === language;
        return (
          <button
            key={item.code}
            type="button"
            className={`language-button min-h-9 rounded-md px-2.5 text-xs font-black transition ${
              active ? "bg-amber text-ink" : "text-platinum/80 hover:bg-white/[0.07] hover:text-white"
            }`}
            onClick={() => setLanguage(item.code)}
            aria-pressed={active}
            aria-label={item.name}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
