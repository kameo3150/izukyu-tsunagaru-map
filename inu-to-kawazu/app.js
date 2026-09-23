const map = L.map('map', {
  zoomControl: true,
  attributionControl: true,
  zoomAnimation: true,
  fadeAnimation: true,
  markerZoomAnimation: true,
  inertia: true,
  easeLinearity: 0.18
}).setView([34.7590, 138.9875], 13.1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const places = [
  {
    name: '和みの犬宿 むつみ庵',
    area: '見高・今井浜',
    lat: 34.76396,
    lng: 139.0056923,
    type: 'stay',
    emoji: '🏨',
    rain: true,
    large: true,
    verified: true,
    tags: ['犬宿', '約200坪ドッグラン', '大型犬OK', '客室専用展望温泉'],
    note: '相模湾と伊豆七島を望む高台の犬宿。愛犬と一緒に食事を楽しめ、広い芝生のドッグランがあります。',
    details: [
      '客室：全5室。客室には専用展望温泉を備えています。',
      'ドッグラン：約200坪の「わんこ広場」。大型犬も利用できます。',
      '食事：金目鯛や地魚など伊豆の食材を使った料理を、わんちゃんと一緒に食堂で楽しめます。',
      '住所：静岡県賀茂郡河津町見高777-7。'
    ],
    kicker: '公式・観光協会確認済み',
    sourceUrl: 'https://mutsumian.com/',
    sourceLabel: 'むつみ庵公式サイトを見る'
  },
  {
    name: '湯宿 桜ざか',
    area: '峰温泉',
    lat: 34.747349449061,
    lng: 138.9856894255,
    type: 'stay',
    emoji: '♨️',
    rain: true,
    large: false,
    verified: true,
    tags: ['全3室', '天然温泉', '屋上ドッグラン', '犬用設備'],
    note: '客室3室だけの、わんこと泊まれる天然温泉宿。竹林の露天風呂と屋上のわんこ広場が特徴です。',
    details: [
      '客室：和室3室。河津桜並木まで車で約5分。',
      '犬用設備：屋上ドッグラン、シャンプー用ドッグバス、トリミングテーブル、入口足洗い場。',
      '食事：わんちゃんと一緒にダイニングで食事できます。',
      '住所：静岡県賀茂郡河津町峰1325-486。'
    ],
    kicker: '公式・観光協会確認済み',
    sourceUrl: 'https://www.kawazu-sakurazaka.com/',
    sourceLabel: '桜ざか公式サイトを見る'
  },
  {
    name: 'ホテル四季の蔵',
    area: '峰',
    lat: 34.74933343,
    lng: 138.98209537,
    type: 'stay',
    emoji: '🏨',
    rain: true,
    large: true,
    verified: true,
    tags: ['ペットリゾート', '温泉', 'ペットスパ', '食事あり'],
    note: '河津の高台にあるペットと泊まれるリゾートホテル。温泉と伊豆の食材を使った食事を愛犬と楽しめます。',
    details: [
      '客室：観光協会掲載では全18室。',
      '設備：貸切温泉やペットスパを備えたペットリゾート。',
      '食事：地元食材を取り入れた和食・洋食を提供。',
      '住所：静岡県賀茂郡河津町峰1169-13。河津駅から送迎案内あり。'
    ],
    kicker: '公式観光情報確認済み',
    sourceUrl: 'https://www.shikinokura.com/',
    sourceLabel: '四季の蔵公式サイトを見る'
  },
  {
    name: 'わんこと家族の宿 浬世人（リセット）',
    area: '沢田',
    lat: 34.7708309,
    lng: 138.9873461,
    type: 'stay',
    emoji: '🏡',
    rain: true,
    large: true,
    verified: true,
    tags: ['一日一組・一グループ', '犬宿', '温泉', '森林浴'],
    note: '自然の中でわんこと家族がのんびり過ごせる宿。一日一組または一グループのみの受け入れです。',
    details: [
      '観光協会掲載では全5室。',
      '一日一組または一グループのみ。わんことの旅行に慣れていない方にも配慮した宿です。',
      '住所：静岡県賀茂郡河津町沢田196-4。',
      '送迎は要相談。'
    ],
    kicker: '公式観光情報確認済み',
    sourceUrl: 'https://kawazu-reset.com/',
    sourceLabel: '浬世人公式サイトを見る'
  },
  {
    name: 'Sea Shell KAWAZU House',
    area: '峰・河津川沿い',
    lat: 34.75317824,
    lng: 138.98677135,
    type: 'stay',
    emoji: '🏠',
    rain: true,
    large: false,
    verified: true,
    tags: ['一棟貸し', '愛犬同伴OK', '河津川沿い', '専用デッキ'],
    note: '河津川沿いにある愛犬同伴OKの一棟貸し。周囲を気にせず自分たちのペースで滞在できます。',
    details: [
      '一棟貸し：2階建て1LDK。専用デッキはBBQ利用可。',
      '愛犬の受け入れは1匹までと公式案内に記載されています。',
      '河津桜を楽しみやすい河津川沿いの立地。',
      '住所：静岡県賀茂郡河津町峰653-23。'
    ],
    kicker: '公式情報確認済み',
    sourceUrl: 'https://www.sea-shell.jp/dogxvacation/',
    sourceLabel: '公式の愛犬宿泊案内を見る'
  }
];

const detailCard = document.getElementById('detailCard');
const cardKicker = document.getElementById('cardKicker');
const cardTitle = document.getElementById('cardTitle');
const cardArea = document.getElementById('cardArea');
const cardTags = document.getElementById('cardTags');
const cardNote = document.getElementById('cardNote');
const cardDetails = document.getElementById('cardDetails');
const primaryButton = document.getElementById('primaryButton');
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
  cardDetails.hidden = false;
  cardDetails.innerHTML = place.details.map(item => `<div class="card-detail-item">${item}</div>`).join('');
  primaryButton.hidden = false;
  primaryButton.innerHTML = `${place.sourceLabel} <span>↗</span>`;
  primaryButton.onclick = () => window.open(place.sourceUrl, '_blank', 'noopener,noreferrer');
  detailCard.classList.add('open');
  detailCard.setAttribute('aria-hidden', 'false');
  mapStatus.style.opacity = '0';
  const target = marker.getLatLng();
  map.flyTo([target.lat + 0.005, target.lng], Math.max(map.getZoom(), 14), { duration: 0.65 });
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
  return filterMatch && (!searchTerm || haystack.includes(searchTerm));
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
          <span class="status">確認済み</span>
        </div>
        <div class="tags">${place.tags.join(' ・ ')}</div>
      </button>
    `;
  }).join('');
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
        radius: 8, color: '#fff', weight: 3, fillColor: '#9f5269', fillOpacity: 1
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
