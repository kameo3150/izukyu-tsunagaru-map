const SUPABASE_URL='https://wovwmrdhtaqfgmrwqymg.supabase.co';
const SUPABASE_KEY='sb_publishable_ZMBMNJe2uPhoHTVlMe6OAw_6kK0s2eH';
const API=SUPABASE_URL+'/rest/v1';
const PENDING_KEY='izu_pending_signal_reports';
const stations=['伊東','南伊東','川奈','富戸','城ヶ崎海岸','伊豆高原','伊豆大川','伊豆北川','伊豆熱川','片瀬白田','伊豆稲取','今井浜海岸','河津','稲梓','蓮台寺','伊豆急下田'];
const segments=stations.slice(0,-1).map((s,i)=>`${s}〜${stations[i+1]}`);
const segSelect=document.getElementById('segment');
segments.forEach(x=>{const o=document.createElement('option');o.textContent=x;segSelect.appendChild(o)});
let lastLocation=null,myMarker=null,reports=[];
const map=L.map('map').setView([34.86,138.95],10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
const reportLayer=L.layerGroup().addTo(map);

function setSync(text,ok=true){const el=document.getElementById('syncStatus');el.textContent=text;el.className='pill '+(ok?'ok':'err')}
function statusToStrength(s){return s==='good'?2:s==='weak'?1:0}
function strengthToStatus(v){const n=Number(v);return n>=2?'good':n===1?'weak':'dead'}
function rowToReport(r){const lat=Number(r.latitude),lon=Number(r.longitude);return{id:r.id,at:r.measured_at||r.created_at,carrier:r.carrier||'その他',networkType:r.network_type||'unknown',place:r.station_section||'地点',status:strengthToStatus(r.signal_strength),location:Number.isFinite(lat)&&Number.isFinite(lon)?{lat,lon}:null}}
function cacheReports(){try{localStorage.setItem('izu_shared_reports_cache',JSON.stringify(reports))}catch(e){}}
function loadCache(){try{return JSON.parse(localStorage.getItem('izu_shared_reports_cache')||'[]')}catch(e){return[]}}
function savePrefs(){try{localStorage.setItem('izu_signal_prefs',JSON.stringify({carrier:carrier.value,networkType:networkType.value,placeType:placeType.value,segment:segment.value,placeName:placeName.value}))}catch(e){}}
function loadPrefs(){try{const p=JSON.parse(localStorage.getItem('izu_signal_prefs')||'{}');if(p.carrier)carrier.value=p.carrier;if(p.networkType)networkType.value=p.networkType;if(p.placeType)placeType.value=p.placeType;if(p.segment&&segments.includes(p.segment))segment.value=p.segment;if(p.placeName)placeName.value=p.placeName}catch(e){}togglePlaceFields()}
function togglePlaceFields(){const rail=placeType.value==='rail';railBox.style.display=rail?'block':'none';nameBox.style.display=rail?'none':'block';savePrefs()}
function moveSegment(delta){let i=segments.indexOf(segSelect.value);i=Math.max(0,Math.min(segments.length-1,i+delta));segSelect.value=segments[i];savePrefs()}
['carrier','networkType','placeType','segment','placeName'].forEach(id=>document.getElementById(id).addEventListener('change',savePrefs));

function getPending(){try{const a=JSON.parse(localStorage.getItem(PENDING_KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function savePending(a){localStorage.setItem(PENDING_KEY,JSON.stringify(a));updatePendingUI()}
function updatePendingUI(){const n=getPending().length;pendingStatus.style.display=n?'inline-block':'none';sendPendingBtn.style.display=n?'inline-block':'none';if(n){pendingStatus.className='pill pending';pendingStatus.textContent=`未送信：${n}件`}}
function queuePending(payload,meta){const q=getPending();q.push({id:String(Date.now())+'-'+Math.random(),payload,meta,queued_at:new Date().toISOString()});savePending(q);localStorage.setItem('izu_last_post_sig',meta.sig);localStorage.setItem('izu_last_post_at',String(Date.now()))}

function locate(center=false){return new Promise((resolve,reject)=>{if(!navigator.geolocation){loc.textContent='位置情報：利用できません';reject(new Error('no geolocation'));return}loc.textContent='位置情報：取得中…';navigator.geolocation.getCurrentPosition(p=>{lastLocation={lat:+p.coords.latitude.toFixed(6),lon:+p.coords.longitude.toFixed(6),accuracy:Math.round(p.coords.accuracy)};loc.innerHTML=`位置情報：<span class="oktext">${lastLocation.lat}, ${lastLocation.lon}</span>（±${lastLocation.accuracy}m）`;if(myMarker)map.removeLayer(myMarker);myMarker=L.circleMarker([lastLocation.lat,lastLocation.lon],{radius:8,color:'#62a8ff',weight:3,fillColor:'#fff',fillOpacity:1}).addTo(map).bindPopup('現在地');if(center)map.setView([lastLocation.lat,lastLocation.lon],15);resolve(lastLocation)},e=>{loc.textContent='位置情報：取得できませんでした';reject(e)},{enableHighAccuracy:true,timeout:12000,maximumAge:15000})})}
async function getLocation(center=false){try{await locate(center)}catch(e){}}
function centerOnMe(){if(lastLocation)map.setView([lastLocation.lat,lastLocation.lon],15);else getLocation(true)}

async function refreshReports(showMessage=false){if(!navigator.onLine){reports=loadCache();renderAll();setSync('共有データ：オフライン（保存済み表示）',false);if(showMessage)msg.textContent='現在オフラインです。';return}setSync('共有データ：読込中…',true);try{const q='/signal_reports?select=id,created_at,latitude,longitude,carrier,network_type,signal_strength,station_section,measured_at&order=measured_at.desc.nullslast,created_at.desc&limit=500';const r=await fetch(API+q,{headers:{apikey:SUPABASE_KEY}});if(!r.ok)throw new Error(await r.text());reports=(await r.json()).map(rowToReport);cacheReports();renderAll();setSync(`共有データ：接続済み（${reports.length}${reports.length>=500?'+':''}件）`,true);if(showMessage)msg.textContent=`共有データを更新しました：${reports.length}件`}catch(e){reports=loadCache();renderAll();setSync('共有データ：接続エラー（保存済み表示）',false);if(showMessage)msg.textContent='共有データを取得できませんでした。'}}

async function postPayload(payload){const r=await fetch(API+'/signal_reports',{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(payload)});if(!r.ok){const e=new Error(await r.text());e.httpStatus=r.status;throw e}}

async function recordSignal(status){savePrefs();if(!lastLocation){msg.textContent='現在地を取得しています…';try{await locate(false)}catch(e){msg.textContent='位置情報を取得できないため記録できませんでした。';return}}const place=placeType.value==='rail'?segment.value:placeName.value.trim();if(!place){msg.textContent='場所名を入力してください。';return}const label={good:'良好',weak:'弱い',dead:'圏外'}[status];const sig=[lastLocation.lat.toFixed(4),lastLocation.lon.toFixed(4),carrier.value,status,place].join('|');const lastSig=localStorage.getItem('izu_last_post_sig');const lastAt=Number(localStorage.getItem('izu_last_post_at')||0);if(sig===lastSig&&Date.now()-lastAt<15000){msg.textContent='同じ内容の連続投稿を防止しました。15秒ほど待ってください。';return}const payload={latitude:lastLocation.lat,longitude:lastLocation.lon,carrier:carrier.value,network_type:networkType.value,signal_strength:statusToStrength(status),station_section:place,measured_at:new Date().toISOString()};const meta={sig,place,carrier:carrier.value,label};if(!navigator.onLine){queuePending(payload,meta);msg.textContent=`圏外のため端末に保存しました：${place} / ${label}。電波が戻ると自動送信します。`;return}msg.textContent='送信中…';try{await postPayload(payload);localStorage.setItem('izu_last_post_sig',sig);localStorage.setItem('izu_last_post_at',String(Date.now()));msg.textContent=`投稿しました：${place} / ${label}`;await refreshReports(false)}catch(e){if(!e.httpStatus){queuePending(payload,meta);msg.textContent=`通信できないため端末に保存しました：${place} / ${label}。復帰後に自動送信します。`}else{msg.textContent='投稿できませんでした。共有設定を確認してください。'}}}

async function flushPending(showMessage=false){if(!navigator.onLine){updatePendingUI();if(showMessage)msg.textContent='まだオフラインです。未送信データは端末に残っています。';return}const q=getPending();if(!q.length){updatePendingUI();if(showMessage)msg.textContent='未送信データはありません。';return}let sent=0;const remain=[];for(const item of q){try{await postPayload(item.payload);sent++}catch(e){remain.push(item)}}savePending(remain);if(sent){await refreshReports(false);msg.textContent=`未送信データを${sent}件送信しました。${remain.length?`残り${remain.length}件。`:''}`}else if(showMessage){msg.textContent='未送信データをまだ送れませんでした。'}}

function markerColor(s){return s==='good'?'#20c77a':s==='weak'?'#f3b63f':'#ef5a5a'}
function renderMap(){reportLayer.clearLayers();const fc=filterCarrier.value;reports.filter(r=>r.location&&(fc==='all'||r.carrier===fc)).forEach(r=>{const label={good:'良好',weak:'弱い',dead:'圏外'}[r.status];L.circleMarker([r.location.lat,r.location.lon],{radius:8,color:'#0b1220',weight:2,fillColor:markerColor(r.status),fillOpacity:.95}).addTo(reportLayer).bindPopup(`<b>${escapeHtml(r.place)}</b><br>${escapeHtml(r.carrier)} / ${label}<br><small>${formatDate(r.at)}</small>`)})}
function fitReports(){const pts=reports.filter(r=>r.location).map(r=>[r.location.lat,r.location.lon]);if(lastLocation)pts.push([lastLocation.lat,lastLocation.lon]);if(pts.length)map.fitBounds(pts,{padding:[25,25],maxZoom:15})}
function renderRoute(){route.innerHTML='';stations.forEach((s,i)=>{const st=document.createElement('div');st.className='station';st.innerHTML=`<b>${s}</b>`;route.appendChild(st);if(i<segments.length){const here=reports.filter(r=>r.place===segments[i]);let summary='報告なし';if(here.length){const c={good:0,weak:0,dead:0};here.forEach(r=>c[r.status]++);const max=Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];summary=`${{good:'📶 良好',weak:'△ 弱い',dead:'❌ 圏外'}[max]} ・ ${here.length}件`}const sg=document.createElement('div');sg.className='seg';sg.textContent=summary;route.appendChild(sg)}})}
function renderHistory(){const arr=reports.slice(0,30);history.innerHTML=arr.length?arr.map(r=>`<div class="entry"><span class="tag ${r.status}">${{good:'良好',weak:'弱い',dead:'圏外'}[r.status]}</span>${escapeHtml(r.carrier)}<br><b>${escapeHtml(r.place)}</b><br><span class="small">${formatDate(r.at)}</span></div>`).join(''):'<div class="small">まだ共有記録はありません。</div>'}
function renderStats(){const today=jstDateKey(new Date());todayCount.textContent=reports.filter(r=>jstDateKey(new Date(r.at))===today).length;shownCount.textContent=reports.length>=500?'500+':reports.length;latestTime.textContent=reports.length?relativeTime(reports[0].at):'まだなし'}
function renderAll(){renderRoute();renderHistory();renderMap();renderStats()}

async function shareSite(){const data={title:'伊豆つながるMAP',text:'伊豆の携帯電波状況を、みんなの実測で共有するマップです。',url:'https://kameo3150.github.io/izukyu-tsunagaru-map/'};try{if(navigator.share)await navigator.share(data);else if(navigator.clipboard){await navigator.clipboard.writeText(data.url);msg.textContent='URLをコピーしました。'}}catch(e){}}
async function loadWeather(){if(!lastLocation){weather.textContent='先に現在地を取得してください。';return}weather.textContent='天気を取得中…';try{const u=`https://api.open-meteo.com/v1/forecast?latitude=${lastLocation.lat}&longitude=${lastLocation.lon}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&timezone=Asia%2FTokyo`;const r=await fetch(u);const c=(await r.json()).current;weather.innerHTML=`🌡 ${c.temperature_2m}℃（体感 ${c.apparent_temperature}℃）　💧 ${c.precipitation}mm　💨 ${c.wind_speed_10m}km/h`}catch(e){weather.textContent='天気を取得できませんでした。'}}
function formatDate(v){const d=new Date(v);return Number.isNaN(d.getTime())?'時刻不明':d.toLocaleString('ja-JP')}
function jstDateKey(d){return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}
function relativeTime(v){const d=new Date(v),sec=Math.floor((Date.now()-d.getTime())/1000);if(sec<60)return'たった今';if(sec<3600)return`${Math.floor(sec/60)}分前`;if(sec<86400)return`${Math.floor(sec/3600)}時間前`;return`${Math.floor(sec/86400)}日前`}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

window.addEventListener('online',()=>{setSync('共有データ：通信復帰',true);flushPending(false);refreshReports(false)});
window.addEventListener('offline',()=>{setSync('共有データ：オフライン',false);updatePendingUI()});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
loadPrefs();updatePendingUI();refreshReports(false);if(navigator.onLine)flushPending(false);setInterval(()=>{if(navigator.onLine&&getPending().length)flushPending(false)},30000);