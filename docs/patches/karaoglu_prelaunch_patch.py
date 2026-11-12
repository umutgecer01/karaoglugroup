#!/usr/bin/env python3
"""Prepare Karaoglu Group prelaunch code changes without touching production.

Use:
  python karaoglu_prelaunch_patch.py --check   # validate changes, no writes
  python karaoglu_prelaunch_patch.py --apply   # only on feature/* Git branch
"""
from __future__ import annotations

import argparse
import re
import subprocess
from pathlib import Path

ROOT = Path.cwd()
pending: dict[str, str] = {}
created: set[str] = set()

def load(path: str) -> str:
    if path in pending:
        return pending[path]
    target = ROOT / path
    if not target.is_file():
        raise RuntimeError(f"Required source file missing: {path}")
    return target.read_text(encoding="utf-8-sig")

def substitute(path: str, old: str, new: str, *, count: int = 1) -> None:
    source = load(path)
    actual = source.count(old)
    if actual != count:
        raise RuntimeError(f"{path}: expected {count} occurrence(s); found {actual}: {old[:100]!r}")
    pending[path] = source.replace(old, new)

def create(path: str, content: str) -> None:
    if (ROOT / path).exists():
        raise RuntimeError(f"New file already exists: {path} (do not overwrite)")
    if path in pending:
        raise RuntimeError(f"Duplicate new file: {path}")
    pending[path] = content
    created.add(path)

# 1. Independent, fail-closed form activation.
form_module = "src/utils/netlifyForms.js"
substitute(
    form_module,
    "export const formsEnabled = import.meta.env?.VITE_NETLIFY_FORMS_ENABLED === 'true';",
    """// The global gate remains mandatory. Both form types require separate explicit approval.
export function resolveFormFlags(env = {}) {
  const master = env?.VITE_NETLIFY_FORMS_ENABLED === 'true';
  return {
    contact: master && env?.VITE_CONTACT_FORMS_ENABLED === 'true',
    career: master && env?.VITE_CAREER_FORMS_ENABLED === 'true',
  };
}
const activation = resolveFormFlags(import.meta.env);
export const contactFormsEnabled = activation.contact;
export const careerFormsEnabled = activation.career;
// Backwards compatible aggregate used by the existing production-disabled test.
export const formsEnabled = contactFormsEnabled || careerFormsEnabled;

export function isFormNameEnabled(name, flags = activation) {
  if (name === CONTACT_FORM_NAME) return flags.contact === true;
  if (name === CAREER_FORM_NAME) return flags.career === true;
  return false;
}"""
)
substitute(
    form_module,
    "  const formData = new FormData(form);\n  if (formData.get('bot-field'))",
    """  const formData = new FormData(form);
  if (!isFormNameEnabled(formData.get('form-name'))) {
    throw new Error('This form type is not enabled for submissions.');
  }
  if (formData.get('bot-field'))"""
)
for component, enabled in (
    ("src/components/Contact.jsx", "contactFormsEnabled"),
    ("src/components/QuickContact.jsx", "contactFormsEnabled"),
    ("src/components/Career.jsx", "careerFormsEnabled"),
):
    source = load(component)
    if "formsEnabled" not in source:
        raise RuntimeError(f"Expected form switch in {component}")
    pending[component] = re.sub(r"\bformsEnabled\b", enabled, source)

# 2. Safety defaults remain disabled in all deployed builds.
substitute(
    "netlify.toml",
    '  VITE_NETLIFY_FORMS_ENABLED = "false"\n',
    '  VITE_NETLIFY_FORMS_ENABLED = "false"\n'
    '  VITE_CONTACT_FORMS_ENABLED = "false"\n'
    '  VITE_CAREER_FORMS_ENABLED = "false"\n'
)
substitute(
    ".env.example",
    "VITE_NETLIFY_FORMS_ENABLED=false\n",
    "VITE_NETLIFY_FORMS_ENABLED=false\n"
    "VITE_CONTACT_FORMS_ENABLED=false\n"
    "VITE_CAREER_FORMS_ENABLED=false\n"
    "# Proposed future domain (do not switch until owned and verified): karaoglugroupglobal.com\n"
)

