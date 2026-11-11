import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { browserSession, pause } from './browser-session.mjs';
import { prepareReports, reportDir, navigate, dismissPrivacy } from './qa-helpers.mjs';

await prepareReports();const b=await browserSession(),checks=[];
async function key(key,code,keyCode){for(const type of ['keyDown','keyUp'])await b.send('Input.dispatchKeyEvent',{type,key,code,windowsVirtualKeyCode:keyCode,...(type==='keyDown'&&key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});await pause(80);}
async function tabUntil(selector){for(let n=0;n<45;n++){await key('Tab','Tab',9);if(await b.call(s=>document.activeElement?.matches(s),selector))return;}throw Error('Keyboard target not reached: '+selector);}
try{
 await dismissPrivacy(b);
 for(const lang of ['tr','en','ar'])for(const width of [390,1440]){
  await b.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
  await navigate(b,'/'+lang+'/');await tabUntil('.skip-link');await key('Enter','Enter',13);
  assert.equal(await b.call(()=>document.activeElement.id),'main-content');
  await navigate(b,'/'+lang+'/');
  if(width<768){
   await tabUntil('[aria-controls="mobile-navigation"]');await key('Enter','Enter',13);
   assert.equal(await b.call(()=>!!document.getElementById('mobile-navigation')),true);
   await key('Escape','Escape',27);
   assert.equal(await b.call(()=>!document.getElementById('mobile-navigation')&&document.activeElement.matches('[aria-controls="mobile-navigation"]')),true);
  }else{
   await tabUntil('header details > summary');await key('Enter','Enter',13);
   assert.equal(await b.call(()=>!!document.querySelector('header details[open]')),true);
   await key('Escape','Escape',27);assert.equal(await b.call(()=>!document.querySelector('header details[open]')),true);
  }
  const focus=await b.call(()=>{const el=document.activeElement,r=el.getBoundingClientRect(),s=getComputedStyle(el);return{tag:el.tagName,width:r.width,height:r.height,outline:s.outlineStyle,outlineWidth:s.outlineWidth};});
  assert.ok(focus.width>0&&focus.height>0);assert.notEqual(focus.outline,'none');checks.push({lang,width,skipLink:true,menuKeyboard:true,escapeRestoresFocus:true,focus});
  console.log('PASS keyboard',lang,width);
 }
 await writeFile(`${reportDir}/keyboard.json`,JSON.stringify({checks,physicalKeyboard:false,method:'Chrome CDP Tab/Enter/Escape key events; not a screen reader or hardware-device audit.'},null,2));console.log('PASS keyboard:',checks.length,'TR/EN/AR mobile/desktop scenarios');
}finally{await b.close();}
