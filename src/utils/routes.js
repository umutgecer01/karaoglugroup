import { normalizeLanguage } from './i18n.js';

export const pagePaths = {
  home: ['', ''],
  corporate: ['kurumsal', 'corporate'],
  'corporate-about': ['hakkimizda', 'about'],
  'corporate-structure': ['kurumsal-yapi', 'corporate-structure'],
  'corporate-chairman': ['baskan-mesaji', 'chairmans-message'],
  'corporate-values': ['degerlerimiz', 'values'],
  'corporate-hr': ['insan-kaynaklari', 'human-resources'],
  services: ['faaliyetler', 'activities'],
  portfolio: ['portfoy', 'references'],
  rental: ['kiralama', 'fleet-rental'],
  career: ['kariyer', 'careers'],
  contact: ['iletisim', 'contact'],
  'service-automotive': ['otomotiv', 'automotive'],
  'service-construction': ['insaat', 'construction'],
  'service-petroleum': ['petrol', 'petroleum'],
  'service-agriculture': ['tarim', 'agriculture'],
  'service-rental': ['filo-kiralama', 'fleet-services'],
};

export function pagePath(view, language = 'tr') {
  const lang = normalizeLanguage(language);
  const slug = pagePaths[view]?.[lang === 'tr' ? 0 : 1];
  return `/${lang}/${slug === undefined ? '404/' : slug ? `${slug}/` : ''}`;
}

const legacyViews = {
  home: 'home', kurumsal: 'corporate', corporate: 'corporate',
  'kurumsal-yapi': 'corporate-structure', faaliyetler: 'services', services: 'services',
  portfoy: 'portfolio', portfolio: 'portfolio', kiralama: 'rental', rental: 'rental',
  kariyer: 'career', career: 'career', iletisim: 'contact', contact: 'contact',
  hakkimizda: 'corporate-about', 'baskan-mesaji': 'corporate-chairman',
  degerlerimiz: 'corporate-values', 'insan-kaynaklari': 'corporate-hr',
};

export function resolveRoute(pathname = '/', search = '', hash = '', fallbackLanguage = 'tr') {
  const segments = pathname.toLowerCase().split('/').filter(Boolean);
  const isLocalized = ['tr', 'en', 'ar'].includes(segments[0]);
  const language = isLocalized ? segments[0] : normalizeLanguage(new URLSearchParams(search).get('lang') || fallbackLanguage);
  const slug = segments.slice(1).join('/');
  let view = pathname === '/' ? 'home' : 'not-found';
  if (isLocalized) view = Object.keys(pagePaths).find(key => pagePaths[key][language === 'tr' ? 0 : 1] === slug) || 'not-found';
  if (hash && hash !== '#main-content') view = legacyViews[hash.slice(1).toLowerCase()] || 'not-found';
  return { language, view };
}
