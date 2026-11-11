import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { browserSession, pause } from './browser-session.mjs';
import { pagePath, pagePaths } from '../src/utils/routes.js';
import { tr } from '../src/data/translations/tr.js';
import { en } from '../src/data/translations/en.js';
import { ar } from '../src/data/translations/ar.js';
const b = await browserSession();
const checks = [];
const waitFor = async (predicate, ...args) => {
  for (let i = 0; i < 100; i++) { if (await b.call(predicate, ...args)) return; await pause(80); }
  throw new Error('Timed out waiting for browser state');
};
try {
  await b.send('Page.addScriptToEvaluateOnNewDocument', { source: "localStorage.setItem('karaoglu-privacy-consent','1')" });
  await b.send('Network.setCacheDisabled', { cacheDisabled: true });
  await b.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  for (const view of Object.keys(pagePaths)) {
    await b.send('Page.navigate', { url: `http://127.0.0.1:4175${pagePath(view,'tr')}` });
    // SSR already exposes a native select. Wait until React has attached its
    // onChange handler rather than firing an event during bootstrap.
    await waitFor(path => {
      const select = document.querySelector('header select');
      return location.pathname === path && document.readyState === 'complete' && select
        && Object.entries(select).some(([key, value]) => key.startsWith('__reactProps$') && typeof value?.onChange === 'function');
    }, pagePath(view, 'tr'));
    for (const language of ['en','ar','tr']) {
      await b.call(value => {
        const select = document.querySelector('header select');
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, language);
      await waitFor((lang, path) => document.documentElement.lang === lang && location.pathname === path, language, pagePath(view, language));
      await waitFor(() => !!document.querySelector('h1')?.textContent?.trim());
      const state = await b.evaluate(`({path:location.pathname,lang:document.documentElement.lang,dir:document.documentElement.dir,canonical:document.querySelector('link[rel="canonical"]').href,title:document.title,h1:document.querySelector('h1')?.textContent.trim(),visibleHeading:document.querySelector('h1')?.innerText,headingTop:document.querySelector('h1')?.getBoundingClientRect().top})`);
      assert.equal(new URL(state.canonical).pathname, pagePath(view,language));
      assert.equal(state.dir, language==='ar'?'rtl':'ltr');
      const t = {tr,en,ar}[language];
      const expectedHeading = view === 'home' ? t.hero.title : view.startsWith('corporate-') ? t.corporate.subpageHeaders[view.slice(10)].title : view === 'corporate' ? t.corporate.title : view.startsWith('service-') ? t.services.items[view.slice(8)].title : t[{services:'services',portfolio:'portfolio',rental:'rental',career:'career',contact:'contact'}[view]].title;
      assert.equal(state.h1, expectedHeading, `${view}/${language} heading must match the selected language`);
      checks.push({view,language,...state});
    }
    console.log('PASS language cycle',view);
  }
  // The hero poster is eager, but the large MP4 must wait for a user gesture.
  b.events.length = 0;
  await b.send('Page.navigate', {url:'http://127.0.0.1:4175/tr/'});
  await waitFor(() => !!document.querySelector('video'));
  await pause(1000);
  const videoState = await b.evaluate(`({preload:document.querySelector('video').preload,paused:document.querySelector('video').paused,controls:document.querySelector('video').controls,poster:document.querySelector('video').poster})`);
  assert.equal(videoState.preload,'none');
  assert.equal(videoState.paused,true);
  assert.equal(videoState.controls,false);
  const videoRequestsBeforePlay = b.events.filter(e => e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('/videos/fleet-rental-showcase.mp4'));
  assert.equal(videoRequestsBeforePlay.length,0,'hero video must not download before a user gesture');
  const poster = videoState.poster;
  assert.equal((await fetch(poster)).status,200);
  await b.evaluate(`document.querySelector('video').scrollIntoView({block:'center',behavior:'instant'})`);
  const pos=await b.evaluate(`(()=>{const r=document.querySelector('video').parentElement.querySelector('button').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  for(const type of ['mousePressed','mouseReleased']) await b.send('Input.dispatchMouseEvent',{type,...pos,button:'left',clickCount:1});
  await waitFor(() => document.querySelector('video').currentTime > 0);
  const playing=await b.evaluate(`({time:document.querySelector('video').currentTime,controls:document.querySelector('video').controls,paused:document.querySelector('video').paused})`);
  assert.equal(playing.controls,true);
  assert.ok(b.events.some(e => e.method === 'Network.requestWillBeSent' && e.params.request.url.includes('/videos/fleet-rental-showcase.mp4')),'MP4 should load after the user starts playback');
  await b.evaluate('window.scrollTo(0,document.body.scrollHeight)');
  await pause(700);
  assert.equal(await b.evaluate(`document.querySelector('video').paused`),true);
  const contactLinks = await b.evaluate(`({telephone:[...document.querySelectorAll('a[href^="tel:"]')].map(a=>a.getAttribute('href')),externalWithoutProtection:[...document.querySelectorAll('a[target="_blank"]')].filter(a=>!a.rel.includes('noopener')).map(a=>a.href)})`);
  assert.ok(contactLinks.telephone.every(url=>url==='tel:+905444438000'));
  assert.equal(contactLinks.externalWithoutProtection.length,0);
  const screenshots=[];
  for(const [language,width] of [['tr',390],['en',1440],['ar',390]]) {
    await b.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
    await b.send('Page.navigate',{url:`http://127.0.0.1:4175/${language}/`});
    await pause(1000);
    const path=`reports/final-release/${language}-${width}.png`;
    await writeFile(path,Buffer.from((await b.send('Page.captureScreenshot',{format:'png'})).data,'base64'));
    screenshots.push(path);
  }
  await writeFile('reports/final-release/behavior.json',JSON.stringify({samePageLanguageSwitches:checks.length,checks,video:{poster,initialState:videoState,requestsBeforePlay:videoRequestsBeforePlay.length,playing,pausedOutsideViewport:true},contactLinks,screenshots,realSubmissions:0},null,2));
  console.log('PASS',checks.length,'same-page language switches, real gesture video playback/poster/pause, telephone hrefs and external link protection.');
} finally {await b.close();}
