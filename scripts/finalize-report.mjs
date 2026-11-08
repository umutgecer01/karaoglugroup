import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const performance = JSON.parse(await readFile('reports/performance.json', 'utf8'));
const metric = (profile, stage) => performance.results.find(result => result.profile === profile && result.stage === stage);
const decimal = value => Number(value).toLocaleString('tr-TR', { maximumFractionDigits: 3 });
const kb = value => `${decimal(value / 1000)} kB`;
const transfer = value => value.navigation.transferSize + value.resources.reduce((sum, item) => sum + item.transferBytes, 0);
const mb = metric('mobile', 'before'), ma = metric('mobile', 'after');
const db = metric('desktop', 'before'), da = metric('desktop', 'after');
const bundle = performance.bundles;
const rows = [
  ['Mobil Lighthouse performans puanı', 'N/A', 'N/A'],
  ['Masaüstü Lighthouse performans puanı', 'N/A', 'N/A'],
  ['Mobil LCP (yerel laboratuvar)', `${decimal(mb.lcpMs / 1000)} sn`, `${decimal(ma.lcpMs / 1000)} sn`],
  ['Masaüstü LCP (yerel laboratuvar)', `${decimal(db.lcpMs / 1000)} sn`, `${decimal(da.lcpMs / 1000)} sn`],
  ['Mobil CLS (8 saniye)', decimal(mb.cls), decimal(ma.cls)],
  ['Masaüstü CLS (8 saniye)', decimal(db.cls), decimal(da.cls)],
  ['INP / saha Core Web Vitals', 'N/A', 'N/A'],
  ['Ana JavaScript dosyası', kb(bundle.before.js.bytes), kb(bundle.after.js.bytes)],
  ['Ana JavaScript gzip', kb(bundle.before.js.gzipBytes), kb(bundle.after.js.gzipBytes)],
  ['Ana CSS dosyası', kb(bundle.before.css.bytes), kb(bundle.after.css.bytes)],
  ['Ana CSS gzip', kb(bundle.before.css.gzipBytes), kb(bundle.after.css.gzipBytes)],
  ['Mobil ilk 8 sn encoded HTML + kaynaklar', kb(mb.totalEncodedBytesAt8s), kb(ma.totalEncodedBytesAt8s)],
  ['Masaüstü ilk 8 sn encoded HTML + kaynaklar', kb(db.totalEncodedBytesAt8s), kb(da.totalEncodedBytesAt8s)],
  ['Mobil ilk 8 sn transfer (Performance API)', kb(transfer(mb)), kb(transfer(ma))],
  ['Masaüstü ilk 8 sn transfer (Performance API)', kb(transfer(db)), kb(transfer(da))],
  ['16 görsel / tam boy WebP seti', '2.771,443 kB', '2.184,930 kB'],
  ['16 görsel / mobil WebP seti', '2.771,443 kB', '934,338 kB'],
  ['MP4 dosya boyutu', '3.138,315 kB', '3.138,315 kB (yeniden kodlanmadı)'],
];
const table = `| Metrik | Önce | Sonra |\n| --- | ---: | ---: |\n${rows.map(row => '| ' + row.join(' | ') + ' |').join('\n')}`;
const reportPath = 'reports/PRODUCTION_READINESS_REPORT.md';
const report = await readFile(reportPath, 'utf8');
await writeFile(reportPath, report.replace(/<!-- measured-performance:start -->[\s\S]*?<!-- measured-performance:end -->/, `<!-- measured-performance:start -->\n${table}\n<!-- measured-performance:end -->`));
await writeFile('reports/PERFORMANCE.md', `# Performans karşılaştırması\n\n8 Kasım 2026; son production build üzerinde yerel Chrome ölçümü.\n\n| Metrik | Önce | Sonra |\n| --- | ---: | ---: |\n${rows.map(row => '| ' + row.join(' | ') + ' |').join('\n')}\n\nTek koşu/profil, 150 ms gecikme, 1.6 Mbps, 4× CPU, DPR 1; gizlilik tercihi önceden kayıtlı, soğuk cache, 8 saniye gözlem. Hedef URL'ler eski root ile güncel /tr/ sayfasıdır. Bu bir Lighthouse veya alan ölçümü değildir. Yerel HTTP yanıtları CDN sıkıştırmasını temsil etmez. Kaynak transfer toplamı yalnızca gözlem penceresindeki istekleri içerir; bütün sitenin indirmesi değildir.\n\nAna JavaScript dosyası hata kurtarma, URL ve metadata altyapısı nedeniyle büyüdü; CSS küçüldü. Fotoğraf varyantlarının tamamı tek sayfada indirilmez. JPEG yedekleri tutulduğu için depo toplamında boyut azalması iddia edilmiyor. Video dosyası küçülmedi; etkileşim öncesi indirme engellendi. [Ham ölçümler](performance.json).\n`);

const before = JSON.parse((await readFile('reports/initial-file-inventory.json', 'utf8')).replace(/^\ufeff/, ''));
const walk = async directory => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(`${directory}/${entry.name}`) : `${directory}/${entry.name}`))).flat();
const changes = [];
for (const path of [...await walk('src'), ...await walk('scripts'), ...await walk('public')]) {
  const data = await readFile(path);
  const original = before.find(item => item.Path.replaceAll('\\', '/') === path);
  if (!original || original.Hash !== createHash('sha256').update(data).digest('hex').toUpperCase()) changes.push({ path, change: original ? 'modified' : 'added', bytes: data.length });
}
for (const path of ['.gitignore', '.env.example', 'index.html', 'package.json', 'site.config.mjs', 'netlify.toml', 'eslint.config.js', 'README.md']) changes.push({ path, change: path === '.env.example' ? 'added' : 'modified', bytes: (await readFile(path)).length });
await writeFile('reports/changed-files.json', JSON.stringify(changes, null, 2));
console.log(`Finalized performance table and ${changes.length} source/config/media changes.`);
