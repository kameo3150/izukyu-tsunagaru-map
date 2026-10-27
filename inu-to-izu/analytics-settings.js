(function () {
  'use strict';
  const metrics = window.DogMetrics;
  if (!metrics || metrics.getState().mode !== 'live') return;
  const style = document.createElement('style');
  style.textContent = '.dog-metrics-panel{position:fixed;z-index:120;bottom:60px;left:16px;right:16px;max-width:610px;margin:auto;padding:18px;background:#fff;color:#263238;border:1px solid #b9cdcc;border-radius:12px;box-shadow:0 8px 35px #15244830;font:14px/1.7 sans-serif}.dog-metrics-panel p{margin:0 0 10px}.dog-metrics-controls{display:flex;flex-wrap:wrap;gap:8px}.dog-metrics-controls button,.dog-metrics-open{font:12px/1.5 sans-serif;min-height:44px;padding:9px 13px;background:#edf5f3;color:#244e50;border:1px solid #b9cdcc;border-radius:7px;cursor:pointer}.dog-metrics-open{position:fixed;z-index:45;right:12px;bottom:12px;box-shadow:0 2px 10px #15244820}.dog-metrics-controls button:focus-visible,.dog-metrics-open:focus-visible{outline:3px solid #d77c17;outline-offset:3px}.dog-metrics-owner{border-top:1px solid #dce2e8;margin-top:18px;padding-top:14px}.dog-metrics-owner p{font-size:12px;line-height:1.7}.dog-metrics-owner button{font-size:12px;min-height:44px;padding:9px 13px;border:1px solid #b9cdcc;border-radius:7px;background:#edf5f3;color:#244e50;cursor:pointer}';
  document.head.append(style);
  function ownerControls(container) {
    const section = document.createElement('div');
    section.className = 'dog-metrics-owner';
    const text = document.createElement('p');
    const button = document.createElement('button');
    button.type = 'button';
    const result = document.createElement('p');
    result.setAttribute('role', 'status');
    function refresh() {
      const excluded = metrics.getState().ownerExcluded;
      const banner = document.getElementById('consent-banner');
      if (banner) banner.hidden = excluded || metrics.getState().consent !== null;
      text.textContent = excluded ? 'このブラウザは、閲覧・操作の計測から除外しています。' : '運営者・制作確認用：このブラウザの閲覧を計測から除外できます。設定は端末・ブラウザごとに必要です。';
      button.textContent = excluded ? 'このブラウザの除外を解除する' : 'このブラウザの閲覧を除外する';
    }
    button.addEventListener('click', function () {
      const persistent = metrics.setOwnerExcluded(!metrics.getState().ownerExcluded);
      refresh();
      result.textContent = persistent ? '設定を保存しました。過去のアクセスは変更しません。' : '保存できないため、このページを開いている間だけ反映します。';
    });
    section.append(text, button, result); container.append(section); refresh();
  }
  const privacy = document.getElementById('privacy');
  if (privacy && document.getElementById('consent-banner')) {
    ownerControls(privacy);
    return;
  }
  const panel = document.createElement('aside');
  panel.className = 'dog-metrics-panel';
  panel.setAttribute('aria-label', 'アクセス計測の設定');
  const message = document.createElement('p');
  message.textContent = '閲覧状況の計測を許可しますか？ 拒否してもサイトを利用できます。';
  const controls = document.createElement('div'); controls.className = 'dog-metrics-controls';
  const status = document.createElement('p'); status.setAttribute('role', 'status');
  [['許可しない', false], ['許可する', true]].forEach(function ([label, yes]) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    button.addEventListener('click', function () {
      const persistent = metrics.setConsent(yes);
      status.textContent = (yes ? '計測を許可しました。' : '計測しない設定です。') + (persistent ? '' : ' このページを開いている間だけ反映します。');
      panel.hidden = true;
    });
    controls.append(button);
  });
  const close = document.createElement('button'); close.type = 'button'; close.textContent = '閉じる';
  close.addEventListener('click', function () { panel.hidden = true; }); controls.append(close);
  panel.append(message, controls, status); ownerControls(panel);
  const open = document.createElement('button'); open.type = 'button'; open.className = 'dog-metrics-open'; open.textContent = 'アクセス計測設定';
  open.addEventListener('click', function () {
    const state = metrics.getState();
    status.textContent = state.ownerExcluded ? 'このブラウザは除外中です。' : state.consent === 'yes' ? '現在は計測を許可しています。' : '現在は計測していません。';
    panel.hidden = !panel.hidden;
  });
  const state = metrics.getState(); panel.hidden = state.ownerExcluded || state.consent !== null;
  document.body.append(open, panel);
})();
