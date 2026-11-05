const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const analytics = fs.readFileSync(path.join(root, 'renewal/analytics.js'), 'utf8');
const booking = fs.readFileSync(path.join(root, 'booking.js'), 'utf8');
const page = fs.readFileSync(path.join(root, 'feature/dog-winter-illumination-2026-2027/index.html'), 'utf8');
function setup(consent, owner) {
  const values = new Map([['dog_izu_analytics_consent', consent], ['inu_to_izu_owner_optout', owner]]);
  const listeners = [];
  const win = {};
  const location = {hostname: 'kameo3150.github.io', pathname: '/izukyu-tsunagaru-map/inu-to-izu/feature/dog-winter-illumination-2026-2027/'};
  win.location = location;
  const context = vm.createContext({window:win, location, URL, encodeURIComponent,
    localStorage: {getItem:k=>values.get(k)||null, setItem:(k,v)=>values.set(k,v)},
    document: {createElement:()=>({}),head:{append:()=>{}},addEventListener:(name,cb)=>{if(name==='click')listeners.push(cb);}}});
  vm.runInContext(analytics, context);
  vm.runInContext(booking, context);
  const click = (href, placement) => listeners.forEach(cb=>cb({target:{closest:()=>({href,dataset:{bookingPlacement:placement}})}}));
  const events = () => [...(win.dataLayer||[])].filter(e=>e[0]==='event');
  return {win, context, click, events, listeners};
}
const links = [...page.matchAll(/<a\b([^>]*data-booking-placement="illumination-(?:compare-)?(?:gotemba|hamamatsu|sagamiko|motherfarm)"[^>]*)>/g)].map(m=>({
  href:m[1].match(/href="([^"]+)"/)[1].replaceAll('&amp;','&'),
  placement:m[1].match(/data-booking-placement="([^"]+)"/)[1]
}));
test('all eight hotel CTA positions emit one affiliate_click with their own placement',()=>{
  assert.equal(links.length,8);
  for(const link of links){const e=setup('yes','0');e.click(link.href,link.placement);assert.equal(e.events().length,1);assert.equal(e.events()[0][1],'affiliate_click');assert.equal(e.events()[0][2].placement,link.placement);assert.equal(e.events()[0][2].affiliate_partner,'jalan');}
});
test('refusal, no consent and owner exclusion prevent all hotel CTA events',()=>{
  for(const [consent,owner] of [[null,null],['no','0'],['yes','1']]){const e=setup(consent,owner);for(const link of links)e.click(link.href,link.placement);assert.equal(e.events().length,0);}
});
test('revocation and owner exclusion stop events after initialization',()=>{
  for(const setter of ['setConsent','setOwnerExcluded']){const e=setup('yes','0');e.win.DogMetrics[setter](setter==='setOwnerExcluded');e.click(links[0].href,links[0].placement);assert.equal(e.events().length,0);}
});
test('loading booking twice never doubles the event listener',()=>{
  const e=setup('yes','0');vm.runInContext(booking,e.context);assert.equal(e.listeners.length,1);e.click(links[0].href,links[0].placement);assert.equal(e.events().length,1);
});
test('plain links and other advertisers are not reported as Jalan clicks',()=>{
  const e=setup('yes','0');for(const href of ['https://www.jalan.net/','https://example.com/','https://px.a8.net/svt/ejp?a8mat=OTHER'])e.click(href,'test');assert.equal(e.events().length,0);
});
