import { lazy, Suspense, useEffect, useRef, useState, startTransition } from 'react';
import Header from './components/Header.jsx';
import PageErrorBoundary from './components/PageErrorBoundary.jsx';
import Hero from './components/Hero.jsx';
import WhyUs from './components/WhyUs.jsx';
import MobileActionBar from './components/MobileActionBar.jsx';
import PrivacyConsent from './components/PrivacyConsent.jsx';
import ScrollTopButton from './components/ScrollTopButton.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import { tr } from './data/translations/tr.js';
import { getDirection, normalizeLanguage } from './utils/i18n.js';
import { pagePath, resolveRoute } from './utils/routes.js';
import { pageMetadata, updateMetadata } from './utils/metadata.js';

const ChairmanMessage = lazy(() => import('./components/ChairmanMessage.jsx'));
const Corporate = lazy(() => import('./components/Corporate.jsx'));
const CorporatePreview = lazy(() => import('./components/CorporatePreview.jsx'));
const Services = lazy(() => import('./components/Services.jsx'));
const ServicesPreview = lazy(() => import('./components/ServicesPreview.jsx'));
const HomeFleetFeature = lazy(() => import('./components/HomeFleetFeature.jsx'));
const Career = lazy(() => import('./components/Career.jsx'));
const Process = lazy(() => import('./components/Process.jsx'));
const Contact = lazy(() => import('./components/Contact.jsx'));
const QuickContact = lazy(() => import('./components/QuickContact.jsx'));
const VehiclePortfolio = lazy(() => import('./components/VehiclePortfolio.jsx'));
const RentalSection = lazy(() => import('./components/RentalSection.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));
const NotFound = lazy(() => import('./components/NotFound.jsx'));

export const loadLocale = async language => {
  if (language === 'en') return (await import('./data/translations/en.js')).en;
  if (language === 'ar') return (await import('./data/translations/ar.js')).ar;
  return tr;
};

export default function App({ initialRoute = { view: 'home', language: 'tr' }, initialContent = tr }) {
  const [route, setRoute] = useState(initialRoute);
  const [locale, setLocale] = useState({ language: initialRoute.language, content: initialContent });
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const navigationId = useRef(0);
  const { view: activeView, language } = route;
  const t = locale.content;
  const renderedLang = locale.language;

  useEffect(() => {
    document.documentElement.lang = renderedLang;
    document.documentElement.dir = getDirection(renderedLang);
    updateMetadata(pageMetadata(activeView, renderedLang, t, import.meta.env.VITE_SITE_URL));
    try { localStorage.setItem('karaoglu-language', renderedLang); } catch {}
  }, [activeView, renderedLang, t]);

  useEffect(() => {
    const sync = async () => {
      const next = resolveRoute(window.location.pathname, window.location.search, window.location.hash);
      const id = ++navigationId.current;
      try {
        const content = await loadLocale(next.language);
        if (id !== navigationId.current) return;
        startTransition(() => {
          setLocale(current => current.language === next.language ? current : { language: next.language, content });
          setRoute(current => current.view === next.view && current.language === next.language ? current : next);
        });
      } catch {
        if (id === navigationId.current) document.getElementById('startup-error').hidden = false;
        return;
      }
      const canonical = pagePath(next.view, next.language);
      if (window.location.hash !== '#main-content' && window.location.pathname !== canonical) window.history.replaceState({}, '', canonical);
      if (window.location.hash !== '#main-content') window.scrollTo({ top: 0, behavior: 'instant' });
    };
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      navigationId.current++;
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const navigate = async (view = 'home', lang = language) => {
    const next = { view, language: normalizeLanguage(lang) };
    const id = ++navigationId.current;
    let content;
    try { content = await loadLocale(next.language); }
    catch {
      if (id === navigationId.current) document.getElementById('startup-error').hidden = false;
      return;
    }
    if (id !== navigationId.current) return;
    const path = pagePath(next.view, next.language);
    if (path !== window.location.pathname) window.history.pushState({}, '', path);
    startTransition(() => {
      setLocale({ language: next.language, content });
      setRoute(next);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
  };

  const renderView = () => {
    if (activeView.startsWith('corporate')) return <Corporate t={t} onNavigate={navigate} focus={activeView === 'corporate' ? 'all' : activeView.replace('corporate-', '')} />;
    if (activeView.startsWith('service-')) return <Services t={t} serviceId={activeView.slice(8)} onNavigate={navigate} />;
    switch (activeView) {
      case 'services': return <Services t={t} onNavigate={navigate} />;
      case 'portfolio': return <VehiclePortfolio t={t} />;
      case 'rental': return <RentalSection t={t} />;
      case 'career': return <Career t={t} />;
      case 'contact': return <Contact t={t} />;
      case 'not-found': return <NotFound t={t} onNavigate={navigate} />;
      default: return <>
        <Hero t={t} onNavigate={navigate} />
        <CorporatePreview t={t} onNavigate={navigate} />
        <ServicesPreview t={t} onNavigate={navigate} />
        <HomeFleetFeature t={t} onNavigate={navigate} />
        <WhyUs t={t} />
        <Process t={t} />
        <ChairmanMessage t={t} compact onOpen={() => navigate('corporate-chairman')} />
        <QuickContact t={t} />
      </>;
    }
  };

  return <div className="min-h-screen bg-transparent text-white">
    <a className="skip-link" href="#main-content">{t.ui.skip}</a>
    <Header t={t} language={renderedLang} setLanguage={lang => navigate(activeView, lang)} onNavigate={navigate} activeView={activeView} />
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-transparent pb-20 outline-none md:pb-0">
      <PageErrorBoundary key={`${activeView}:${renderedLang}`} t={t}>
        <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>{renderView()}</Suspense>
      </PageErrorBoundary>
    </main>
    <Suspense fallback={null}><Footer t={t} onNavigate={navigate} onPrivacy={() => setPrivacyOpen(true)} /></Suspense>
    <WhatsAppButton t={t} />
    <ScrollTopButton t={t} />
    <MobileActionBar t={t} />
    <PrivacyConsent t={t} open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
  </div>;
}
