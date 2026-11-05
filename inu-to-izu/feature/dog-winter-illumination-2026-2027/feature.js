(function () {
  'use strict';
  document.querySelectorAll('a[data-official]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.DogMetrics) window.DogMetrics.track('official_click', { spot_id: link.dataset.official, region: link.dataset.region, placement: 'winter-illumination-2026' });
    });
  });
  var share = document.getElementById('share-x');
  if (share) {
    var url = new URL('https://kameo3150.github.io/izukyu-tsunagaru-map/inu-to-izu/feature/dog-winter-illumination-2026-2027/');
    url.search = 'utm_source=x&utm_medium=social&utm_campaign=winter_illumination_2026&utm_content=feature_share';
    var intent = new URL('https://twitter.com/intent/tweet');
    intent.searchParams.set('text', '今年の冬は、犬とイルミネーションへ。御殿場・浜松・さがみ湖・マザー牧場の開催日と犬の同伴条件をまとめました。大型犬と行ける期間限定イベントも。 #犬連れお出かけ #イルミネーション');
    intent.searchParams.set('url', url.href);
    share.href = intent.href;
  }
})();
