const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'analytics.js'), 'utf8');
function setup({mode='live',consent=null,owner=null,pathname='/izukyu-tsunagaru-map/inu-to-izu/',hostname='kameo3150.github.io',legacy=false,storageBlocked=false,existingValues=null}={}) {
  const values = existingValues || new Map(); const consentKey=legacy?'dog_izu_analytics_consent':'consent',ownerKey=legacy?'inu_to_izu_owner_optout':'owner'; if(consent!==null)values.set(consentKey,consent);if(owner!==null)values.set(ownerKey,owner);
  const scripts=[];
  const win={DOG_IZU_CONFIG:{mode,version:'test',measurementId:'G-KT9SG4RDYR',ownerOptOutKey:'owner',consentKey:'consent'}};
  if(legacy)delete win.DOG_IZU_CONFIG;
  const context={window:win,location:{pathname,hostname},localStorage:{getItem:key=>{if(storageBlocked)throw Error('blocked');return values.get(key)||null},setItem:(key,value)=>{if(storageBlocked)throw Error('blocked');values.set(key,value)}},document:{createElement:()=>({}),head:{append:script=>scripts.push(script)}},encodeURIComponent};
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

test('legacy region pages share refusal and approval across navigation',()=>{
  const first=setup({legacy:true,pathname:'/izukyu-tsunagaru-map/inu-to-atami/'});
  first.win.DogMetrics.setConsent(false);
  const next=setup({legacy:true,pathname:'/izukyu-tsunagaru-map/inu-to-izu/experience/',existingValues:first.values});
  assert.equal(next.scripts.length,0);assert.equal(next.win.DogMetrics.track('affiliate_click',{}),false);
  next.win.DogMetrics.setConsent(true);next.win.DogMetrics.initialize();
  assert.equal(next.scripts.length,1);
  const third=setup({legacy:true,pathname:'/izukyu-tsunagaru-map/inu-to-shimoda/',existingValues:first.values});
  assert.equal(third.scripts.length,1);
});
test('owner exclusion blocks direct legacy events and survives navigation',()=>{
  const env=setup({legacy:true,consent:'yes',pathname:'/izukyu-tsunagaru-map/inu-to-izu/stay/'});
  env.win.DogMetrics.setOwnerExcluded(true);env.win.gtag('event','affiliate_click',{});
  assert.equal(env.events().length,0);assert.equal(env.win['ga-disable-G-KT9SG4RDYR'],true);
  const next=setup({legacy:true,pathname:'/izukyu-tsunagaru-map/inu-to-ito/',existingValues:env.values});
  assert.equal(next.scripts.length,0);assert.equal(next.win.DogMetrics.getState().ownerExcluded,true);
  env.win.DogMetrics.setOwnerExcluded(false);env.win.DogMetrics.initialize();
  assert.equal(env.scripts.length,1);
  assert.equal([...(env.win.dataLayer||[])].filter(row=>row[0]==='config').length,1);
});
test('blocked browser storage honors a choice for this page without claiming persistence',()=>{
  const env=setup({legacy:true,storageBlocked:true});assert.equal(env.scripts.length,0);
  assert.equal(env.win.DogMetrics.setConsent(true),false);assert.equal(env.scripts.length,1);
  env.win.DogMetrics.setConsent(false);env.win.gtag('event','official_click',{});assert.equal(env.events().length,0);
});
test('shared legacy loader never sends railway, unrelated-host, or preview traffic',()=>{
  for(const options of [{pathname:'/izukyu-tsunagaru-map/'},{hostname:'example.com'}]){
    const env=setup({legacy:true,consent:'yes',...options});assert.equal(env.scripts.length,0);
  }
  const configSource=fs.readFileSync(path.join(__dirname,'..','config.js'),'utf8');
  for(const [pathname,expected] of [['/izukyu-tsunagaru-map/inu-to-izu/','live'],['/izukyu-tsunagaru-map/inu-to-izu/index.html','live'],['/izukyu-tsunagaru-map/inu-to-izu/renewal/','preview']]){
    const ctx={window:{},location:{hostname:'kameo3150.github.io',pathname}};vm.runInNewContext(configSource,ctx);assert.equal(ctx.window.DOG_IZU_CONFIG.mode,expected);
  }
});