# 3. Local test-only POST mock still exercises BOTH form types, no real POST.
substitute(
    ".github/workflows/browser-qa.yml",
    "VITE_NETLIFY_FORMS_ENABLED=true nohup node node_modules/vite/bin/vite.js",
    "VITE_NETLIFY_FORMS_ENABLED=true VITE_CONTACT_FORMS_ENABLED=true VITE_CAREER_FORMS_ENABLED=true nohup node node_modules/vite/bin/vite.js"
)
ps = "scripts/run-local-qa.ps1"
substitute(
    ps, "$previousForms=$env:VITE_NETLIFY_FORMS_ENABLED\n",
    "$previousForms=$env:VITE_NETLIFY_FORMS_ENABLED\n"
    "$previousContactForms=$env:VITE_CONTACT_FORMS_ENABLED\n"
    "$previousCareerForms=$env:VITE_CAREER_FORMS_ENABLED\n"
)
substitute(
    ps,
    "$env:VITE_NETLIFY_FORMS_ENABLED='false';$env:CONTEXT='production';$env:CHROME_PATH=$qaBrowser",
    "$env:VITE_NETLIFY_FORMS_ENABLED='false';$env:VITE_CONTACT_FORMS_ENABLED='false';"
    "$env:VITE_CAREER_FORMS_ENABLED='false';$env:CONTEXT='production';$env:CHROME_PATH=$qaBrowser"
)
substitute(
    ps,
    "$env:VITE_NETLIFY_FORMS_ENABLED='true'\n  $ownedProcesses+=",
    "$env:VITE_NETLIFY_FORMS_ENABLED='true'\n"
    "  $env:VITE_CONTACT_FORMS_ENABLED='true'\n"
    "  $env:VITE_CAREER_FORMS_ENABLED='true'\n"
    "  $ownedProcesses+="
)
substitute(
    ps,
    "$env:VITE_NETLIFY_FORMS_ENABLED='false';WaitReady",
    "$env:VITE_NETLIFY_FORMS_ENABLED='false';"
    "$env:VITE_CONTACT_FORMS_ENABLED='false';"
    "$env:VITE_CAREER_FORMS_ENABLED='false';WaitReady"
)
substitute(
    ps,
    "$env:VITE_NETLIFY_FORMS_ENABLED=$previousForms;$env:CONTEXT=$previousContext;",
    "$env:VITE_NETLIFY_FORMS_ENABLED=$previousForms;"
    "$env:VITE_CONTACT_FORMS_ENABLED=$previousContactForms;"
    "$env:VITE_CAREER_FORMS_ENABLED=$previousCareerForms;"
    "$env:CONTEXT=$previousContext;"
)

