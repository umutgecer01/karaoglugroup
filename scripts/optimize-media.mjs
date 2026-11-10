import { readFile, readdir, writeFile } from 'node:fs/promises';
import { browserSession } from './browser-session.mjs';

// Run with the local preview and headless Chrome on port 9222 (see reports).
// Compression/resizing only: originals are retained as fallbacks.
const browser = await browserSession();
// Keep separately imported, nested service images when refreshing root assets.
const manifest = JSON.parse(await readFile('src/data/generatedMedia.json', 'utf8'));
try {
  await browser.send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  for (const name of await readdir('public/images')) {
    if (!/\.(jpe?g|png)$/i.test(name) || name.includes('logo')) continue;
    const source = `/images/${name}`;
    const data = await readFile(`public${source}`);
    const result = await browser.evaluate(`new Promise((resolve, reject) => {
      const image = new Image(); image.onerror = reject;
      image.onload = () => {
        const variants = [...new Set([Math.min(${name === 'automotive-gallery-1.jpg' ? 480 : 640},image.naturalWidth), Math.min(640,image.naturalWidth), Math.min(1408,image.naturalWidth)])].map(width => {
          const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = Math.round(width * image.naturalHeight / image.naturalWidth);
          const context = canvas.getContext('2d'); context.imageSmoothingQuality = 'high'; context.drawImage(image,0,0,canvas.width,canvas.height);
          return { width, height: canvas.height, data: canvas.toDataURL('image/webp',0.86).split(',')[1] };
        });
        resolve({ width:image.naturalWidth, height:image.naturalHeight, variants });
      };
      image.src = 'data:image/jpeg;base64,${data.toString('base64')}';
    })`);
    const variants = [];
    for (const variant of result.variants) {
      const path = `/images/${name.replace(/\.jpe?g$/i,'')}-${variant.width}.webp`;
      const bytes = Buffer.from(variant.data, 'base64');
      await writeFile(`public${path}`, bytes);
      variants.push({ src: path, width: variant.width, height: variant.height, bytes: bytes.length });
    }
    manifest[source] = { width: result.width, height: result.height, originalBytes: data.length, variants };
  }
  await writeFile('src/data/generatedMedia.json', JSON.stringify(manifest, null, 2) + '\n');
  await writeFile('reports/media-after.json', JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Created responsive WebP variants for ${Object.keys(manifest).length} images.`);
} finally { await browser.close(); }
