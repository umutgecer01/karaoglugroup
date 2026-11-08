import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
const logo = '/images/karaoglu-logo.jpeg';
import { company } from '../data/company.js';
import { pagePath } from '../utils/routes.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const corporateViews = ['corporate-about', 'corporate-structure', 'corporate-chairman', 'corporate-values', 'corporate-hr'];
export default function Header({ t, language, setLanguage, onNavigate, activeView }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    const outside = event => {
      if (!ref.current?.contains(event.target)) {
        setIsOpen(false);
        ref.current?.querySelectorAll('details[open]').forEach(node => { node.open = false; });
      }
    };
    const escape = event => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        ref.current?.querySelectorAll('details[open]').forEach(node => { node.open = false; node.querySelector('summary')?.focus(); });
        if (isOpen) toggle.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [isOpen]);
  useEffect(() => { setIsOpen(false); }, [activeView, language]);
  const navigate = (event, view) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setIsOpen(false);
    ref.current?.querySelectorAll('details[open]').forEach(node => { node.open = false; });
    onNavigate(view);
  };
  const items = [
    ['home', t.nav.home], ['corporate', t.nav.corporate], ['services', t.nav.services],
    ['portfolio', t.nav.portfolio], ['rental', t.nav.rental], ['career', t.nav.career], ['contact', t.nav.contact],
  ];
  const link = (view, label, className = '') => <a key={view} href={pagePath(view, language)} onClick={event => navigate(event, view)}
    aria-current={activeView === view ? 'page' : undefined} className={`nav-link ${className} ${activeView === view ? 'text-amber' : 'text-white/80'}`}>{label}</a>;
  const corporate = () => <details className="corporate-menu relative">
    <summary className="nav-link flex cursor-pointer list-none items-center gap-1 text-white/80">{t.nav.corporate}<ChevronDown size={14} /></summary>
    <div className="corporate-menu-panel menu-panel-3d grid rounded-lg border border-white/15 p-2">
      {link('corporate', t.nav.corporate)}
      {(t.nav.corporateLinks || []).map((item, index) => link(corporateViews[index], item.title))}
    </div>
  </details>;
  return <header ref={ref} className="sticky top-0 z-50 border-b border-white/10">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <a href={pagePath('home', language)} onClick={event => navigate(event, 'home')} className="brand-logo-card logo-3d-shell group flex items-center">
        <span className="brand-logo-mark"><img src={logo} alt={company.name} width="588" height="164" fetchPriority="low" className="logo-3d-image h-10 w-auto object-contain sm:h-12 lg:h-14" /></span>
      </a>
      <nav aria-label={t.footer.menu} className="hidden items-center xl:flex">
        {items.map(([view, label]) => view === 'corporate' ? <div key={view}>{corporate()}</div> : link(view, label))}
      </nav>
      <div className="hidden xl:block"><LanguageSwitcher language={language} setLanguage={setLanguage} ariaLabel={t.languageSwitcher.ariaLabel} /></div>
      <button ref={toggle} type="button" className="grid h-11 w-11 place-items-center rounded-md border border-white/15 xl:hidden" onClick={() => setIsOpen(value => !value)} aria-label={isOpen ? t.ui.closeMenu : t.ui.openMenu} aria-expanded={isOpen} aria-controls="mobile-navigation">
        {isOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
    </div>
    {isOpen && <nav id="mobile-navigation" aria-label={t.footer.menu} className="mobile-navigation border-t border-white/10 px-4 py-4 xl:hidden">
      {items.map(([view, label]) => view === 'corporate' ? <div key={view}>{corporate()}</div> : link(view, label, 'block'))}
      <div className="mt-3 border-t border-white/10 pt-3"><LanguageSwitcher language={language} setLanguage={setLanguage} ariaLabel={t.languageSwitcher.ariaLabel} /></div>
    </nav>}
  </header>;
}
