const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'analytics.js'), 'utf8');
function setup({mode='live',consent=null,owner=null,pathname='/izukyu-tsunagaru-map/inu-to-izu/'}={}) {
  const values = new Map(); if(consent!==null)values.set('consent',consent);if(owner!==null)values.set('owner',owner);
  const scripts=[];
  const win={DOG_IZU_CONFIG:{mode,version:'test',measurementId:'G-KT9SG4RDYR',ownerOptOutKey:'owner',consentKey:'consent'}};
  const context={window:win,location:{pathname},localStorage:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)},document:{createElement:()=>({}),head:{append:script=>scripts.push(script)}},encodeURIComponent};
  vm.runInNewContext(source,context,{timeout:1000});
  return {win,scripts,values,events:()=>[...(win.dataLayer||[])].filter(row=>row[0]==='event')};
}
test('preview never loads GA or sends events, even after consent',()=>{
  const env=setup({mode:'preview',consent:'yes'});env.win.DogMetrics.setConsent(true);
  assert.equal(env.win.DogMetrics.track('affiliate_click',{partner:'jalan'}),false);assert.equal(env.scripts.length,0);assert.equal(env.events().length,0);
});
test('no consent, explicit refusal, and owner exclusion all prevent tracking',()=>{
  for(const options of [{},{consent:'no'},{consent:'yes',owner:'1'}]){const env=setup(options);assert.equal(env.win.DogMetrics.track('view_spot',{spot_id:'x'}),false);assert.equal(env.scripts.length,0);}
});
test('live consenting dog page initializes once and only sends allowed metadata',()=>{
  const env=setup({consent:'yes'});env.win.DogMetrics.initialize();
  assert.equal(env.scripts.length,1);assert.ok(env.scripts[0].src.endsWith('G-KT9SG4RDYR'));
  assert.equal(env.win.DogMetrics.track('filter_change',{region:'ito',category:'eat',query:'private search',latitude:34.7}),true);
  const payload=env.events()[0][2];assert.equal(payload.region,'ito');assert.equal(payload.query,undefined);assert.equal(payload.latitude,undefined);
  assert.equal(env.win.DogMetrics.track('purchase',{value:9999}),false);
});
test('revoking consent stops events immediately and disables GA',()=>{
  const env=setup({consent:'yes'});env.win.DogMetrics.setConsent(false);assert.equal(env.win['ga-disable-G-KT9SG4RDYR'],true);assert.equal(env.win.DogMetrics.track('affiliate_click',{}),false);
});
test('electric railway map and unrelated paths cannot be tracked by this code',()=>{
  for(const pathname of ['/izukyu-tsunagaru-map/','/other/']){const env=setup({consent:'yes',pathname});assert.equal(env.scripts.length,0);assert.equal(env.win.DogMetrics.track('view_spot',{}),false);}
});
