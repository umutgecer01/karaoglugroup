import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollTopButton({ t }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      ticking = false;
      const shouldShow = window.scrollY > 280;
      setVisible((current) => (current === shouldShow ? current : shouldShow));
    };

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`scroll-top-button ${visible ? "scroll-top-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t.ui.top}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <ArrowUp size={20} />
    </button>
  );
}
