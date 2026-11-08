import { useRef, useState } from 'react';
import { submitNetlifyForm } from './netlifyForms.js';

export function useFormSubmission(validate, { multipart = false, onSuccess } = {}) {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const pending = useRef(false);
  const handleSubmit = async event => {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const nextErrors = validate(new FormData(form));
    setErrors(nextErrors);
    setStatus('idle');
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      window.requestAnimationFrame(() => form.elements.namedItem(firstInvalid)?.focus());
      return;
    }
    pending.current = true;
    setStatus('submitting');
    try {
      await submitNetlifyForm(form, { multipart });
      form.reset();
      onSuccess?.();
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      pending.current = false;
    }
  };
  return { errors, status, handleSubmit, isSubmitting: status === 'submitting' };
}
