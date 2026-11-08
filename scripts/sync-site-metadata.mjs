import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pagePaths, pagePath } from '../src/utils/routes.js';
import { SITE_URL } from "../site.config.mjs";

const rootDir = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));

const files = [
  {
    path: new URL("../public/robots.txt", import.meta.url),
    content: `User-agent: *
Allow: /

Sitemap: ${SITE_URL}sitemap.xml
`,
  },
  {
    path: new URL("../public/sitemap.xml", import.meta.url),
    content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.keys(pagePaths).flatMap(view => ['tr', 'en', 'ar'].map(lang => '  <url>\n    <loc>' + new URL(pagePath(view, lang), SITE_URL).href + '</loc>\n' + ['tr', 'en', 'ar', 'x-default'].map(alternate => '    <xhtml:link rel="alternate" hreflang="' + alternate + '" href="' + new URL(pagePath(view, alternate === 'x-default' ? 'tr' : alternate), SITE_URL).href + '" />').join('\n') + '\n  </url>')).join('\n')}
</urlset>
`,
  },
];

await Promise.all(
  files.map(async ({ path, content }) => {
    await mkdir(dirname(fileURLToPath(path)), { recursive: true });
    await writeFile(path, content, "utf8");
  }),
);

console.log(`Synced public metadata for ${SITE_URL} in ${rootDir}`);

