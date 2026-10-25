(function () {
  'use strict';
  const config = window.DOG_IZU_CONFIG;
  const ALLOWED = new Set(['filter_change', 'view_spot', 'official_click', 'map_open', 'save_spot', 'affiliate_click']);
  let initialized = false;
  function stored(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function permitted() {
    return config.mode === 'live' && stored(config.ownerOptOutKey) !== '1' && stored(config.consentKey) === 'yes' && /\/inu-to-(izu|atami|ito|shimoda|kawazu|higashiizu|minamiizu|nishiizu|matsuzaki|nakaizu)\//.test(location.pathname);
  }
  function initialize() {
    if (initialized || !permitted()) return;
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
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
    try { localStorage.setItem(config.consentKey, yes ? 'yes' : 'no'); } catch (_) {}
    if (!yes) window['ga-disable-' + config.measurementId] = true;
    else { window['ga-disable-' + config.measurementId] = stored(config.ownerOptOutKey) === '1'; initialize(); }
  }
  window.DogMetrics = Object.freeze({ track, initialize, setConsent });
  initialize();
})();
