import { useEffect, useRef } from 'react';

export default function Dialog({ children, onClose, labelledBy, className = '' }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const node = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    const cancel = event => { event.preventDefault(); closeRef.current(); };
    node.addEventListener('cancel', cancel);
    return () => {
      node.removeEventListener('cancel', cancel);
      node.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={labelledBy} className={`site-dialog ${className}`} onClick={event => {
    if (event.target === event.currentTarget) closeRef.current();
  }}>{children}</dialog>;
}
