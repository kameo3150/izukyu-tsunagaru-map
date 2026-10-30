(function () {
  'use strict';
  document.querySelectorAll('details[data-spot]').forEach(function (detail) {
    var tracked = false;
    detail.addEventListener('toggle', function () {
      if (!detail.open || tracked || !window.DogMetrics) return;
      tracked = window.DogMetrics.track('view_spot', { spot_id: detail.dataset.spot, region: 'ito', category: 'rainy-day' });
    });
  });
  document.querySelectorAll('a[data-official]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.DogMetrics) window.DogMetrics.track('official_click', { spot_id: link.dataset.official, region: 'ito', placement: 'rainy-day-feature' });
    });
  });
})();
