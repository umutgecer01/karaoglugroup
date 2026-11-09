export const previewBranchAllowed = branch => /^release\/[a-z0-9][a-z0-9._/-]*$/i.test(branch) && !branch.includes('..') && !branch.includes('//') && !branch.endsWith('/');
export function fileMayBeCommitted(path) {
  const normalized=path.replaceAll('\\','/').toLowerCase();
  const parts=normalized.split('/');
  if(parts.some(part=>['.git','.audit','.netlify','node_modules','dist'].includes(part)))return false;
  const name=parts.at(-1);
  if(name.startsWith('.env')&&name!=='.env.example')return false;
  if(['.npmrc','.pypirc','id_rsa','id_ed25519','credentials.json'].includes(name))return false;
  if(/\.(pem|key|p12|pfx)$/.test(name))return false;
  if(normalized.startsWith('reports/')&&/\.(json|png|log|txt|sarif)$/.test(name))return false;
  return true;
}
export const containsCredential = text => /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|nfp_[A-Za-z0-9]{20,}/.test(text);
