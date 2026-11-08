import { cloneElement, useId } from 'react';

export function Field({ label, error, children }) {
  const id = useId();
  return <label className="form-field" htmlFor={id}>
    <span>{label}</span>
    {cloneElement(children, { id, 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-error` : undefined })}
    {error ? <small id={`${id}-error`} className="text-sm font-semibold text-orange-200">{error}</small> : null}
  </label>;
}

export function ConsentField({ label, error }) {
  const id = useId();
  return <label className="form-consent" htmlFor={id}>
    <input id={id} type="checkbox" name="consent" value="accepted" aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
    <span>{label}</span>
    {error ? <small id={`${id}-error`}>{error}</small> : null}
  </label>;
}
