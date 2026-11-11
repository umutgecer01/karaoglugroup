import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { browserSession, pause } from './browser-session.mjs';
import { reportDir, prepareReports, navigate, dismissPrivacy } from './qa-helpers.mjs';
import { pagePath } from '../src/utils/routes.js';

const stage = process.argv[2] || 'after';
const widths = [320,360,375,390,414,430,480,768,1440];
const result = { stage, widths, checks: [], cvErrorCases: [], issues: [], realSubmissions: 0, keyboardHardwareTest: false };
await prepareReports();
const b = await browserSession();
const save = () => writeFile(`${reportDir}/mobile-forms-${stage}.json`, JSON.stringify(result,null,2));
try {
  await dismissPrivacy(b);
  for (const lang of ['tr','en','ar']) for (const kind of ['career','contact','quick']) {
    const selector = kind==='career'?'.career-form-panel':kind==='contact'?'.contact-form-panel':'.quick-contact-form';
    await navigate(b,pagePath(kind==='quick'?'home':kind,lang));
    await b.call(selector => {
      const panel=document.querySelector(selector),form=panel.querySelector('form');
      // Synthetic, in-memory data only. Validation returns before any submit transport.
      if(form.elements.cv){const dt=new DataTransfer();dt.items.add(new File(['QA fixture only'],'QA_'+ 'very-long-file-name-'.repeat(12)+'.pdf',{type:'application/pdf'}));form.elements.cv.files=dt.files;form.elements.cv.dispatchEvent(new Event('change',{bubbles:true}));}
      form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    },selector);
    await pause(120);
    for(const width of widths){
      await b.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
      await b.call(s=>document.querySelector(s).scrollIntoView({block:'start',behavior:'instant'}),selector);await pause(80);
      const state=await b.call(selector=>{
        const p=document.querySelector(selector),f=p.querySelector('form'),rect=p.getBoundingClientRect();
        const controls=[...f.querySelectorAll('input:not([type=hidden]),select,textarea,button[type=submit]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none');
        const escaped=[p,...p.querySelectorAll('*')].filter(e=>e.getClientRects().length&&getComputedStyle(e).position!=='absolute').filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>rect.right+1||r.left<rect.left-1);}).map(e=>({tag:e.tagName,class:e.className,name:e.name,width:e.clientWidth,scroll:e.scrollWidth}));
        const columns=[...f.querySelectorAll('.form-field')].slice(0,2).map(e=>e.getBoundingClientRect());
        return {viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,panel:{left:rect.left,right:rect.right,width:rect.width},escaped,minimumControlWidth:Math.min(...controls.filter(e=>e.type!=='checkbox').map(e=>e.clientWidth)),singleColumn:columns.length<2||Math.abs(columns[0].left-columns[1].left)<1,errors:f.querySelectorAll('[aria-invalid=true]').length,disabled:f.querySelector('[type=submit]').disabled,cvName:p.querySelector('input[type=file]')?.files[0]?.name};
      },selector);
      const issues=[];
      if(state.overflow)issues.push('page overflow');if(state.escaped.length)issues.push('content escapes card');if(state.panel.left<0||state.panel.right>width+1)issues.push('card outside viewport');
      if(width<768&&!state.singleColumn)issues.push('mobile columns');if(width<768&&state.panel.width<width-64)issues.push('mobile card squeezed');if(!state.disabled)issues.push('forms unexpectedly active');
      const record={lang,kind,width,...state};result.checks.push(record);if(issues.length)result.issues.push({lang,kind,width,issues,escaped:state.escaped});
      if([320,768,1440].includes(width))await writeFile(`${reportDir}/${stage}-${lang}-${kind}-${width}.png`,Buffer.from((await b.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
    }
    if(kind==='career'&&stage!=='before'){
      await b.send('Emulation.setDeviceMetricsOverride',{width:320,height:900,deviceScaleFactor:1,mobile:true});
      await b.call(()=>{const f=document.querySelector('.career-form-panel form'),dt=new DataTransfer();dt.items.add(new File(['synthetic invalid extension'],'QA_'+ 'very-long-'.repeat(20)+'.exe'));f.elements.cv.files=dt.files;f.elements.cv.dispatchEvent(new Event('change',{bubbles:true}));f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});await pause(120);
      await b.call(()=>document.querySelector('#career-cv').scrollIntoView({block:'center',behavior:'instant'}));
      const cv=await b.call(()=>{const i=document.querySelector('#career-cv'),error=document.querySelector('#career-cv-error'),p=i.closest('.career-form-panel').getBoundingClientRect(),r=i.getBoundingClientRect();return{invalid:i.getAttribute('aria-invalid'),error:!!error?.textContent.trim(),contained:r.left>=p.left&&r.right<=p.right+1,overflow:document.documentElement.scrollWidth>innerWidth+1};});
      assert.equal(cv.invalid,'true');assert.ok(cv.error&&cv.contained&&!cv.overflow);result.cvErrorCases.push({lang,width:320,...cv});await writeFile(`${reportDir}/after-${lang}-cv-error-320.png`,Buffer.from((await b.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
    }
    // A reduced visual viewport approximates a software keyboard; it is not a hardware keyboard test.
    await b.send('Emulation.setDeviceMetricsOverride',{width:390,height:420,deviceScaleFactor:1,mobile:true});
    const reachable=await b.call(s=>{const input=document.querySelector(s+' textarea');input.focus();input.scrollIntoView({block:'center',behavior:'instant'});return document.activeElement===input;},selector);
    assert.ok(reachable,'Message remains focusable in reduced viewport');await save();
  }
  result.blockedWriteRequests=b.events.filter(e=>e.method==='Fetch.requestPaused'&&!['GET','HEAD'].includes(e.params.request.method)).length;
  result.runtimeErrors=b.events.filter(e=>e.method==='Runtime.exceptionThrown');await save();
  console.log(JSON.stringify({checks:result.checks.length,cvErrorCases:result.cvErrorCases.length,issues:result.issues.length,stage,writeRequests:result.blockedWriteRequests}));
  if(stage!=='before')assert.equal(result.issues.length,0,JSON.stringify(result.issues.slice(0,3)));
  assert.equal(result.blockedWriteRequests,0);assert.equal(result.runtimeErrors.length,0);
}finally{await b.close();}
