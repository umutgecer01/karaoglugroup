const DEFAULT_SITE_URL = "https://karaoglugroupnet.netlify.app/";

const normalizeSiteUrl = (value) => {
  const url = new URL(value || DEFAULT_SITE_URL);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('VITE_SITE_URL must be a public HTTP(S) base URL without credentials, query or hash.');
  }
  return url.href.endsWith('/') ? url.href : `${url.href}/`;
};

export const SITE_URL = normalizeSiteUrl(process.env.VITE_SITE_URL);
export const SITE_IMAGE_PATH = "images/karaoglu-why-bg.jpeg";
export const SITE_IMAGE_URL = new URL(SITE_IMAGE_PATH, SITE_URL).toString();