# 4. Tests: domain works from one build-time base URL; default stays unchanged.
testfile = "scripts/release-static.test.mjs"
substitute(
    testfile,
    "import { decodeHtmlEntities as unescape } from './html-entities.mjs';",
    "import { decodeHtmlEntities as unescape } from './html-entities.mjs';\n"
    "import { SITE_URL } from '../site.config.mjs';"
)
substitute(
    testfile,
    "const expected = pageMetadata(view, language, content, undefined, ['deploy-preview','branch-deploy'].includes(process.env.CONTEXT));",
    "const expected = pageMetadata(view, language, content, SITE_URL, ['deploy-preview','branch-deploy'].includes(process.env.CONTEXT));"
)
substitute(
    testfile,
    "https://karaoglugroupnet.netlify.app${pagePath(view, language)}",
    "${SITE_URL.replace(/\\/$/, '')}${pagePath(view, language)}"
)
substitute(
    testfile,
    "  assert.match(await readFile('dist/robots.txt', 'utf8'), /Sitemap: https:\\/\\/karaoglugroupnet.netlify.app\\/sitemap.xml/);",
    "  assert.ok((await readFile('dist/robots.txt', 'utf8')).includes(`Sitemap: ${SITE_URL}sitemap.xml`));"
)
substitute(
    testfile,
    '  assert.match(await readFile(\'netlify.toml\', \'utf8\'), /VITE_NETLIFY_FORMS_ENABLED = "false"/);',
    """  const config = await readFile('netlify.toml', 'utf8');
  for (const key of ['VITE_NETLIFY_FORMS_ENABLED', 'VITE_CONTACT_FORMS_ENABLED', 'VITE_CAREER_FORMS_ENABLED']) {
    assert.ok(config.includes(`${key} = "false"`), `${key} must default to false`);
  }"""
)
tests = "scripts/forms-readiness.test.mjs"
substitute(
    tests,
    "import { cvValidationError, isAllowedCvFile, MAX_CV_SIZE_BYTES } from '../src/utils/netlifyForms.js';",
    """import {
  cvValidationError, isAllowedCvFile, MAX_CV_SIZE_BYTES,
  resolveFormFlags, isFormNameEnabled, CONTACT_FORM_NAME, CAREER_FORM_NAME,
} from '../src/utils/netlifyForms.js';"""
)
pending[tests] += """
test('forms stay closed unless global and per-form switches are explicitly true', () => {
  const off = resolveFormFlags({});
  assert.deepEqual(off, { contact: false, career: false });
  assert.deepEqual(resolveFormFlags({
    VITE_NETLIFY_FORMS_ENABLED: 'true',
  }), off);
  const contactOnly = resolveFormFlags({
    VITE_NETLIFY_FORMS_ENABLED: 'true',
    VITE_CONTACT_FORMS_ENABLED: 'true',
    VITE_CAREER_FORMS_ENABLED: 'false',
  });
  assert.deepEqual(contactOnly, { contact: true, career: false });
  assert.equal(isFormNameEnabled(CONTACT_FORM_NAME, contactOnly), true);
  assert.equal(isFormNameEnabled(CAREER_FORM_NAME, contactOnly), false);
  assert.equal(isFormNameEnabled('unexpected-form', contactOnly), false);
  const careerOnly = resolveFormFlags({
    VITE_NETLIFY_FORMS_ENABLED: 'true',
    VITE_CONTACT_FORMS_ENABLED: 'false',
    VITE_CAREER_FORMS_ENABLED: 'true',
  });
  assert.deepEqual(careerOnly, { contact: false, career: true });
  assert.deepEqual(resolveFormFlags({
    VITE_NETLIFY_FORMS_ENABLED: 'false',
    VITE_CONTACT_FORMS_ENABLED: 'true',
    VITE_CAREER_FORMS_ENABLED: 'true',
  }), off);
});
"""

# 5. Confirmed-only reference data. UI preserves existing generic cards until approval.
create("src/data/approvedReferences.js", """// Publish only company-verified references with permission from the rights holder.
// Example schema (DO NOT add invented companies):
// { id, name, sector: { tr, en, ar }, description: { tr, en, ar },
//   logoSrc: '/images/approved-reference.webp', verified: true, publicationApproved: true }
// Assets must be owned or licensed by the business.
export const approvedReferences = [];

function isLocalLogo(path) {
  if (typeof path !== 'string' || path.length > 240 || !path.startsWith('/images/')) return false;
  const segments = path.slice('/images/'.length).split('/');
  const filename = segments.pop();
  return /^[a-z0-9_-]+\\.(?:avif|webp|jpe?g|png)$/i.test(filename) &&
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
""")
portfolio = "src/components/VehiclePortfolio.jsx"
substitute(
    portfolio,
    'import { company } from "../data/company.js";',
    'import { company } from "../data/company.js";\n'
    'import { publishableReferences } from "../data/approvedReferences.js";'
)
substitute(
    portfolio,
    "  const items = t?.portfolio?.items || [];",
    "  const items = t?.portfolio?.items || [];\n"
    "  const references = publishableReferences();"
)
substitute(
    portfolio,
    '        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">',
    """        {references.length > 0 && (
          <section className="mt-12" aria-label={t.portfolio.approvedTitle}>
            <h2 className="text-center text-2xl font-semibold text-white">{t.portfolio.approvedTitle}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {references.map(reference => (
                <article key={reference.id} className="premium-card flex h-full flex-col gap-3 p-6">
                  {reference.logoSrc && <img src={reference.logoSrc} alt={reference.name}
                    width="160" height="64" className="h-16 max-w-full object-contain object-left" loading="lazy" decoding="async" />}
                  <h3 className="text-xl font-semibold text-white">{reference.name}</h3>
                  <p className="text-sm font-medium text-amber">{reference.sector?.[t.ui.locale] || ''}</p>
                  <p className="text-sm leading-7 text-steel">{reference.description?.[t.ui.locale] || ''}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">"""
)
for lang, value in (("tr", "Doğrulanmış Referanslar"), ("en", "Verified References"), ("ar", "مراجع موثقة")):
    path = f"src/data/translations/{lang}.js"
    substitute(
        path,
        '  "portfolio": {\n',
        f'  "portfolio": {{\n    "approvedTitle": "{value}",\n',
    count=1,
    )
