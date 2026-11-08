export const languages = [
  { code: "tr", label: "TR", name: "Türkçe", dir: "ltr" },
  { code: "en", label: "EN", name: "English", dir: "ltr" },
  { code: "ar", label: "AR", name: "العربية", dir: "rtl" },
];

export const defaultLanguage = "tr";

export function normalizeLanguage(value) {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  return languages.some((language) => language.code === normalized) ? normalized : defaultLanguage;
}

export function getStoredLanguage() {
  if (typeof window === "undefined") return defaultLanguage;
  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  if (urlLanguage) return normalizeLanguage(urlLanguage);
  try {
    return normalizeLanguage(
      window.localStorage.getItem("karaoglu-language") || window.localStorage.getItem("lang"),
    );
  } catch {
    return defaultLanguage;
  }
}

export function getDirection(language) {
  return languages.find((item) => item.code === language)?.dir || "ltr";
}
