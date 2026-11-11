import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { browserSession, pause } from './browser-session.mjs';
import { pagePath } from '../src/utils/routes.js';

const b = await browserSession();
const checks = [];
const waitFor = async fn => { for(let attempt=0;attempt<100;attempt++){ if(await b.call(fn)) return; await pause(50); } throw new Error('Interaction readiness timeout: '+fn.toString()); };
const check = (name, actual, expected = true) => { assert.deepEqual(actual, expected, name); checks.push(name); };
const go = async url => { await b.send('Page.navigate', { url }); await pause(1000); };
try {
  await b.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await go('http://127.0.0.1:4175/tr/');
  await b.evaluate(`localStorage.removeItem('karaoglu-privacy-consent')`);
  await go('http://127.0.0.1:4175/tr/');
  for (let attempt = 0; attempt < 40; attempt++) {
    if (await b.evaluate(`!!document.querySelector('dialog[open]') && document.querySelector('dialog').contains(document.activeElement)`)) break;
    await pause(75);
  }
  check('privacy dialog opens and contains focus', await b.evaluate(`!!document.querySelector('dialog[open]') && document.querySelector('dialog').contains(document.activeElement)`));
  await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await pause(100);
  check('Escape dismisses privacy dialog', await b.evaluate(`!document.querySelector('dialog[open]')`));
  await b.evaluate(`document.querySelector('[aria-controls="mobile-navigation"]').click()`);
  check('mobile menu opens', await b.evaluate(`!!document.getElementById('mobile-navigation')`));
  await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await pause(80);
  check('Escape closes menu and restores toggle focus', await b.evaluate(`!document.getElementById('mobile-navigation') && document.activeElement.matches('[aria-controls="mobile-navigation"]')`));
  await b.evaluate(`document.querySelector('[aria-controls="mobile-navigation"]').click()`);
  await b.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 5, y: 800, button: 'left', clickCount: 1 });
  await b.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 5, y: 800, button: 'left', clickCount: 1 });
  check('outside click closes menu', await b.evaluate(`!document.getElementById('mobile-navigation')`));
  await b.evaluate(`document.querySelector('[aria-controls="mobile-navigation"]').click()`); await pause(50);
  await b.evaluate(`document.querySelector('#mobile-navigation a[href="/tr/iletisim/"]').click()`);
  await waitFor(() => !document.getElementById('mobile-navigation') && location.pathname==='/tr/iletisim/');
  check('navigation closes menu and updates URL', await b.evaluate(`!document.getElementById('mobile-navigation') && location.pathname==='/tr/iletisim/'`));
  await b.evaluate(`document.querySelector('[aria-controls="mobile-navigation"]').click()`); await pause(50);
  await b.evaluate(`const s=document.querySelector('#mobile-navigation select');s.value='en';s.dispatchEvent(new Event('change',{bubbles:true}))`);
  await waitFor(() => location.pathname==='/en/contact/' && document.documentElement.lang==='en' && document.title.includes('Contact') && document.querySelector('meta[property="og:locale"]').content==='en_GB');
  check('language switch preserves page and translates SEO', await b.evaluate(`location.pathname==='/en/contact/' && document.documentElement.lang==='en' && document.title.includes('Contact') && document.querySelector('meta[property="og:locale"]').content==='en_GB'`));
  await b.evaluate('history.back()'); await pause(300);
  await waitFor(() => location.pathname==='/tr/iletisim/' && document.documentElement.lang==='tr');
  check('back restores Turkish contact', await b.evaluate(`location.pathname==='/tr/iletisim/' && document.documentElement.lang==='tr'`));
  await b.evaluate('history.forward()'); await pause(300);
  await waitFor(() => location.pathname==='/en/contact/' && document.documentElement.lang==='en');
  check('forward restores English contact', await b.evaluate(`location.pathname==='/en/contact/' && document.documentElement.lang==='en'`));
  await go('http://127.0.0.1:4175/');
  check('stored language survives returning to root', await b.evaluate(`location.pathname==='/en/' && document.documentElement.lang==='en'`));
  await go('http://127.0.0.1:4175/?lang=en#faaliyetler');
  check('legacy hash and query language preserved', await b.evaluate(`location.pathname==='/en/activities/' && document.documentElement.lang==='en'`));
  await go('http://127.0.0.1:4175/en/contact/');
  check('unverified forms are disabled with honest notice', await b.evaluate(`document.querySelector('#root form button[type="submit"]').disabled && document.body.innerText.includes('form is currently unavailable')`));
  check('external map is opt in', await b.evaluate(`!document.querySelector('iframe')`));
  await go('http://127.0.0.1:4175'+pagePath('rental','en'));
  check('fleet rental uses the supplied image instead of video', await b.evaluate(`!document.querySelector('video') && !!document.querySelector('img[src*="fleet-rental-city-fleet.png"]')`));

  // Vite on 4180 is explicitly launched with Forms enabled. All POSTs are mocked.
  await b.send('Page.addScriptToEvaluateOnNewDocument', { source: `localStorage.setItem('karaoglu-privacy-consent','1'); window.__posts=0; const originalFetch=window.fetch.bind(window); window.fetch=(url,options)=>{ if(options?.method==='POST'){window.__posts++;window.__lastPost={url,options};return new Promise(resolve=>{window.__release=status=>resolve(new Response('',{status}));});}return originalFetch(url,options);};` });
  for (const language of ['tr', 'en', 'ar']) for (const kind of ['contact', 'quick', 'career']) {
    const slug = kind === 'contact' ? (language === 'tr' ? 'iletisim/' : 'contact/') : kind === 'career' ? (language === 'tr' ? 'kariyer/' : 'careers/') : '';
    await go(`http://127.0.0.1:4180/${language}/${slug}`);
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await b.evaluate(`!!document.querySelector('#root form')`)) break;
      await pause(75);
    }
    await b.evaluate(`window.__f=document.querySelector('#root form');__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`); await pause(70);
    check(`${language} ${kind}: required fields announced and focused`, await b.evaluate(`__f.querySelectorAll('[aria-invalid="true"]').length>=4 && document.activeElement.name==='name' && window.__posts===0`));
    await b.evaluate(`for(const [name,value] of Object.entries({name:'QA Local',phone:'05444438000',email:'invalid-email',message:'Local test only'})){if(__f.elements[name])__f.elements[name].value=value;}for(const name of ['service','position','experience']){if(__f.elements[name])__f.elements[name].selectedIndex=1;}__f.elements.consent.checked=true;__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(70);
    check(`${language} ${kind}: invalid email rejected`, await b.evaluate(`__f.elements.email.getAttribute('aria-invalid')==='true' && window.__posts===0`));
    if(kind==='career') {
      await b.evaluate(`__f.elements.email.value='qa@example.invalid';__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(60);
      check(`${language} career: CV is required`, await b.evaluate(`__f.elements.cv.getAttribute('aria-invalid')==='true'`));
      await b.evaluate(`var dt=new DataTransfer();dt.items.add(new File([],'empty.pdf'));__f.elements.cv.files=dt.files;__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(60);
      check(`${language} career: empty CV rejected`, await b.evaluate(`__f.elements.cv.getAttribute('aria-invalid')==='true' && window.__posts===0`));
      await b.evaluate(`var dt=new DataTransfer();dt.items.add(new File(['local-test'],'resume.exe'));__f.elements.cv.files=dt.files;__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(60);
      check(`${language} career: invalid CV extension rejected`, await b.evaluate(`__f.elements.cv.getAttribute('aria-invalid')==='true' && window.__posts===0`));
      await b.evaluate(`var dt=new DataTransfer();dt.items.add(new File([new Uint8Array(10485761)],'resume.pdf'));__f.elements.cv.files=dt.files;__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(60);
      check(`${language} career: oversized CV rejected`, await b.evaluate(`__f.elements.cv.getAttribute('aria-invalid')==='true' && window.__posts===0`));
      await b.evaluate(`var dt=new DataTransfer();dt.items.add(new File(['%PDF local-test'],'resume.pdf',{type:'application/pdf'}));__f.elements.cv.files=dt.files;__f.elements.cv.dispatchEvent(new Event('change',{bubbles:true}))`);
    }
    await b.evaluate(`__f.elements.email.value='qa@example.invalid';__f.elements.phone.value='not-a-phone';__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(60);
    check(`${language} ${kind}: invalid phone rejected`, await b.evaluate(`__f.elements.phone.getAttribute('aria-invalid')==='true' && window.__posts===0`));
    await b.evaluate(`__f.elements.phone.value='05444438000';__f.elements.consent.checked=false;__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(60);
    check(`${language} ${kind}: missing consent rejected`, await b.evaluate(`__f.elements.consent.getAttribute('aria-invalid')==='true' && window.__posts===0`));
    await b.evaluate(`__f.elements.consent.checked=true;__f.elements['bot-field'].value='spam';__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(60);
    check(`${language} ${kind}: honeypot rejected before network`, await b.evaluate(`window.__posts===0 && !!__f.querySelector('[role="alert"]')`));
    await b.evaluate(`__f.elements['bot-field'].value='';__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(80);
    check(`${language} ${kind}: pending state and duplicate guard`, await b.evaluate(`window.__posts===1 && __f.querySelector('button[type="submit"]').disabled`));
    check(`${language} ${kind}: Netlify endpoint and form encoding`, await b.evaluate(`__lastPost.url==='/' && (__lastPost.options.body instanceof FormData ? (__lastPost.options.body.get('form-name')==='career-application' && !__lastPost.options.headers) : (new URLSearchParams(__lastPost.options.body).get('form-name')==='corporate-contact' && __lastPost.options.headers['Content-Type']==='application/x-www-form-urlencoded'))`));
    await b.evaluate('window.__release(500)');await pause(80);
    check(`${language} ${kind}: server failure shown, inputs retained`, await b.evaluate(`!!__f.querySelector('[role="alert"]') && __f.elements.name.value==='QA Local'`));
    await b.evaluate(`__f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);await pause(60);
    await b.evaluate('window.__release(200)');await pause(100);
    check(`${language} ${kind}: accepted mock resets form and shows success`, await b.evaluate(`!!__f.querySelector('[role="status"]') && __f.elements.name.value==='' && window.__posts===2`));
  }
  const errors = b.events.filter(e => e.method === 'Runtime.exceptionThrown');
  check('no runtime exceptions during interactions', errors.length, 0);
  await writeFile(`${process.env.RELEASE_REPORT_DIR || 'reports'}/interaction-audit.json`, JSON.stringify({ checks, realSubmissions: 0, testResponses: 'In-browser mocked 500 and 200 responses; not delivery verification.' }, null, 2));
  console.log(`PASS ${checks.length} interaction checks. No real submissions.`);
} finally { await b.close(); }