create("scripts/references-readiness.test.mjs", """import test from 'node:test';
import assert from 'node:assert/strict';
import { approvedReferences, publishableReferences } from '../src/data/approvedReferences.js';

test('no unapproved real-world references are presented by default', () => {
  assert.deepEqual(approvedReferences, []);
  assert.deepEqual(publishableReferences(), []);
  assert.deepEqual(publishableReferences([
    { id: 'a', name: 'Fictional', verified: false, publicationApproved: true },
    { id: 'b', name: 'Fictional', verified: true, publicationApproved: false },
  ]), []);
});
test('references require approval, identity and safe local image paths', () => {
  const verified = {id:'approved-test', name:'TEST ONLY', verified:true, publicationApproved:true};
  assert.equal(publishableReferences([verified]).length, 1);
  assert.deepEqual(publishableReferences([{...verified, logoSrc:'https://example.test/remote.svg'}]), []);
  assert.deepEqual(publishableReferences([{...verified, logoSrc:'/images/example.webp'}]).length, 1);
});
""")
substitute(
    "package.json",
    "scripts/forms-readiness.test.mjs scripts/motion-preference.test.mjs",
    "scripts/forms-readiness.test.mjs scripts/references-readiness.test.mjs scripts/motion-preference.test.mjs"
)

# 6. Prepare conditional company email; do not show an address before mailbox exists.
company = "src/data/company.js"
substitute(
    company,
    '  phoneHref: "tel:+905444438000",',
    """  phoneHref: "tel:+905444438000",
  // Add the verified Google Workspace mailbox only after it can send and receive.
  email: null,
  emailHref: null,"""
)
contact = "src/components/Contact.jsx"
substitute(
    contact,
    "MapPin, MessageCircle, Phone, Send, Store",
    "MapPin, MessageCircle, Mail, Phone, Send, Store"
)
substitute(
    contact,
    '                <ContactLine icon={Phone} label={t.contact.phone} value={company.phone} href={company.phoneHref} />',
    """                <ContactLine icon={Phone} label={t.contact.phone} value={company.phone} href={company.phoneHref} />
                {company.email && company.emailHref && (
                  <ContactLine icon={Mail} label={t.contact.form.email} value={company.email} href={company.emailHref} />
                )}"""
)
footer = "src/components/Footer.jsx"
substitute(
    footer,
    'Facebook, Instagram, MapPin, Phone',
    'Facebook, Instagram, Mail, MapPin, Phone'
)
substitute(
    footer,
    '            <div className="flex items-start gap-3">\n              <MapPin',
    """            {company.email && company.emailHref && (
              <a href={company.emailHref} className="flex items-center gap-3 transition hover:text-gold">
                <Mail size={16} className="text-gold" />
                <span>{company.email}</span>
              </a>
            )}
            <div className="flex items-start gap-3">
              <MapPin"""
)

