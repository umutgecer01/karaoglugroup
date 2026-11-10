import { useEffect, useRef, useState } from 'react';

export default function FleetShowcaseVideo({ t }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = videoRef.current;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) node.pause(); });
    observer.observe(node);
    const visibility = () => { if (document.hidden) node.pause(); };
    document.addEventListener('visibilitychange', visibility);
    node.play().catch(() => {});
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return <div className="relative">
    <video ref={videoRef} className="aspect-[1280/568] w-full object-contain" width="1280" height="568" autoPlay muted controls playsInline preload="auto" poster="/images/fleet-rental-video-poster-1280.webp" aria-label={t.ui.video} onError={() => setFailed(true)}>
      <source src="/videos/fleet-rental-showcase.mp4" type="video/mp4" />
    </video>
    {failed && <p role="alert" className="p-3 text-sm">{t.ui.videoError}</p>}
  </div>;
}
