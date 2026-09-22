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
    verified: true,
    tags: ['愛犬と宿泊', '外浦海岸すぐ', '犬用料理'],
    note: '公式住所（静岡県下田市柿崎782-1）をもとに位置を確認済みです。詳細条件は施設ページで整理予定。',
    kicker: '公式情報確認済み'
  },
  {
    name: '下田プリンスホテル',
    area: '白浜',
    lat: 34.6966015,
    lng: 138.9734914,
    type: 'stay',
    emoji: '🏨',
    rain: true,
    large: false,
    verified: true,
    tags: ['愛犬と宿泊', 'ドッグラン', 'ビーチアクセス', '犬同伴カフェあり'],
    note: '公式サイトでワンちゃん同伴宿泊、ドッグラン、ビーチアクセス、犬と一緒に利用できる「Two Tails cafe」を確認。犬種・宿泊条件は予約前に公式案内を確認してください。',
    kicker: '公式情報確認済み'
  },
  {
    name: '下田海中水族館',
    area: '三丁目',
    lat: 34.66608,
    lng: 138.94598,
    type: 'play',
    emoji: '🐬',
    rain: true,
    large: false,
    verified: true,
    tags: ['中小型犬', 'カート・ケージ', '抱っこ可', '館内同伴条件あり'],
    note: '公式案内では中小型犬（10kg程度まで）は、カート・ケージ・バッグ、または小型犬の抱っこで入館可能。通路等へ降ろすことはできず、飲食店舗への同伴は不可です。',
    kicker: '公式情報確認済み'
  },
  {
    name: 'ドッグガーデン びわの木',
    area: '本郷',
    lat: 34.69465965,
    lng: 138.93984851,
    type: 'eat',
    emoji: '☕',
    rain: true,
    large: true,
    verified: true,
    tags: ['ドッグカフェ', '芝生のドッグガーデン', '店内同伴OK', '大型犬OK', '犬用品'],
    note: '公式サイトで、犬グッズ専門店とワンコが遊べる喫茶店、芝生のドッグガーデン併設を確認。住所は静岡県下田市本郷1-1、営業時間は10:00〜18:00、火・水曜定休（正月・祝祭日は営業）。全犬種対応の案内も確認できます。',
    kicker: '公式情報確認済み'
  },
  {
    name: 'south cafe',
    area: '吉佐美',
    lat: 34.66342608,
    lng: 138.91634651,
    type: 'eat',
    emoji: '☕',
    rain: true,
    large: true,
    verified: true,
    tags: ['カフェ', '店内犬同伴OK', 'ペット可', '駐車場あり'],
    note: '公式サイトで住所（静岡県下田市吉佐美918-2）と現行営業時間11:00〜18:00・木曜定休を確認。Honda Dogでは店内も犬同伴OKと案内されています。Yahoo!マップの施設ピン位置を座標に採用しています。',
    kicker: '確認済み'
  },
  {
    name: 'FermenCo.',
    area: '吉佐美・入田浜',
    lat: 34.65801496,
    lng: 138.92516372,
    type: 'eat',
    emoji: '🍕',
    rain: false,
    large: false,
    verified: true,
    tags: ['ピッツェリア', 'ペット同伴可', 'テラス席あり', '駐車場あり'],
    note: '住所は静岡県下田市吉佐美348-37。Yahoo!マップでペット同伴可、食べログでテラス席ありを確認。犬同伴の細かな条件は来店前に店舗へ確認するのがおすすめです。Yahoo!マップの施設ピン位置を座標に採用しています。',
    kicker: '確認済み'
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
    verified: false,
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
    verified: false,
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
    verified: false,
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
    verified: false,
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
    verified: false,
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
    verified: false,
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
const searchInput = document.getElementById('searchInput');
const placeList = document.getElementById('placeList');
const resultCount = document.getElementById('resultCount');
const markers = [];
let activeFilter = 'all';
let searchTerm = '';

function markerIcon(place) {
  return L.divIcon({
    className: '',
    html: `<div class="soft-marker ${place.type} ${place.verified ? '' : 'research'}"><span>${place.emoji}</span></div>`,
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

function matches(place) {
  const filterMatch =
    activeFilter === 'all' ||
    place.type === activeFilter ||
    (activeFilter === 'rain' && place.rain) ||
    (activeFilter === 'large' && place.large);

  const haystack = [place.name, place.area, ...place.tags].join(' ').toLowerCase();
  const searchMatch = !searchTerm || haystack.includes(searchTerm);
  return filterMatch && searchMatch;
}

function renderVisiblePlaces() {
  const visible = [];

  markers.forEach(({ marker, place }) => {
    const show = matches(place);
    if (show && !map.hasLayer(marker)) marker.addTo(map);
    if (!show && map.hasLayer(marker)) marker.removeFrom(map);
    if (show) visible.push(place);
  });

  resultCount.textContent = `${visible.length}件表示`;
  placeList.innerHTML = visible.map(place => {
    const markerIndex = places.indexOf(place);
    return `
      <button class="place-item" type="button" data-place-index="${markerIndex}">
        <div class="row">
          <div>
            <strong>${place.emoji} ${place.name}</strong>
            <small>${place.area}</small>
          </div>
          <span class="status ${place.verified ? '' : 'research'}">${place.verified ? '確認済み' : '調査中'}</span>
        </div>
        <div class="tags">${place.tags.join(' ・ ')}</div>
      </button>
    `;
  }).join('');

  if (!visible.length) {
    placeList.innerHTML = '<div class="place-item">条件に合うスポットはまだありません。</div>';
  }

  closeDetail();
}

document.querySelectorAll('.filter-chip').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderVisiblePlaces();
  });
});

searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderVisiblePlaces();
});

placeList.addEventListener('click', event => {
  const button = event.target.closest('[data-place-index]');
  if (!button) return;
  const index = Number(button.dataset.placeIndex);
  const entry = markers[index];
  if (!entry) return;
  hideList();
  openPlace(entry.place, entry.marker);
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
const listButton = document.getElementById('listButton');
const listPanel = document.getElementById('listPanel');
const closeList = document.getElementById('closeList');
const menuListButton = document.getElementById('menuListButton');

function showScrim() {
  scrim.hidden = false;
  requestAnimationFrame(() => scrim.classList.add('show'));
}
function hideScrimIfClosed() {
  if (!menuPanel.classList.contains('open') && !listPanel.classList.contains('open')) {
    scrim.classList.remove('show');
    setTimeout(() => { scrim.hidden = true; }, 280);
  }
}
function openMenu() {
  listPanel.classList.remove('open');
  listPanel.setAttribute('aria-hidden', 'true');
  showScrim();
  menuPanel.classList.add('open');
  menuPanel.setAttribute('aria-hidden', 'false');
}
function hideMenu() {
  menuPanel.classList.remove('open');
  menuPanel.setAttribute('aria-hidden', 'true');
  hideScrimIfClosed();
}
function openList() {
  menuPanel.classList.remove('open');
  menuPanel.setAttribute('aria-hidden', 'true');
  renderVisiblePlaces();
  showScrim();
  listPanel.classList.add('open');
  listPanel.setAttribute('aria-hidden', 'false');
}
function hideList() {
  listPanel.classList.remove('open');
  listPanel.setAttribute('aria-hidden', 'true');
  hideScrimIfClosed();
}
function closePanels() {
  menuPanel.classList.remove('open');
  listPanel.classList.remove('open');
  menuPanel.setAttribute('aria-hidden', 'true');
  listPanel.setAttribute('aria-hidden', 'true');
  hideScrimIfClosed();
}

menuButton.addEventListener('click', openMenu);
closeMenu.addEventListener('click', hideMenu);
listButton.addEventListener('click', openList);
closeList.addEventListener('click', hideList);
menuListButton.addEventListener('click', openList);
scrim.addEventListener('click', closePanels);

renderVisiblePlaces();
window.addEventListener('resize', () => map.invalidateSize());
setTimeout(() => map.invalidateSize(), 250);