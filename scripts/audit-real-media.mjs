// Verify actual sector photo files and gallery connections in source and build.
// This verifies technical inclusion, not copyright/usage permissions or visual correctness.
import assert from 'node:assert/strict';
import { stat, readFile, mkdir, writeFile } from 'node:fs/promises';
import { serviceGalleries, getServiceGallery } from '../src/data/serviceGallery.js';
import { pagePath } from '../src/utils/routes.js';
import { reportDir, prepareReports, navigate, dismissPrivacy } from './qa-helpers.mjs';
import { browserSession, pause } from './browser-session.mjs';
import { tr } from '../src/data/translations/tr.js';
import { en } from '../src/data/translations/en.js';
import { ar } from '../src/data/translations/ar.js';

const agricultureFiles = [
  'agriculture-grain-transfer.jpg',
  'agriculture-harvest-yellow.jpg',
  'agriculture-sunflower-field.jpg',
  'agriculture-wheat-harvest.jpg',
  'agriculture-fertilizer-storage.jpg',
  'agriculture-roadside-harvest.jpg',
].map(name => `/images/agriculture/real/${name}`);
const addedConstructionFiles = [
  'construction-tower-interior.jpg',
  'construction-tower-exterior.jpg',
  'construction-generator-installation.jpg',
].map(name => `/images/construction/real/${name}`);

assert.equal(serviceGalleries.agriculture.length, 6, 'Agriculture must show exactly the six approved photos');
for (const path of agricultureFiles) assert.ok(serviceGalleries.agriculture.some(item => item.src === path), `Missing agriculture gallery entry ${path}`);
for (const path of addedConstructionFiles) assert.ok(serviceGalleries.construction.some(item => item.src === path), `Missing construction gallery entry ${path}`);
assert.equal(new Set(serviceGalleries.construction.map(item => item.src)).size, serviceGalleries.construction.length, 'Construction gallery duplicates detected');

