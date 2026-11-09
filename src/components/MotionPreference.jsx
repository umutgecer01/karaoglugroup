import { useEffect, useState } from 'react';
import { getMotionPreference, setReducedMotion, subscribeMotionPreference } from '../utils/motionPreference.js';

export default function MotionPreference({ t }) {
  const [preference, setPreference] = useState(getMotionPreference);
  useEffect(() => subscribeMotionPreference(setPreference), []);
  return <div className="mt-5 rounded-xl border border-white/15 p-4">
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
      <input type="checkbox" className="h-5 w-5 shrink-0 accent-amber" checked={preference.userReduced} aria-describedby="motion-preference-help" onChange={event => setReducedMotion(event.target.checked)} />
      <span>{t.motionPreference.label}</span>
    </label>
    <p id="motion-preference-help" className="mt-2 text-sm leading-6 text-steel">{t.motionPreference.description}</p>
  </div>;
}
