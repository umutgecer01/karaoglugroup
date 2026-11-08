import { writeFile } from 'node:fs/promises';
import { browserSession, pause } from './browser-session.mjs';
const stage = process.argv[2] || 'after';
const port = Number(process.argv[3] || 4175);
const samples = Number(process.argv[4] || 3);
const results = [];
for (const profile of ['mobile', 'desktop']) for (let sample = 1; sample <= samples; sample++) {
  const b = await browserSession();
  try {
    await b.send('Network.setCacheDisabled', { cacheDisabled: true });
    await b.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
    await b.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await b.send('Emulation.setDeviceMetricsOverride', { width: profile === 'mobile' ? 390 : 1440, height: profile === 'mobile' ? 844 : 1000, deviceScaleFactor: 1, mobile: profile === 'mobile' });
    await b.send('Page.addScriptToEvaluateOnNewDocument', { source: `localStorage.setItem('karaoglu-privacy-consent','1');localStorage.setItem('karaoglu-language','tr');window.__qa={lcp:[],cls:0,longTasks:[]};new PerformanceObserver(l=>{for(const e of l.getEntries())__qa.lcp.push({time:e.startTime,loadTime:e.loadTime,renderTime:e.renderTime,size:e.size,url:e.url,element:e.element?.outerHTML.slice(0,800)})}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)__qa.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())__qa.longTasks.push({time:e.startTime,duration:e.duration})}).observe({type:'longtask',buffered:true});` });
    await b.send('Page.navigate', { url: `http://127.0.0.1:${port}/tr/` });
    await pause(8000);
    const data = await b.evaluate(`({...__qa,fonts:{status:document.fonts.status,faces:[...document.fonts].length,computed:getComputedStyle(document.querySelector('h1')).fontFamily},resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.encodedBodySize,transfer:r.transferSize,start:r.startTime,end:r.responseEnd,type:r.initiatorType})),navigation:performance.getEntriesByType('navigation')[0].toJSON(),images:[...document.querySelectorAll('.hero-image-frame img')].map(i=>({src:i.currentSrc,priority:i.fetchPriority,loading:i.loading,width:i.clientWidth,height:i.clientHeight}))})`);
    results.push({ profile, sample, ...data, lcpMs: data.lcp.at(-1)?.time || null });
    console.log(stage, profile, sample, results.at(-1).lcpMs, data.lcp.at(-1)?.element?.slice(0,100));
  } finally { await b.close(); }
}
const median = values => [...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const summary = Object.fromEntries(['mobile','desktop'].map(profile=>[profile,{lcpMs:median(results.filter(r=>r.profile===profile).map(r=>r.lcpMs)),cls:median(results.filter(r=>r.profile===profile).map(r=>r.cls))}]));
await writeFile(`reports/final-release/performance-${stage}.json`, JSON.stringify({stage,method:'3 runs per profile; 150ms latency, 1.6Mbps, CPU 4x, DPR 1, cold HTTP cache; 8s observation; cookie preference already set; local uncompressed HTTP; not Lighthouse/field INP.',summary,results},null,2));
console.log(JSON.stringify(summary));
