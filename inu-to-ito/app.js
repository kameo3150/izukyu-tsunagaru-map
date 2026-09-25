const map = L.map('map', {
  zoomControl: true,
  attributionControl: true,
  zoomAnimation: true,
  fadeAnimation: true,
  markerZoomAnimation: true,
  inertia: true,
  easeLinearity: 0.18
}).setView([34.8978, 139.1128], 13.2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const places = [
  {
    name:'愛犬の駅 伊豆高原', area:'八幡野・伊豆高原駅周辺',
    lat:34.883376, lng:139.1068387, type:'eat', emoji:'🍴',
    filters:['eat','play','rain','large'],
    tags:['店内犬同伴OK','屋内・屋外ドッグラン','大型犬OK','陶芸体験'],
    note:'カフェ、屋内外ドッグラン、ショップ、陶芸体験がまとまった犬連れ向け複合施設。雨の日にも使いやすいスポットです。',
    details:['店内席・テラス席とも犬同伴OK。','公式・伊東観光ガイドで大型犬OKを確認。','屋内ドッグランがあり雨天時にも利用可能。','住所：静岡県伊東市八幡野1135-1。'],
    sourceUrl:'https://www.welovedogs.jp/station/', sourceLabel:'愛犬の駅 公式サイト'
  },
  {
    name:'伊豆ぐらんぱる公園', area:'富戸',
    lat:34.905473, lng:139.120825, type:'play', emoji:'🎡',
    filters:['play'],
    tags:['犬同伴入園OK','昼は1m以内リード','夜はキャリー・カート'],
    note:'昼と夜で犬の入園条件が異なるので注意。デイタイムは1m以内のリード、ナイトタイムは専用キャリーまたはペットカートが必要です。',
    details:['昼：1m以内のリードで入園可。','夜：専用キャリーまたはペットカートを使用。','夜はリードのみ・抱っこでの入園不可。','住所：静岡県伊東市富戸1090。'],
    sourceUrl:'https://www.granpal.com/information/faq/', sourceLabel:'公式FAQを見る'
  },
  {
    name:'伊豆シャボテン動物公園', area:'富戸・大室山麓',
    lat:34.906976, lng:139.1008846, type:'play', emoji:'🌵',
    filters:['play'],
    tags:['犬同伴入園OK','1m以内リード','テラス席利用可'],
    note:'園内は犬同伴で見学できますが、動物の放し飼いエリアなど一部は同伴不可。食堂街はテラス席を利用できます。',
    details:['園内では1m以内のリードが必要。','バードパラダイス、カンガルーの丘など一部エリアは同伴不可。','飲食店内は同伴不可、食堂街テラス席は利用可。','予防接種を受けていないペットは利用不可。'],
    sourceUrl:'https://izushaboten.com/information/pet/', sourceLabel:'公式ペット案内を見る'
  },
  {
    name:'大室山登山リフト', area:'池・大室山',
    lat:34.9076345, lng:139.0969309, type:'play', emoji:'⛰️',
    filters:['play'],
    tags:['体高45cm以下','抱っこでリフト','1m以内リード','山頂散歩'],
    note:'体高45cm以下の犬は抱っこでリフトに同乗できます。山頂のお鉢めぐりは約1kmで、犬との散歩にも案内されています。',
    details:['同伴できる犬は体高45cm以下。','リフト乗車中は犬をしっかり抱っこ。','施設内では1m以内のリード。','犬のリフト運賃は無料。'],
    sourceUrl:'https://omuroyama.com/guidelines/', sourceLabel:'公式ガイドラインを見る'
  },
  {
    name:'ウブドの森 伊豆高原', area:'富戸',
    lat:34.8975022, lng:139.1251794, type:'stay', emoji:'🏨',
    filters:['stay','rain','large'],
    tags:['愛犬温泉リゾート','屋内・屋外ドッグラン','大型犬対応客室','犬用食事'],
    note:'和とバリを組み合わせた愛犬同伴の温泉リゾート。屋外と屋内のノーリードスペースがあり、雨の日も遊べます。',
    details:['全18室のうち大型犬対応客室4室。','屋外ドッグラン・屋内ドッグランを用意。','狂犬病・混合ワクチンの証明が必要。','住所：静岡県伊東市富戸1007-21。'],
    sourceUrl:'https://www.ubudnomori.jp/stay/', sourceLabel:'ウブドの森 公式案内'
  },
  {
    name:'愛犬お宿 伊豆高原', area:'富戸',
    lat:34.902429, lng:139.123629, type:'stay', emoji:'🏨',
    filters:['stay','rain'],
    tags:['愛犬同伴宿','屋内・屋外ドッグラン','レストラン同伴','温泉'],
    note:'愛犬と館内で過ごしやすい温泉リゾート。屋内・屋外ドッグラン、愛犬同伴可能なレストランやカラオケなどを備えています。',
    details:['屋内・屋外それぞれにドッグラン。','レストランはリード着用で愛犬同伴可能。','公式料金案内では愛犬の頭数制限なし。','住所：静岡県伊東市富戸1038-91。'],
    sourceUrl:'https://www.welovedogs.jp/hotel/', sourceLabel:'愛犬お宿 公式サイト'
  },
  {
    name:'レジーナリゾート伊豆無鄰', area:'八幡野',
    lat:34.8811521, lng:139.1196152, type:'stay', emoji:'♨️',
    filters:['stay','large'],
    tags:['全犬種サイズ制限なし','約200㎡ドッグラン','全室露天温泉','愛犬と食事'],
    note:'愛犬と泊まることを前提に設計された和の湯宿。犬種・大きさの制限はなく、宿泊者専用ドッグランもあります。',
    details:['犬種・大きさによる宿泊制限なし。','宿泊者専用の約200㎡人工芝ドッグラン。','全室に露天温泉と内湯。','住所：静岡県伊東市八幡野1086-88。'],
    sourceUrl:'https://www.regina-resorts.com/murin/faq/', sourceLabel:'伊豆無鄰 公式FAQ'
  },
  {
    name:'わんわんパラダイス プレミア 伊豆高原', area:'八幡野・城ヶ崎',
    lat:34.88505625, lng:139.12173652, type:'stay', emoji:'🏨',
    filters:['stay','rain'],
    tags:['愛犬リゾート','dog park','愛犬同伴レストラン','2026年リニューアル'],
    note:'旧Wan’s Resort 城ヶ崎海岸。2026年に「わんわんパラダイス プレミア 伊豆高原」としてリニューアルし、愛犬同伴の滞在を提供しています。',
    details:['2026年2月リニューアルオープン。','相模湾を望むレストランで愛犬同伴の食事。','dog parkなど犬向け設備あり。','住所：静岡県伊東市八幡野1092-2。'],
    sourceUrl:'https://iconia.co.jp/hotel-wan-wan-paradise-premier-izukogen-shizuoka', sourceLabel:'グループ公式サイト'
  },
  {
    name:'わんわんパラダイス 伊豆高原', area:'大室高原',
    lat:34.90693094, lng:139.1091714, type:'stay', emoji:'🐕',
    filters:['stay','rain'],
    tags:['ホテル・コテージ','屋内プレイスペース','複数ドッグラン','愛犬と食事'],
    note:'ホテル客室と一棟貸しコテージを備えた愛犬リゾート。2026年のリニューアルで全天候型の屋内プレイスペースも新設されています。',
    details:['2026年4月リニューアルオープン。','複数のドッグランと全天候型屋内プレイスペース。','館内は一部を除きリード着用で愛犬と一緒に過ごせる案内。','住所：静岡県伊東市大室高原3-490。'],
    sourceUrl:'https://iconia.co.jp/hotel-wan-wan-paradise-izukogen-shizuoka', sourceLabel:'グループ公式サイト'
  },
  {
    name:'ほったらかしの宿 ゆうふり伊豆高原', area:'富戸・大室高原',
    lat:34.9032487, lng:139.1125278, type:'stay', emoji:'🏡',
    filters:['stay','rain','large'],
    tags:['ドッグフレンドリールーム','大型犬OK','3つのドッグラン','犬用温水プール'],
    note:'セルフサービス型の宿。犬と泊まれる専用客室があり、屋内外3か所のドッグランと犬専用温水プールを備えています。',
    details:['大型犬や多頭飼い向けの広い客室あり。','屋外・屋上・屋内の3つのドッグラン。','公式FAQでは犬種・サイズ・頭数に制限なし。','住所：静岡県伊東市富戸1317-2132。'],
    sourceUrl:'https://yufuri-izukogen.com/dogfriendly/', sourceLabel:'ゆうふり公式 愛犬案内'
  }
];

const detailCard=document.getElementById('detailCard');
const cardKicker=document.getElementById('cardKicker');
const cardTitle=document.getElementById('cardTitle');
const cardArea=document.getElementById('cardArea');
const cardTags=document.getElementById('cardTags');
const cardNote=document.getElementById('cardNote');
const cardDetails=document.getElementById('cardDetails');
const primaryButton=document.getElementById('primaryButton');
const closeCard=document.getElementById('closeCard');
const mapStatus=document.getElementById('mapStatus');
const searchInput=document.getElementById('searchInput');
const placeList=document.getElementById('placeList');
const resultCount=document.getElementById('resultCount');

const markers=[];
let activeFilter='all';
let searchTerm='';

function markerIcon(place){
  return L.divIcon({
    className:'',
    html:`<div class="soft-marker ${place.type}"><span>${place.emoji}</span></div>`,
    iconSize:[42,42],iconAnchor:[21,39]
  });
}
function openPlace(place,marker){
  cardKicker.textContent='公式確認済み';
  cardTitle.textContent=place.name;
  cardArea.textContent=place.area;
  cardTags.innerHTML=place.tags.map(t=>`<span>${t}</span>`).join('');
  cardNote.textContent=place.note;
  cardDetails.innerHTML=place.details.map(d=>`<div class="card-detail-item">${d}</div>`).join('');
  primaryButton.innerHTML=`${place.sourceLabel} <span>↗</span>`;
  primaryButton.onclick=()=>window.open(place.sourceUrl,'_blank','noopener,noreferrer');
  detailCard.classList.add('open');
  detailCard.setAttribute('aria-hidden','false');
  mapStatus.style.opacity='0';
  const p=marker.getLatLng();
  map.flyTo([p.lat+0.004,p.lng],Math.max(map.getZoom(),14),{duration:.65});
}
places.forEach(place=>{
  const marker=L.marker([place.lat,place.lng],{icon:markerIcon(place),riseOnHover:true}).addTo(map);
  marker.on('click',()=>openPlace(place,marker));
  markers.push({place,marker});
});
function closeDetail(){
  detailCard.classList.remove('open');
  detailCard.setAttribute('aria-hidden','true');
  mapStatus.style.opacity='1';
}
closeCard.addEventListener('click',closeDetail);
map.on('click',closeDetail);

function matches(place){
  const filterMatch=activeFilter==='all'||place.filters.includes(activeFilter);
  const haystack=[place.name,place.area,...place.tags,...place.details].join(' ').toLowerCase();
  return filterMatch&&(!searchTerm||haystack.includes(searchTerm));
}
function renderVisiblePlaces(){
  const visible=[];
  markers.forEach(({place,marker})=>{
    const show=matches(place);
    if(show&&!map.hasLayer(marker)) marker.addTo(map);
    if(!show&&map.hasLayer(marker)) marker.removeFrom(map);
    if(show) visible.push(place);
  });
  resultCount.textContent=`${visible.length}件表示`;
  placeList.innerHTML=visible.map(place=>{
    const idx=places.indexOf(place);
    return `<button class="place-item" data-place-index="${idx}">
      <div class="row"><div><strong>${place.emoji} ${place.name}</strong><small>${place.area}</small></div><span class="status">確認済み</span></div>
      <div class="tags">${place.tags.join(' ・ ')}</div>
    </button>`;
  }).join('');
  closeDetail();
}
document.querySelectorAll('.filter-chip').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-chip').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');activeFilter=btn.dataset.filter;renderVisiblePlaces();
  });
});
searchInput.addEventListener('input',()=>{searchTerm=searchInput.value.trim().toLowerCase();renderVisiblePlaces();});
placeList.addEventListener('click',e=>{
  const btn=e.target.closest('[data-place-index]');if(!btn)return;
  const entry=markers[Number(btn.dataset.placeIndex)];hideList();openPlace(entry.place,entry.marker);
});

