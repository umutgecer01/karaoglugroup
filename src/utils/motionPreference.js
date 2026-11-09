export const MOTION_STORAGE_KEY = 'karaoglu-reduced-motion';

// A user request can reduce motion; it cannot override the device preference.
export function createMotionPreference({ root, storage, media }) {
  let userReduced = false;
  try { userReduced = storage?.getItem(MOTION_STORAGE_KEY) === 'true'; } catch { /* Use this visit's in-memory preference. */ }
  const listeners = new Set();
  const snapshot = () => ({ userReduced, systemReduced: !!media?.matches, reduced: userReduced || !!media?.matches });
  const apply = () => {
    const state = snapshot();
    root?.setAttribute('data-reduced-motion', String(state.reduced));
    for (const listener of listeners) listener(state);
    return state;
  };
  if (media?.addEventListener) media.addEventListener('change', apply);
  else media?.addListener?.(apply);
  apply();
  return {
    snapshot,
    setUserReduced(value) {
      userReduced = value === true;
      try { storage?.setItem(MOTION_STORAGE_KEY, String(userReduced)); } catch { /* Keep the preference active for this visit. */ }
      return apply();
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    dispose() {
      if (media?.removeEventListener) media.removeEventListener('change', apply);
      else media?.removeListener?.(apply);
      listeners.clear();
    },
  };
}

let current;
export function initializeMotionPreference() {
  if (current || typeof window === 'undefined') return current;
  let storage;
  try { storage = window.localStorage; } catch { /* A blocked storage getter must not prevent startup. */ }
  current = createMotionPreference({ root: document.documentElement, storage, media: window.matchMedia?.('(prefers-reduced-motion: reduce)') });
  return current;
}

export function getMotionPreference() {
  return initializeMotionPreference()?.snapshot() || { userReduced: false, systemReduced: false, reduced: false };
}

export function setReducedMotion(value) {
  return initializeMotionPreference()?.setUserReduced(value);
}

export function subscribeMotionPreference(listener) {
  return initializeMotionPreference()?.subscribe(listener) || (() => {});
}
