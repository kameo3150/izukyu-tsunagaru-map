const map = L.map('map', {
  zoomControl: true,
  attributionControl: true,
  zoomAnimation: true,
  fadeAnimation: true,
  markerZoomAnimation: true,
  inertia: true,
  easeLinearity: 0.18
}).setView([34.6787, 138.9510], 12.6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// β0.1はレイアウト確認用。施設情報の本登録は次段階で公式確認して追加する。
const places = [
  {
    name: 'AMMOS PET FRIENDLY HOTEL',
    area: '外浦・柿崎',
    lat: 34.6731041,
    lng: 138.9745751,
    type: 'stay',
    emoji: '🏨',
    rain: true,
    large: true,
    tags: ['愛犬と宿泊', '外浦海岸すぐ', '犬用料理'],
    note: '公式住所（静岡県下田市柿崎782-1）をもとに位置を確認済みです。詳細条件は施設ページで整理予定。',
    kicker: '公式情報確認済み'
  },
  {
    name: '外浦海岸エリア',
    area: '外浦',
    lat: 34.6750792,
    lng: 138.9724417,
    type: 'play',
    emoji: '🏖️',
    rain: false,
    large: true,
    tags: ['海・散歩', '大型犬候補'],
    note: '外浦海水浴場の位置に合わせて配置。犬連れ条件を確認して正式データに更新します。',
    kicker: '調査中'
  },
  {
    name: '白浜エリア',
    area: '白浜',
    lat: 34.7018,
    lng: 138.9728,
    type: 'stay',
    emoji: '🏨',
    rain: true,
    large: true,
    tags: ['宿泊候補', '海沿い'],
    note: '犬連れ宿・カフェを順次追加するためのエリア表示です。',
    kicker: '調査中'
  },
  {
    name: '下田駅・街なかエリア',
    area: '東本郷・旧町',
    lat: 34.6796,
    lng: 138.9447,
    type: 'eat',
    emoji: '🍴',
    rain: true,
    large: false,
    tags: ['飲食店候補', '街歩き'],
    note: '店内同伴・テラス・犬サイズなどを確認してから正式掲載します。',
    kicker: '調査中'
  },
  {
    name: '下田公園エリア',
    area: '三丁目',
    lat: 34.6716,
    lng: 138.9438,
    type: 'play',
    emoji: '🐾',
    rain: false,
    large: true,
    tags: ['散歩', '景色'],
    note: '散歩スポットとしての使いやすさを調査予定です。',
    kicker: '調査中'
  },
  {
    name: '吉佐美エリア',
    area: '吉佐美',
    lat: 34.6519,
    lng: 138.9318,
    type: 'eat',
    emoji: '🍴',
    rain: false,
    large: true,
    tags: ['カフェ候補', '海・散歩'],
    note: '犬連れで食事できる店と海遊び情報をまとめる予定です。',
    kicker: '調査中'
  },
  {
    name: '爪木崎エリア',
    area: '須崎',
    lat: 34.6602,
    lng: 138.9870,
    type: 'play',
    emoji: '🐾',
    rain: false,
    large: true,
    tags: ['散歩', '景勝地'],
    note: '現地ルールと季節ごとの使いやすさを整理して掲載予定です。',
    kicker: '調査中'
  }
];

const detailCard = document.getElementById('detailCard');
const cardKicker = document.getElementById('cardKicker');
const cardTitle = document.getElementById('cardTitle');
const cardArea = document.getElementById('cardArea');
const cardTags = document.getElementById('cardTags');
const cardNote = document.getElementById('cardNote');
const closeCard = document.getElementById('closeCard');
const mapStatus = document.getElementById('mapStatus');
const markers = [];

function markerIcon(place) {
  return L.divIcon({
    className: '',
    html: `<div class="soft-marker ${place.type}"><span>${place.emoji}</span></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 39]
  });
}

function openPlace(place, marker) {
  cardKicker.textContent = place.kicker;
  cardTitle.textContent = place.name;
  cardArea.textContent = place.area;
  cardTags.innerHTML = place.tags.map(tag => `<span>${tag}</span>`).join('');
  cardNote.textContent = place.note;
  detailCard.classList.add('open');
  detailCard.setAttribute('aria-hidden', 'false');
  mapStatus.style.opacity = '0';
  const target = marker.getLatLng();
  map.flyTo([target.lat + 0.006, target.lng], Math.max(map.getZoom(), 13.8), { duration: 0.65 });
}

places.forEach(place => {
  const marker = L.marker([place.lat, place.lng], { icon: markerIcon(place), riseOnHover: true }).addTo(map);
  marker.on('click', () => openPlace(place, marker));
  markers.push({ marker, place });
});

function closeDetail() {
  detailCard.classList.remove('open');
  detailCard.setAttribute('aria-hidden', 'true');
  mapStatus.style.opacity = '1';
}
closeCard.addEventListener('click', closeDetail);
map.on('click', closeDetail);

function applyFilter(filter) {
  markers.forEach(({ marker, place }) => {
    const show = filter === 'all' || place.type === filter || (filter === 'rain' && place.rain) || (filter === 'large' && place.large);
    if (show && !map.hasLayer(marker)) marker.addTo(map);
    if (!show && map.hasLayer(marker)) marker.removeFrom(map);
  });
  closeDetail();
}

document.querySelectorAll('.filter-chip').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    applyFilter(button.dataset.filter);
  });
});

const locateButton = document.getElementById('locateButton');
let userMarker;
locateButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    mapStatus.textContent = 'この端末では現在地を取得できません';
    return;
  }
  mapStatus.style.opacity = '1';
  mapStatus.textContent = '現在地を確認しています…';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const here = [pos.coords.latitude, pos.coords.longitude];
      if (userMarker) userMarker.remove();
      userMarker = L.circleMarker(here, {
        radius: 8,
        color: '#ffffff',
        weight: 3,
        fillColor: '#38777c',
        fillOpacity: 1
      }).addTo(map);
      map.flyTo(here, 15, { duration: 0.8 });
      mapStatus.textContent = '現在地を表示中';
    },
    () => { mapStatus.textContent = '現在地を取得できませんでした'; },
    { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 }
  );
});

const menuButton = document.getElementById('menuButton');
const menuPanel = document.getElementById('menuPanel');
const closeMenu = document.getElementById('closeMenu');
const scrim = document.getElementById('scrim');

function openMenu() {
  scrim.hidden = false;
  requestAnimationFrame(() => scrim.classList.add('show'));
  menuPanel.classList.add('open');
  menuPanel.setAttribute('aria-hidden', 'false');
}
function hideMenu() {
  scrim.classList.remove('show');
  menuPanel.classList.remove('open');
  menuPanel.setAttribute('aria-hidden', 'true');
  setTimeout(() => { scrim.hidden = true; }, 280);
}
menuButton.addEventListener('click', openMenu);
closeMenu.addEventListener('click', hideMenu);
scrim.addEventListener('click', hideMenu);

window.addEventListener('resize', () => map.invalidateSize());
setTimeout(() => map.invalidateSize(), 250);