const locateButton=document.getElementById('locateButton');
let userMarker;
locateButton.addEventListener('click',()=>{
  if(!navigator.geolocation){mapStatus.textContent='この端末では現在地を取得できません';return;}
  mapStatus.style.opacity='1';mapStatus.textContent='現在地を確認しています…';
  navigator.geolocation.getCurrentPosition(
    pos=>{
      const here=[pos.coords.latitude,pos.coords.longitude];
      if(userMarker)userMarker.remove();
      userMarker=L.circleMarker(here,{radius:8,color:'#fff',weight:3,fillColor:'#547aa5',fillOpacity:1}).addTo(map);
      map.flyTo(here,15,{duration:.8});mapStatus.textContent='現在地を表示中';
    },
    ()=>{mapStatus.textContent='現在地を取得できませんでした';},
    {enableHighAccuracy:true,timeout:9000,maximumAge:30000}
  );
});

const menuButton=document.getElementById('menuButton');
const menuPanel=document.getElementById('menuPanel');
const closeMenu=document.getElementById('closeMenu');
const scrim=document.getElementById('scrim');
const listButton=document.getElementById('listButton');
const listPanel=document.getElementById('listPanel');
const closeList=document.getElementById('closeList');
const menuListButton=document.getElementById('menuListButton');

