import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { reportDir } from './qa-helpers.mjs';

const dir=reportDir+'/lighthouse';mkdirSync(dir,{recursive:true});
const url=process.argv[2]||'http://127.0.0.1:4175/tr/';
if(url!=='http://127.0.0.1:4175/tr/'&&!/^https:\/\/(?:deploy-preview-\d+|[0-9a-f]{24})--karaoglugroupnet\.netlify\.app\/tr\/$/.test(url))throw new Error('Only local QA or the verified Karaoglugroupnet preview may be measured');
const result={node:process.version,url,method:'Lighthouse 13.6.0; three cold navigations per profile; default simulated mobile throttling / desktop preset; navigation laboratory data, not field INP. Local server uses uncompressed HTTP; Netlify preview uses its real transfer encoding.',runs:[],failedAttempts:[]};
const cli='node_modules/lighthouse/cli/index.js';
for(const profile of ['mobile','desktop'])for(let sample=1;sample<=3;sample++){
 const path=`${dir}/${profile}-${sample}.json`;
 const flags='--headless=new --disable-gpu --no-first-run --no-default-browser-check'+(process.env.CI?' --no-sandbox --disable-dev-shm-usage':'');
 const args=[cli,result.url,'--output=json','--output-path='+path,'--only-categories=performance,accessibility,best-practices,seo','--chrome-flags='+flags,'--quiet','--no-enable-error-reporting'];if(profile==='desktop')args.push('--preset=desktop');
 let report,exit;
 for(let attempt=1;attempt<=2;attempt++){
   const p=spawnSync(process.execPath,args,{encoding:'utf8',timeout:180000});exit=p.status;
   try{report=JSON.parse(readFileSync(path,'utf8'));}catch{report=null;}
   if(exit===0&&!report?.runtimeError)break;
   result.failedAttempts.push({profile,sample,attempt,exit,error:report?.runtimeError?.code||p.error?.code||'No report'});
   if(report)copyFileSync(path,path.replace('.json',`-failed-${attempt}.json`));
   if(report?.runtimeError?.code!=='NO_NAVSTART'||attempt===2){writeFileSync(dir+'/summary.json',JSON.stringify(result,null,2));throw new Error('Lighthouse run failed; inspect saved diagnostics');}
 }
 const a=report.audits,run={profile,sample,lcpMs:a['largest-contentful-paint'].numericValue,cls:a['cumulative-layout-shift'].numericValue,tbtMs:a['total-blocking-time'].numericValue,transferBytes:a['total-byte-weight'].numericValue,scores:Object.fromEntries(Object.entries(report.categories).map(([key,value])=>[key,value.score]))};result.runs.push(run);console.log(JSON.stringify(run));writeFileSync(dir+'/summary.json',JSON.stringify(result,null,2));
}
const median=values=>[...values].sort((a,b)=>a-b)[1];
result.medians=Object.fromEntries(['mobile','desktop'].map(profile=>{const runs=result.runs.filter(r=>r.profile===profile);return[profile,{lcpMs:median(runs.map(r=>r.lcpMs)),cls:median(runs.map(r=>r.cls)),tbtMs:median(runs.map(r=>r.tbtMs)),transferBytes:median(runs.map(r=>r.transferBytes)),performance:median(runs.map(r=>r.scores.performance))}];}));
writeFileSync(dir+'/summary.json',JSON.stringify(result,null,2));console.log('MEDIANS',JSON.stringify(result.medians));
