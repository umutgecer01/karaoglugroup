import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App, { loadLocale } from "./App.jsx";
import { pagePath, resolveRoute } from './utils/routes.js';
import { getStoredLanguage } from './utils/i18n.js';
import { initializeMotionPreference } from './utils/motionPreference.js';
import "./index.css";

initializeMotionPreference();

async function start() {
  const route = resolveRoute(window.location.pathname, window.location.search, window.location.hash, getStoredLanguage());
  const content = await loadLocale(route.language);
  const initialLanguageMatches = document.documentElement.lang === route.language;
  const hadLegacyHash = !!window.location.hash && window.location.hash !== '#main-content';
  if (window.location.pathname === '/' || hadLegacyHash) window.history.replaceState({}, '', pagePath(route.view, route.language));
  const element = <StrictMode><App initialRoute={route} initialContent={content} /></StrictMode>;
  const root = document.getElementById('root');
  const canHydrate = root.dataset.ssr === 'true' && initialLanguageMatches && !hadLegacyHash;
  if (canHydrate) hydrateRoot(root, element);
  else createRoot(root).render(element);
}
start().catch(() => {
  // Prerendered content remains usable when a network error prevents hydration.
  document.getElementById('startup-error').hidden = false;
});