function showScrim(){scrim.hidden=false;requestAnimationFrame(()=>scrim.classList.add('show'));}
function hideScrimIfClosed(){
  if(!menuPanel.classList.contains('open')&&!listPanel.classList.contains('open')){
    scrim.classList.remove('show');setTimeout(()=>{scrim.hidden=true},280);
  }
}
function openMenu(){listPanel.classList.remove('open');listPanel.setAttribute('aria-hidden','true');showScrim();menuPanel.classList.add('open');menuPanel.setAttribute('aria-hidden','false');}
function hideMenu(){menuPanel.classList.remove('open');menuPanel.setAttribute('aria-hidden','true');hideScrimIfClosed();}
function openList(){menuPanel.classList.remove('open');menuPanel.setAttribute('aria-hidden','true');renderVisiblePlaces();showScrim();listPanel.classList.add('open');listPanel.setAttribute('aria-hidden','false');}
function hideList(){listPanel.classList.remove('open');listPanel.setAttribute('aria-hidden','true');hideScrimIfClosed();}
function closePanels(){menuPanel.classList.remove('open');listPanel.classList.remove('open');menuPanel.setAttribute('aria-hidden','true');listPanel.setAttribute('aria-hidden','true');hideScrimIfClosed();}
menuButton.addEventListener('click',openMenu);closeMenu.addEventListener('click',hideMenu);listButton.addEventListener('click',openList);closeList.addEventListener('click',hideList);menuListButton.addEventListener('click',openList);scrim.addEventListener('click',closePanels);

renderVisiblePlaces();
window.addEventListener('resize',()=>map.invalidateSize());
setTimeout(()=>map.invalidateSize(),250);