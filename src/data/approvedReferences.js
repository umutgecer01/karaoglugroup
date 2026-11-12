// Publish only company-verified references with permission from the rights holder.
// Example schema (DO NOT add invented companies):
// { id, name, sector: { tr, en, ar }, description: { tr, en, ar },
//   logoSrc: '/images/approved-reference.webp', verified: true, publicationApproved: true }
// Assets must be owned or licensed by the business.
export const approvedReferences = [];

function isLocalLogo(path) {
  if (typeof path !== 'string' || path.length > 240 || !path.startsWith('/images/')) return false;
  const segments = path.slice('/images/'.length).split('/');
  const filename = segments.pop();
  return /^[a-z0-9_-]+\.(?:avif|webp|jpe?g|png)$/i.test(filename) &&
    segments.every(segment => /^[a-z0-9_-]+$/i.test(segment));
}

export function publishableReferences(records = approvedReferences) {
  return records.filter(item =>
    item?.verified === true &&
    item?.publicationApproved === true &&
    typeof item.id === 'string' && item.id.trim() !== '' &&
    typeof item.name === 'string' && item.name.trim() !== '' &&
    (item.logoSrc == null || isLocalLogo(item.logoSrc))
  );
}
