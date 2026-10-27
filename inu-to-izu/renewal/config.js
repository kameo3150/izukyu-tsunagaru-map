/* One configuration for the rebuild. Preview never sends analytics. */
window.DOG_IZU_CONFIG = Object.freeze({
  mode: location.hostname === 'kameo3150.github.io' && /^\/izukyu-tsunagaru-map\/inu-to-izu\/(?:index\.html)?$/.test(location.pathname) ? 'live' : 'preview',
  version: '2026-10-25',
  measurementId: 'G-KT9SG4RDYR',
  propertyId: '555642566',
  ownerOptOutKey: 'inu_to_izu_owner_optout',
  consentKey: 'dog_izu_analytics_consent',
  affiliate: Object.freeze({
    partner: 'jalan',
    url: 'https://px.a8.net/svt/ejp?a8mat=2TN3WM+E0A98Y+14CS+64JTE',
    destinationVerified: true,
    programTermsVerified: false,
    conversionReportingVerified: false
  })
});
