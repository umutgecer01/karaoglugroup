import { createServer } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { SITE_URL } from '../site.config.mjs';
import { pagePath, pagePaths } from '../src/utils/routes.js';
import { pageMetadata } from '../src/utils/metadata.js';
import { tr } from '../src/data/translations/tr.js';
import { en } from '../src/data/translations/en.js';
import { ar } from '../src/data/translations/ar.js';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const template = await readFile('dist/index.html', 'utf8');
const previewBuild = ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  let count = 0;
  for (const [language, content] of Object.entries({ tr, en, ar })) {
    for (const view of [...Object.keys(pagePaths), 'not-found']) {
      const meta = pageMetadata(view, language, content, SITE_URL, previewBuild);
      const markup = await render({ view, language }, content);
      if (markup.includes('<script') || markup.includes('/src/')) throw new Error(`Non-static markup in ${view}/${language}`);
      let html = template.replace('<html lang="tr">', `<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">`)
        .replace('<div id="root"></div>', `<div id="root" data-ssr="true">${markup}</div>`)
        .replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`)
        .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escape(meta.canonical)}" />`);
      for (const [attribute, key, value] of [
        ['name', 'description', meta.description], ['name', 'robots', meta.robots], ['name', 'googlebot', meta.robots],
        ['property', 'og:title', meta.title], ['property', 'og:description', meta.description],
        ['property', 'og:url', meta.canonical], ['property', 'og:locale', meta.locale],
        ['name', 'twitter:title', meta.title], ['name', 'twitter:description', meta.description],
      ]) html = html.replace(new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
      const alternates = [...meta.alternates, { lang: 'x-default', href: meta.alternates[0].href }];
      if (view === 'home') {
        html = html.replace('<script type="module" crossorigin ', '<script type="module" crossorigin fetchpriority="low" ');
        // Load only the visible poster; the MP4 stays absent until the user presses play.
        html = html.replace('</head>', '<link rel="preload" as="image" type="image/webp" href="/images/fleet-rental-video-poster-1280.webp" fetchpriority="high" />\n</head>');
      }
      html = html.replace(/<p id="startup-error"[\s\S]*?<\/p>/, `<p id="startup-error" hidden role="alert">${escape(content.ui.loadError)} <a href="">${escape(content.ui.reload)}</a></p>`);
      const noScript = { tr: 'Etkileşimli menüler için JavaScript gereklidir.', en: 'JavaScript is required for interactive menus.', ar: 'يلزم تفعيل جافاسكريبت لاستخدام القوائم التفاعلية.' };
      html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript>${noScript[language]} <a href="${pagePath('contact', language)}">${escape(content.nav.contact)}</a></noscript>`);
      html = html.replace('</head>', `${alternates.map(({ lang, href }) => `<link rel="alternate" hreflang="${lang}" href="${escape(href)}" />`).join('\n')}\n</head>`);
      const output = `dist${pagePath(view, language)}index.html`;
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, html);
      if (view === 'home' && language === 'tr') await writeFile('dist/index.html', html);
      if (view === 'not-found' && language === 'tr') await writeFile('dist/404.html', html);
      count++;
    }
  }
  if (previewBuild) {
    // Include every configured header so the preview-only file retains the
    // same security/cache policies regardless of header-source precedence.
    const config = await readFile('netlify.toml', 'utf8');
    const blocks = [...config.matchAll(/\[\[headers\]\]([\s\S]*?)(?=\[\[|$)/g)];
    const headers = blocks.map(([, block]) => {
      const path = block.match(/for\s*=\s*"([^"]+)"/)[1];
      const body = block.split('[headers.values]')[1];
      const values = [...body.matchAll(/^\s*([\w-]+)\s*=\s*"([^"\r\n]*)"\s*$/gm)].map(([, name, value]) => `  ${name}: ${value}`);
      if (path === '/*') values.push('  X-Robots-Tag: noindex, nofollow, nosnippet');
      return `${path}\n${values.join('\n')}`;
    });
    await writeFile('dist/_headers', headers.join('\n\n') + '\n');
  }
  console.log(`Prerendered ${count} localized pages, root and 404.html. Preview noindex: ${previewBuild}.`);
} finally { await server.close(); }
