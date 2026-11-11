import { useEffect, useRef, useState } from 'react';

export default function FleetShowcaseVideo({ t }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  useEffect(() => {
    const node = videoRef.current;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) node.pause(); });
    observer.observe(node);
    const visibility = () => { if (document.hidden) node.pause(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => { if (loadVideo) videoRef.current?.play().catch(() => {}); }, [loadVideo]);
  return <div>
    <div className="relative">
      <video ref={videoRef} className="aspect-[1280/568] w-full object-contain" width="1280" height="568" controls={loadVideo} playsInline preload="none" poster="/images/fleet-rental-video-poster-1280.webp" aria-label={t.ui.video} onError={() => setFailed(true)}>
        {loadVideo && <source src="/videos/fleet-rental-showcase.mp4" type="video/mp4" />}
      </video>
      {!loadVideo && <button type="button" className="absolute inset-0 grid place-items-center bg-black/15" onClick={() => setLoadVideo(true)}><span className="btn-primary">{t.ui.playVideo}</span></button>}
    </div>
    {failed && <p role="alert" className="p-3 text-sm">{t.ui.videoError}</p>}
    <details className="border-t border-white/15 p-4 text-sm leading-7 text-platinum">
      <summary className="cursor-pointer font-semibold">{t.ui.videoDescriptionTitle}</summary>
      <p className="mt-2">{t.ui.videoDescription}</p>
    </details>
  </div>;
}
