(function () {
  'use strict';
  if (window.DogMetrics) return;
  const dogPage = location.hostname === 'kameo3150.github.io' && /^\/izukyu-tsunagaru-map\/inu-to-(izu|atami|ito|shimoda|kawazu|higashiizu|minamiizu|nishiizu|matsuzaki|nakaizu)\//.test(location.pathname);
  const config = window.DOG_IZU_CONFIG || { mode: dogPage ? 'live' : 'preview', version: '2026-10-27', measurementId: 'G-KT9SG4RDYR', ownerOptOutKey: 'inu_to_izu_owner_optout', consentKey: 'dog_izu_analytics_consent' };
  const ALLOWED = new Set(['filter_change', 'view_spot', 'official_click', 'map_open', 'save_spot', 'affiliate_click']);
  let initialized = false;
  const temporary = new Map();
  function stored(key) { if (temporary.has(key)) return temporary.get(key); try { return localStorage.getItem(key); } catch (_) { return null; } }
  function remember(key, value) { try { localStorage.setItem(key, value); temporary.delete(key); return true; } catch (_) { temporary.set(key, value); return false; } }
  function syncDisabled() { window['ga-disable-' + config.measurementId] = !permitted(); }
  function permitted() {
    return config.mode === 'live' && stored(config.ownerOptOutKey) !== '1' && stored(config.consentKey) === 'yes' && /\/inu-to-(izu|atami|ito|shimoda|kawazu|higashiizu|minamiizu|nishiizu|matsuzaki|nakaizu)\//.test(location.pathname);
  }
  function initialize() {
    if (initialized || !permitted()) return;
    initialized = true;
    syncDisabled();
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { if (permitted()) window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', config.measurementId, { send_page_view: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.measurementId);
    document.head.append(script);
  }
  function track(name, input) {
    if (!ALLOWED.has(name) || !permitted()) return false;
    initialize();
    // Only enumerated product metadata. Never send searches, coordinates, or user-entered text.
    const fields = ['spot_id', 'region', 'category', 'placement', 'partner', 'filter_type', 'enabled'];
    const payload = { site_version: config.version, transport_type: 'beacon' };
    for (const field of fields) if (input && Object.hasOwn(input, field)) payload[field] = input[field];
    window.gtag('event', name, payload);
    return true;
  }
  function setConsent(yes) {
    const persistent = remember(config.consentKey, yes ? 'yes' : 'no');
    syncDisabled();
    if (yes) initialize();
    return persistent;
  }
  function setOwnerExcluded(yes) {
    const persistent = remember(config.ownerOptOutKey, yes ? '1' : '0');
    syncDisabled();
    if (!yes) initialize();
    return persistent;
  }
  function getState() { return { consent: stored(config.consentKey), ownerExcluded: stored(config.ownerOptOutKey) === '1', mode: config.mode }; }
  window.DogMetrics = Object.freeze({ track, initialize, setConsent, setOwnerExcluded, getState });
  if (typeof window.addEventListener === 'function') window.addEventListener('storage', function(event) {
    if (event.key !== config.consentKey && event.key !== config.ownerOptOutKey && event.key !== null) return;
    if (event.key === null) temporary.clear(); else temporary.delete(event.key);
    syncDisabled(); initialize();
  });
  syncDisabled();
  initialize();
})();