# 7. Explain everything that intentionally remains outside this code patch.
create("docs/PRELAUNCH_HANDOFF_2026-11-12.md", """# Karaoğlu Grup — Yayın öncesi hazırlık (kod değişiklikleri)

Bu değişiklikler **canlı siteyi yayımlamaz**; `main` üzerinde uygulanmamalıdır.
Önce `feature/*` dalında inceleme ve CI/test, sonra açık yayın onayı gerekir.

## Hazırlananlar

- İletişim / teklif ile kariyer başvuruları ayrı etkinleştirme düğmelerine ayrıldı.
- Ana `VITE_NETLIFY_FORMS_ENABLED` kontrolü zorunlu ve kapalı kaldı.
- `VITE_CONTACT_FORMS_ENABLED` ve `VITE_CAREER_FORMS_ENABLED` varsayılan `false`.
- Kod gerçek gönderimi ancak ilgili iki bayrak birlikte açıkken kabul eder.
- Otomatik QA'nın sadece localhost üzerinde test ettiği mock formlar her iki bayrakla açılır.
- Sitemap ve robots testleri `SITE_URL` değişkeni üzerinden çalışır.
- Onaylı referanslar için boş, izin kontrolü olan veri modeli ve görünüm eklendi.
- Şirket e-postası alanı **boş**; doğrulanmadan yanlış adres yayımlanmaz.
- Canlı URL, Netlify proje kimliği, production workflow kilidi ve yayın politikası değişmedi.

## Şirket / hesap onayı gerektirenler

1. `karaoglugroupglobal.com` satın alma, sahiplik kanıtı, Cloudflare DNS ve Netlify custom-domain/HTTPS.
2. Google Workspace şirket hesabı, MX/TXT/SPF/DKIM/DMARC ve çalışan kurumsal gelen kutusu.
3. İletişim formu bildirim alıcısının ve gerçek teslimatın şirketçe doğrulanması.
4. CV özel erişim, dosya güvenliği, saklama/silme, KVKK aydınlatma ve onay.
5. Referans gösterilecek firma/proje isimleri ile logo/fotoğraf yayın izinleri.
6. 1993, 1000+ ve diğer kurumsal iddiaların şirket kayıtlarıyla teyidi.
7. GitHub production environment, yetkili reviewer, secret ve PR incelemesi.
8. Canlı domain değişimi ve yayın için ayrı açık yetki.

## Gelecekte domain geçişi

Alan adı satın alınıp DNS ve HTTPS doğrulandıktan sonra `VITE_SITE_URL`
`https://karaoglugroupglobal.com/` yapılmalı; domain bazlı testler, sitemap,
canonical, OG ve robots ayrı build'de doğrulanmalı. `production-policy.mjs`,
`netlify-deploy.yml`, deployment raporları ve Netlify ayarları birlikte
kontrollü biçimde güncellenmeli. **Bu yamada canlı varsayılan URL değişmez.**

## Gelecekte iletişim formu açılması

İletişim için ana kapı ve CONTACT bayrağı ayrı onayla açılırken CAREER=false
kalmalı. Mevcut production yayın politikası formların tümü kapalı olmasını
zorunlu kılıyor; yeni gönderim açma kararı verildiğinde bu kapı da ayrı
incelemeli, testli ve onaylı bir değişiklikle güncellenmelidir.
Tarayıcı bayrakları server-side erişim kontrolü değildir.
Netlify Forms endpoint erişimi ve veri koruması ayrıca değerlendirilmelidir.

## Kontroller

- `npm ci`
- `npm test`
- `npm run security:check`
- `npm run build`
- `node --test scripts/release-static.test.mjs`
- `npm run qa:windows` (Windows + Node 22 + Chrome/Edge)

Bu çalışmada gerçek mesaj/CV gönderilmez; production yayını yapılmaz.
""")

# Check-mode and feature-branch-only application.
parser = argparse.ArgumentParser()
action = parser.add_mutually_exclusive_group(required=True)
action.add_argument('--check', action='store_true', help='Check match counts and proposed files only.')
action.add_argument('--apply', action='store_true', help='Write only when on a feature/* branch.')
args = parser.parse_args()

if args.apply:
    result = subprocess.run(
        ["git", "branch", "--show-current"], cwd=ROOT, capture_output=True, text=True
    )
    branch = result.stdout.strip() if result.returncode == 0 else ""
    if not branch.startswith("feature/"):
        raise SystemExit(f"Safety stop: --apply requires an existing feature/* branch; current={branch!r}")
    head = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True)
    if head.returncode != 0 or head.stdout.strip() != "296af1a413e1e9c1739f11311e88b4cbcb68d7cb":
        raise SystemExit("Safety stop: this one-time migration requires the reviewed release commit 296af1a.")
    # Verify tree without overwriting local uncommitted edits.
    status = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT, capture_output=True, text=True)
    if status.returncode != 0 or (status.stdout.strip() and
            any(line != "?? karaoglu_prelaunch_patch.py" for line in status.stdout.splitlines())):
        raise SystemExit("Safety stop: working tree has unrelated changes; commit or stash them first.")
    for p, text in pending.items():
        dest = ROOT / p
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(text, encoding="utf-8")
    print(f"Applied {len(pending)} files on branch {branch}. Nothing committed or published.")
else:
    print(f"Ready to change {len(pending)} files (including {len(created)} new files):")
    for p in pending:
        print("  + " if p in created else "  ~ ", p)
    print("No files written. Run --apply only on a clean feature/* Git branch.")