const items = [...agricultureFiles, ...addedConstructionFiles];
for (const path of items) {
  for (const root of ['public', 'dist']) {
    const file = `${root}${path}`;
    const details = await stat(file);
    assert.ok(details.isFile() && details.size > 0, `Empty or missing photo: ${file}`);
  }
}
for (const language of ['tr', 'en', 'ar']) {
  for (const [view, paths] of [['service-agriculture', agricultureFiles], ['service-construction', addedConstructionFiles]]) {
    const path = pagePath(view, language);
    const html = await readFile(`dist${path}index.html`, 'utf8');
    for (const asset of paths) assert.ok(html.includes(asset), `Built page ${path} does not reference ${asset}`);
  }
}
const fleet = '/images/fleet-rental-city-fleet.png';
assert.ok((await stat(`dist${fleet}`)).size > 0, 'Fleet photo missing from build');
const home = await readFile('dist/tr/index.html', 'utf8');
const fleetOnHomepage = home.includes(fleet);
assert.ok(fleetOnHomepage,'Fleet feature must be present on homepage');
for(const lang of ['tr','en','ar'])assert.ok((await readFile(`dist/${lang}/index.html`,'utf8')).includes(fleet),'Localized homepage fleet feature missing');
const manifest=JSON.parse(await readFile('src/data/generatedMedia.json','utf8'));
for(const path of [...items,fleet]){
  const entry=manifest[path];assert.ok(entry?.width&&entry.height,'Missing dimensions: '+path);
  for(const variant of [...entry.variants,...(entry.avifVariants||[])]){
    assert.ok(variant.width<=entry.width,'Variant must not be labelled above source width');
    assert.equal((await stat('dist'+variant.src)).size,variant.bytes,'Variant byte count mismatch');
  }
}
const report = {
  validated: items.length,
  agriculturePhotos: agricultureFiles.length,
  newConstructionPhotos: addedConstructionFiles.length,
  fleetImageInBuild: true,
  fleetImageVisibleInPrerenderedHomepage: fleetOnHomepage,
  note: 'HTML reference checks do not prove correct visual crop; verify screenshots. Legal/media permissions require human confirmation.',
};
const video=await readFile('public/videos/fleet-rental-showcase.mp4');
const handlers=[];
function inspectBoxes(start,end){for(let offset=start;offset+8<=end;){let size=video.readUInt32BE(offset);const type=video.toString('ascii',offset+4,offset+8);if(size===0)size=end-offset;assert.ok(size>=8&&offset+size<=end,'Invalid MP4 box boundary');if(['moov','trak','mdia'].includes(type))inspectBoxes(offset+8,offset+size);if(type==='hdlr'){assert.ok(size>=20);handlers.push(video.toString('ascii',offset+16,offset+20));}offset+=size;}}
inspectBoxes(0,video.length);assert.ok(handlers.includes('vide'));assert.ok(!handlers.includes('soun'),'Video gained an audio track; review the silent-video description');
report.video={bytes:video.length,handlers,audioTrackPresent:false,visualAlternative:'Localized visual description; not fabricated speech subtitles'};
await prepareReports();
await writeFile(`${reportDir}/media-qa.json`, JSON.stringify(report, null, 2));
const browser=await browserSession();report.browser={galleryImages:[],fleet:[],screenshots:[]};
async function readyImage(selector){for(let n=0;n<120;n++){if(await browser.call(s=>{const i=document.querySelector(s);return i?.complete&&i.naturalWidth>0;},selector))return;await pause(100);}throw Error('Image decode timeout: '+selector);}
try{
 await dismissPrivacy(browser);
 for(const [lang,t] of Object.entries({tr,en,ar})){
  await browser.send('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});
  for(const sector of ['agriculture','construction']){
   const expected=getServiceGallery(sector,t.services.items[sector]);await navigate(browser,pagePath('service-'+sector,lang));
   assert.equal(await browser.call(()=>document.querySelectorAll('main figure img').length),expected.length);
   for(let index=0;index<expected.length;index++){
    const selector=`main figure:nth-child(${index+1}) img`;await browser.call(s=>document.querySelector(s).scrollIntoView({block:'center',behavior:'instant'}),selector);await readyImage(selector);
    const image=await browser.call(s=>{const i=document.querySelector(s);return{src:new URL(i.src).pathname,current:new URL(i.currentSrc).pathname,alt:i.alt,fit:getComputedStyle(i).objectFit};},selector);
    assert.equal(image.src,expected[index].src);assert.ok(image.alt);assert.ok(['cover','contain'].includes(image.fit),'Images must preserve their aspect ratio');if(image.src.includes('/real/'))assert.ok(image.current.endsWith('.avif'));
    report.browser.galleryImages.push({lang,sector,index,...image});
   }
  }
  for(const view of ['home','rental'])for(const width of [390,1440]){
   await browser.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});await navigate(browser,pagePath(view,lang));
   const selector='main img[src="/images/fleet-rental-city-fleet.png"]';assert.equal(await browser.call(s=>document.querySelectorAll(s).length,selector),1);
   await browser.call(s=>document.querySelector(s).scrollIntoView({block:'center',behavior:'instant'}),selector);await readyImage(selector);
   const image=await browser.call(s=>{const i=document.querySelector(s);return{current:new URL(i.currentSrc).pathname,alt:i.alt,fit:getComputedStyle(i).objectFit,overflow:document.documentElement.scrollWidth>innerWidth+1};},selector);
   assert.ok(image.current.endsWith('.avif'));assert.ok(image.alt);assert.equal(image.fit,'contain');assert.equal(image.overflow,false);report.browser.fleet.push({lang,view,width,...image});
   const path=`${reportDir}/fleet-${lang}-${view}-${width}.png`;await writeFile(path,Buffer.from((await browser.send('Page.captureScreenshot',{format:'png'})).data,'base64'));report.browser.screenshots.push(path);
  }
 }
 report.browser.runtimeExceptions=browser.events.filter(e=>e.method==='Runtime.exceptionThrown').length;assert.equal(report.browser.runtimeExceptions,0);
 report.browser.originalFleetPngRequests=browser.events.filter(e=>e.method==='Network.requestWillBeSent'&&new URL(e.params.request.url).pathname===fleet).length;assert.equal(report.browser.originalFleetPngRequests,0,'AVIF-capable Chrome should not download PNG fallback');
}finally{await browser.close();await writeFile(`${reportDir}/media-qa.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify(report, null, 2));
if (!fleetOnHomepage) {
  console.warn('NOTICE: Fleet image exists but is not referenced on the prerendered homepage. Add HomeFleetFeature if homepage display is required.');
}
