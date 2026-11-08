import { useEffect, useRef, useState } from "react";

export default function DeferredMount({ children, fallbackHeight = "34rem", rootMargin = "900px 0px" }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    const activate = () => setActive(true);
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const idleId = hasIdleCallback
      ? window.requestIdleCallback(activate, { timeout: 2600 })
      : window.setTimeout(activate, 2600);

    if (!("IntersectionObserver" in window)) {
      return () => {
        if (hasIdleCallback) {
          window.cancelIdleCallback(idleId);
        } else {
          window.clearTimeout(idleId);
        }
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (hasIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [active, rootMargin]);

  if (active) {
    return children;
  }

  return (
    <div
      ref={ref}
      className="deferred-placeholder"
      style={{ minHeight: fallbackHeight }}
      aria-hidden="true"
    />
  );
}
