import { readFile, readdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { browserSession, pause } from './browser-session.mjs';

const results = [];
for (const profile of ['mobile', 'desktop']) for (const stage of ['before', 'after']) {
  const b = await browserSession();
  try {
    await b.send('Network.setCacheDisabled', { cacheDisabled: true });
    await b.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
    await b.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await b.send('Emulation.setDeviceMetricsOverride', { width: profile === 'mobile' ? 390 : 1440, height: profile === 'mobile' ? 844 : 1000, deviceScaleFactor: 1, mobile: profile === 'mobile' });
    await b.send('Page.addScriptToEvaluateOnNewDocument', { source: `localStorage.setItem('karaoglu-privacy-consent','1');localStorage.setItem('karaoglu-language','tr');window.__qa={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__qa.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__qa.cls+=e.value}).observe({type:'layout-shift',buffered:true});` });
    await b.send('Page.navigate', { url: stage === 'before' ? 'http://127.0.0.1:4176/' : 'http://127.0.0.1:4175/tr/' });
    await pause(8000);
    const measurement = await b.evaluate(`({lcpMs:window.__qa.lcp,cls:window.__qa.cls,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.encodedBodySize,transferBytes:r.transferSize})),navigation:performance.getEntriesByType('navigation')[0].toJSON()})`);
    const total = measurement.resources.reduce((sum, r) => sum + r.bytes, measurement.navigation.encodedBodySize);
    results.push({ profile, stage, measuredAt: new Date().toISOString(), ...measurement, totalEncodedBytesAt8s: total });
    console.log(profile, stage, 'LCP', measurement.lcpMs, 'CLS', measurement.cls, 'encoded bytes', total);
  } finally { await b.close(); }
}
const bundles = {};
for (const [stage, directory] of [['before', '.audit/baseline-dist/assets'], ['after', 'dist/assets']]) {
  const files = await readdir(directory);
  bundles[stage] = {};
  for (const extension of ['js', 'css']) {
    const name = files.find(file => new RegExp(`^index-.*\\.${extension}$`).test(file));
    const data = await readFile(`${directory}/${name}`);
    bundles[stage][extension] = { name, bytes: data.length, gzipBytes: gzipSync(data).length };
  }
}
await writeFile('reports/performance.json', JSON.stringify({ method: 'Local Chrome CDP, one cold-cache run per case, 150ms latency, 1.6Mbps download, CPU 4x, DPR 1, 8-second window; privacy preference pre-set. No Lighthouse score or field INP.', results, bundles }, null, 2));
