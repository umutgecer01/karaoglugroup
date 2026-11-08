import { pagePath } from './routes.js';

const previewBuild = typeof __DEPLOY_PREVIEW__ !== 'undefined' && __DEPLOY_PREVIEW__;

export function pageMetadata(view, language, t, root = 'https://karaoglugroupnet.netlify.app/', preview = previewBuild) {
  const section = { home: 'hero', services: 'services', portfolio: 'portfolio', rental: 'rental', career: 'career', contact: 'contact' }[view];
  const service = view.startsWith('service-') ? t.services.items[view.slice(8)] : null;
  const label = service?.title || t.ui.pages[view] || t[section]?.title || t.nav.corporate;
  const title = view === 'home' ? t.seo.title : `${label} | Karaoğlu Group`;
  const corporatePage = view.startsWith('corporate-') ? t.corporate.subpageHeaders?.[view.slice(10)] : null;
  const description = service?.description || corporatePage?.description || t[section]?.description || t[section]?.text || t.corporate.intro || t.seo.description;
  return {
    title, description: view === 'home' ? t.seo.description : view === 'not-found' ? t.ui.notFoundText : description,
    canonical: new URL(pagePath(view, language), root).href,
    locale: { tr: 'tr_TR', en: 'en_GB', ar: 'ar_SA' }[language],
    alternates: ['tr', 'en', 'ar'].map(lang => ({ lang, href: new URL(pagePath(view, lang), root).href })),
    robots: preview ? 'noindex, nofollow' : view === 'not-found' ? 'noindex, follow' : 'index, follow',
  };
}

export function updateMetadata(meta) {
  document.title = meta.title;
  const set = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);
  set('meta[name="description"]', meta.description);
  set('meta[property="og:title"]', meta.title);
  set('meta[property="og:description"]', meta.description);
  set('meta[property="og:url"]', meta.canonical);
  set('meta[property="og:locale"]', meta.locale);
  set('meta[name="twitter:title"]', meta.title);
  set('meta[name="twitter:description"]', meta.description);
  set('meta[name="robots"]', meta.robots);
  set('meta[name="googlebot"]', meta.robots);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.canonical);
  document.querySelectorAll('link[hreflang]').forEach(node => node.remove());
  for (const { lang, href } of [...meta.alternates, { lang: 'x-default', href: meta.alternates[0].href }]) {
    const link = document.createElement('link');
    link.rel = 'alternate'; link.hreflang = lang; link.href = href;
    document.head.append(link);
  }
}
