(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const config = window.DOG_IZU_CONFIG;
  const metrics = window.DogMetrics;
  const state = { category: 'all', area: 'all', query: '', large: false, indoor: false, fresh: false, saved: false, limit: 12, view: 'list' };
  const categoryNames = { play: '観光・体験', run: 'ドッグラン', walk: '散歩', eat: '食事', stay: '宿' };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch (_) { return ''; } };
  let spots = [], shown = [], saved = new Set(), map = null, markers = null, mapPromise = null, toastTimer = null;
  try { saved = new Set(JSON.parse(localStorage.getItem('dog_izu_saved_v2') || '[]')); } catch (_) {}
  function toast(text) { $('toast').textContent = text; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 2500); }
  function syncSaved() { $('saved-count').textContent = saved.size; $('saved-nav').setAttribute('aria-pressed', String(state.saved)); }
  function toggleSave(id) {
    const add = !saved.has(id); add ? saved.add(id) : saved.delete(id);
    let persistent = true; try { localStorage.setItem('dog_izu_saved_v2', JSON.stringify([...saved])); } catch (_) { persistent = false; }
    metrics.track('save_spot', { spot_id: id, enabled: add });
    toast(persistent ? (add ? '行きたい場所に保存しました' : '保存を解除しました') : 'この画面を開いている間だけ保存します');
    render();
  }
  function mapUrl(spot) {
    const url = new URL('https://www.google.com/maps/dir/');
    url.searchParams.set('api', '1');
    url.searchParams.set('destination', spot.name + ' ' + spot.regionLabel + ' ' + spot.area);
    return url.href;
  }
  function applyUrl() {
    const params = new URLSearchParams(location.search);
    state.category = ['all', ...Object.keys(categoryNames)].includes(params.get('category')) ? params.get('category') : 'all';
    state.area = [...$('area').options].some(option => option.value === params.get('area')) ? params.get('area') : 'all';
    state.query = (params.get('q') || '').slice(0, 100);
    state.large = params.get('large') === '1'; state.indoor = params.get('indoor') === '1'; state.fresh = params.get('fresh') === '1'; state.saved = params.get('saved') === '1';
    $('search').value = state.query; $('area').value = state.area;
    ['large','indoor','fresh'].forEach(key => { $(key).checked = state[key]; });
  }
  function updateUrl() {
    const url = new URL(location.href); url.search = '';
    if (state.category !== 'all') url.searchParams.set('category', state.category);
    if (state.area !== 'all') url.searchParams.set('area', state.area);
    if (state.query) url.searchParams.set('q', state.query);
    ['large','indoor','fresh','saved'].forEach(key => { if (state[key]) url.searchParams.set(key, '1'); });
    history.replaceState(null, '', url);
  }
  function card(spot) {
    const active = saved.has(spot.id), fresh = spot.reviewStatus === 'reviewed';
    const tags = (spot.tags || []).slice(0, 3).map(tag => `<span class="tag">${escape(tag)}</span>`).join('');
    return `<article class="place"><div class="place-head"><span class="place-region">${escape(spot.regionLabel)} / ${escape(categoryNames[spot.type] || 'お出かけ')}</span><button class="save" type="button" aria-label="${escape(spot.name)}を${active?'保存解除':'保存'}" aria-pressed="${active}" data-save="${escape(spot.id)}">${active?'♥':'♡'}</button></div><h3><button type="button" data-detail="${escape(spot.id)}">${escape(spot.name)}</button></h3><p class="place-desc">${escape(spot.note)}</p><div class="tags">${tags}<span class="tag ${fresh?'fresh':'status'}">${fresh?'10/25 再確認':'既存情報・再確認前'}</span></div><p class="place-meta"><b>料金</b> ${escape(spot.price || '施設・プランの公式案内で確認')}</p><div class="place-actions"><button type="button" data-detail="${escape(spot.id)}">犬の条件・詳細 <span>↗</span></button><a href="${escape(mapUrl(spot))}" target="_blank" rel="noopener" data-map-link="${escape(spot.id)}">経路を見る ↗</a></div></article>`;
  }
  function render() {
    const query = state.query.toLocaleLowerCase('ja-JP').trim();
    shown = spots.filter(spot => spot.reviewStatus !== 'pending' && Boolean(safeUrl(spot.sourceUrl)) && (state.category === 'all' || spot.categories.includes(state.category)) && (state.area === 'all' || spot.region === state.area) && (!query || [spot.name,spot.area,spot.regionLabel,spot.note,...spot.tags].join(' ').toLocaleLowerCase('ja-JP').includes(query)) && (!state.large || spot.largeEvidence) && (!state.indoor || spot.indoorEvidence) && (!state.fresh || spot.reviewStatus === 'reviewed') && (!state.saved || saved.has(spot.id)));
    shown.sort((a,b) => Number(b.reviewStatus==='reviewed') - Number(a.reviewStatus==='reviewed'));
    $('results').innerHTML = shown.slice(0,state.limit).map(card).join('');
    $('result-count').textContent = `${state.saved?'保存した場所：':''}${shown.length}件 ${shown.length > state.limit ? `／ ${state.limit}件を表示` : ''}`;
    $('result-note').textContent = state.indoor ? '屋内設備があっても、全域で犬同伴できるとは限りません。' : state.large ? '体重・体高・犬種などの追加条件は、施設詳細で確認。' : '既存情報と今回再確認した情報を区別しています。';
    $('empty').hidden = shown.length > 0;
    $('more').hidden = shown.length <= state.limit || state.view !== 'list';
    $('results').hidden = state.view !== 'list'; $('map-panel').hidden = state.view !== 'map';
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === state.category)));
    syncSaved(); updateUrl(); if (map && state.view === 'map') renderMap();
  }
  function changeFilter(type) { state.limit = 12; metrics.track('filter_change', { filter_type:type, region:state.area, category:state.category }); render(); }
  function clear() {
    Object.assign(state, { category:'all',area:'all',query:'',large:false,indoor:false,fresh:false,saved:false,limit:12 });
    $('search').value='';$('area').value='all';['large','indoor','fresh'].forEach(key=>{$(key).checked=false;});changeFilter('clear');
  }
  function openSpot(id) {
    const spot = spots.find(item => item.id === id); if (!spot) return;
    const fresh = spot.reviewStatus === 'reviewed';
    const facts = [['場所',spot.regionLabel+' / '+spot.area],['料金',spot.price || '今回の再確認は未実施。公式の料金案内で確認してください。'],['営業時間',spot.hours || '今回の再確認は未実施。公式の営業案内で確認してください。'],['休み・休止',spot.closed || '臨時休業を含め公式へ確認'],['駐車場',spot.parking || '今回の再確認は未実施。施設へ確認']];
    const sources = spot.sources || (spot.sourceUrl ? [[spot.sourceLabel || '掲載元の案内を見る',spot.sourceUrl]] : []);
    const sourceLinks = sources.filter(pair=>safeUrl(pair[1])).map(pair=>`<a href="${escape(safeUrl(pair[1]))}" target="_blank" rel="noopener" data-official="${escape(spot.id)}">${escape(pair[0])} ↗</a>`).join('');
    const tel = /^\d{9,12}$/.test(spot.phone || '') ? `<a class="button outline" href="tel:${spot.phone}">電話で確認</a>` : '';
    $('detail-region').textContent = spot.regionLabel + ' / ' + (categoryNames[spot.type] || 'お出かけ');
    $('detail-content').innerHTML = `<h2 id="detail-title">${escape(spot.name)}</h2><p>${escape(spot.note)}</p><div class="detail-rule">${escape(spot.rule || spot.tags.join(' / '))}</div><dl class="detail-facts">${facts.map(([label,value])=>`<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl><ul>${(spot.details || []).filter(value=>value!==spot.rule).map(value=>`<li>${escape(value)}</li>`).join('')}</ul><div class="detail-sources">${sourceLinks || '<p>個別の確認元URLを引き継げていません。公開前の確認対象です。</p>'}</div><p class="detail-status">${fresh?'2026/10/25にウェブで再確認。電話・現地確認は未実施。':'既存サイトから移行した情報。今回の再確認はまだ行っていません。'}</p><div class="dialog-actions"><a class="button blue" href="${escape(mapUrl(spot))}" target="_blank" rel="noopener" data-map-link="${escape(spot.id)}">経路を見る ↗</a>${tel}<button class="button outline" data-save="${escape(spot.id)}">${saved.has(spot.id)?'保存を解除':'行きたい場所に保存'}</button></div>`;
    if (!$('detail').open) $('detail').showModal();
    metrics.track('view_spot',{spot_id:spot.id,region:spot.region,category:spot.type});
  }
  function renderMap() {
    markers.clearLayers(); const bounds=[];
    for (const spot of shown) {
      if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lng)) continue;
      const marker = window.L.marker([spot.lat,spot.lng],{title:spot.name,alt:spot.name,icon:window.L.divIcon({className:'',html:'<div class="pin"></div>',iconSize:[20,20]})});
      const popup=document.createElement('div'),title=document.createElement('b'),button=document.createElement('button');
      title.textContent=spot.name;button.textContent='犬の条件を見る';button.type='button';button.addEventListener('click',()=>openSpot(spot.id));popup.append(title,document.createElement('br'),button);marker.bindPopup(popup).addTo(markers);bounds.push([spot.lat,spot.lng]);
    }
    map.invalidateSize();if(bounds.length)map.fitBounds(bounds,{padding:[28,28],maxZoom:13});
    $('map-status').textContent=`検索結果${shown.length}件のうち、位置データがある${bounds.length}件を表示。`;
  }
  async function ensureMap() {
    if (map) { renderMap(); return; }
    if (!mapPromise) mapPromise=new Promise((resolve,reject)=>{
      const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.append(css);
      const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=resolve;script.onerror=reject;document.head.append(script);
    });
    $('map-status').textContent='地図を読み込んでいます…';
    try { await mapPromise; if(!map){
      map=window.L.map('map',{scrollWheelZoom:false}).setView([34.85,138.98],10);
      const tiles=window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
      let reported=false;
      tiles.on('tileerror',()=>{if(reported)return;reported=true;showList();toast('背景地図を取得できないため一覧を表示しました。「経路を見る」は利用できます。');});
      tiles.addTo(map);markers=window.L.layerGroup().addTo(map);
    }renderMap(); }
    catch(_){mapPromise=null;$('map-status').textContent='地図を読み込めませんでした。一覧の「経路を見る」も利用できます。';}
  }
  function showList() {state.view='list';$('list-view').setAttribute('aria-pressed','true');$('map-view').setAttribute('aria-pressed','false');render();}
  $('list-view').addEventListener('click',showList);
  $('map-fallback').addEventListener('click',showList);
  $('map-view').addEventListener('click',()=>{state.view='map';$('list-view').setAttribute('aria-pressed','false');$('map-view').setAttribute('aria-pressed','true');render();metrics.track('map_open',{placement:'explorer',category:state.category,region:state.area});ensureMap();});
  $('search-form').addEventListener('submit',event=>{event.preventDefault();state.query=$('search').value.trim().slice(0,100);state.area=$('area').value;changeFilter('search');});
  $('search').addEventListener('input',()=>{state.query=$('search').value.trim().slice(0,100);state.limit=12;render();});
  $('area').addEventListener('change',()=>{state.area=$('area').value;changeFilter('region');});
  ['large','indoor','fresh'].forEach(key=>$(key).addEventListener('change',()=>{state[key]=$(key).checked;changeFilter(key);}));
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.filter;changeFilter('category');}));
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.category;changeFilter('category');$('explore').scrollIntoView();}));
  document.querySelectorAll('[data-story]').forEach(button=>button.addEventListener('click',()=>{clear();state.area=button.dataset.story==='sea'?'shimoda':'ito';state.category=button.dataset.story==='sea'?'all':'play';$('area').value=state.area;changeFilter('story');$('explore').scrollIntoView();}));
  $('saved-nav').addEventListener('click',()=>{state.saved=!state.saved;changeFilter('saved');showList();$('explore').scrollIntoView();});
  $('clear').addEventListener('click',clear);$('empty-clear').addEventListener('click',clear);
  $('more').addEventListener('click',()=>{state.limit+=12;render();});
  document.addEventListener('click',event=>{
    const saveButton=event.target.closest('[data-save]');if(saveButton){const id=saveButton.dataset.save;toggleSave(id);if($('detail').open)openSpot(id);return;}
    const detailButton=event.target.closest('[data-detail]');if(detailButton){openSpot(detailButton.dataset.detail);return;}
    const official=event.target.closest('[data-official]');if(official)metrics.track('official_click',{spot_id:official.dataset.official,placement:'detail'});
    const maps=event.target.closest('[data-map-link]');if(maps)metrics.track('map_open',{spot_id:maps.dataset.mapLink,placement:'directions'});
  });
  $('affiliate').addEventListener('click',()=>metrics.track('affiliate_click',{partner:config.affiliate.partner,placement:'stay-banner'}));
  $('detail-close').addEventListener('click',()=>$('detail').close());
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>$(button.dataset.close).close()));
  $('privacy-open').addEventListener('click',()=>$('privacy').showModal());$('credits-open').addEventListener('click',()=>$('credits').showModal());
  function consentChoice(yes) {
    metrics.setConsent(yes);
    $('consent-banner').hidden = true;
    $('consent-result').textContent = config.mode === 'preview' ? 'この確認版では外部送信しません。' : yes ? 'アクセス計測を許可しました。' : '計測しない設定にしました。';
  }
  $('consent-no').addEventListener('click',()=>consentChoice(false));
  $('consent-yes').addEventListener('click',()=>consentChoice(true));
  $('banner-consent-no').addEventListener('click',()=>consentChoice(false));
  $('banner-consent-yes').addEventListener('click',()=>consentChoice(true));
  if (config.mode === 'live') {
    $('privacy-copy').textContent = '許可した場合に限り、Googleアナリティクスで閲覧と広告クリックを集計します。拒否しても検索や保存はそのまま利用できます。';
    try { $('consent-banner').hidden = localStorage.getItem(config.ownerOptOutKey) === '1' || localStorage.getItem(config.consentKey) !== null; } catch (_) { $('consent-banner').hidden = false; }
  }
  window.addEventListener('popstate',()=>{applyUrl();render();});
  applyUrl();syncSaved();
  fetch(new URL('data/spots.json', document.currentScript.src)).then(response=>{if(!response.ok)throw Error('data');return response.json();}).then(data=>{spots=data;render();}).catch(()=>{$('error').hidden=false;$('result-count').textContent='情報を取得できませんでした';});
})();
