(function(){
  'use strict';
  if(window.dogBookingTrackingReady)return;
  window.dogBookingTrackingReady=true;
  document.addEventListener('click',function(event){
    var link=event.target.closest&&event.target.closest('a[href]');
    if(!link)return;
    var url;
    try{url=new URL(link.href);}catch(e){return;}
    var jalanMaterials=['2TN3WM E0A98Y 14CS 64JTE','2TN3WM E0A98Y 14CS BW8O2'];
    if(url.hostname!=='px.a8.net'||jalanMaterials.indexOf(url.searchParams.get('a8mat'))===-1)return;
    if(typeof window.gtag==='function')window.gtag('event','affiliate_click',{
      affiliate_partner:'jalan',
      placement:link.dataset.bookingPlacement||link.dataset.place||'existing-link',
      page_path:window.location.pathname,
      link_url:link.href,
      transport_type:'beacon'
    });
  });
})();
