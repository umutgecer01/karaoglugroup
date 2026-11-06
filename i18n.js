export const languages = [{ code: "tr", label: "TR", name: "Türkçe", dir: "ltr" }];

export const defaultLanguage = "tr";

export function normalizeLanguage() {
  return defaultLanguage;
}

export function getStoredLanguage() {
  return defaultLanguage;
}

export function getDirection(language) {
  return languages.find((item) => item.code === language)?.dir || "ltr";
}
