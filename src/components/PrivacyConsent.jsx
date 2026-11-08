import { Cookie, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import Dialog from './Dialog.jsx';

const CONSENT_STORAGE_KEY = "karaoglu-privacy-consent";

export default function PrivacyConsent({ t, open = false, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const content = t?.privacyConsent;

  useEffect(() => {
    try {
      setIsVisible(!localStorage.getItem(CONSENT_STORAGE_KEY));
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (choice) => {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ choice, savedAt: new Date().toISOString() }),
      );
    } catch {
      // The preference still applies for this visit when storage is unavailable.
    }
    setIsVisible(false);
    onClose?.();
  };

  if ((!isVisible && !open) || !content) return null;

  return (
    <Dialog className="privacy-dialog" labelledBy="privacy-consent-title" onClose={() => saveConsent('necessary')}>
      <div className="privacy-consent__panel">
        <div className="privacy-consent__header">
          <div className="privacy-consent__icons" aria-hidden="true">
            <ShieldCheck size={19} />
            <Cookie size={19} />
          </div>
          <button
            type="button"
            className="privacy-consent__close"
            onClick={() => saveConsent("necessary")}
            aria-label={content.close}
          >
            <X size={18} />
          </button>
        </div>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="privacy-consent-title">{content.title}</h2>
        <p className="privacy-consent__description">{content.description}</p>
        <div className="privacy-consent__notes">
          <p>
            <strong>{content.kvkkTitle}</strong>
            {content.kvkkText}
          </p>
          <p>
            <strong>{content.cookiesTitle}</strong>
            {content.cookiesText}
          </p>
        </div>
        <p className="privacy-consent__legal-note">{content.legalNote}</p>
        <div className="privacy-consent__actions">
          <button type="button" className="btn-ghost" onClick={() => saveConsent("necessary")}>
            {content.necessary}
          </button>
          <button type="button" className="btn-primary" onClick={() => saveConsent("all")}>
            {content.accept}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
