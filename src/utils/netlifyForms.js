export const CONTACT_FORM_NAME = "corporate-contact";
export const CAREER_FORM_NAME = "career-application";
// Leave room for multipart fields below Netlify Forms' 8 MB request limit.
export const MAX_CV_SIZE_BYTES = 7 * 1024 * 1024;
export const formsEnabled = import.meta.env?.VITE_NETLIFY_FORMS_ENABLED === 'true';

const acceptedCvExtensions = [".pdf", ".doc", ".docx"];
const acceptedCvTypes = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function isValidPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 && /^[+\d\s().-]+$/.test(String(value || '').trim());
}

export function isAllowedCvFile(file) {
  if (typeof file?.name !== 'string' || !file.name) return false;
  const name = file.name.toLowerCase();
  const extension = acceptedCvExtensions.find((value) => name.endsWith(value));
  if (!extension) return false;
  // Browsers may omit MIME or report a generic binary type. A known conflicting
  // type is rejected here; neither the name nor browser MIME proves file safety.
  const type = String(file.type || '').toLowerCase();
  return !type || type === 'application/octet-stream' || type === acceptedCvTypes[extension];
}

export function cvValidationError(file) {
  if (!file?.name || !Number.isFinite(file.size) || file.size <= 0) return 'required';
  if (!isAllowedCvFile(file)) return 'type';
  if (file.size > MAX_CV_SIZE_BYTES) return 'size';
  return null;
}

export async function submitNetlifyForm(form, { multipart = false } = {}) {
  if (!formsEnabled) {
    throw new Error('Netlify Forms must be verified and enabled before accepting submissions.');
  }
  const formData = new FormData(form);
  if (formData.get('bot-field')) throw new Error('Spam submission rejected.');
  const request = {
    method: "POST",
    signal: AbortSignal.timeout(20000),
    body: multipart ? formData : new URLSearchParams(formData).toString(),
  };

  if (!multipart) {
    request.headers = { "Content-Type": "application/x-www-form-urlencoded" };
  }

  const response = await fetch("/", request);
  if (!response.ok) {
    throw new Error(`Form submission failed with ${response.status}`);
  }
}
