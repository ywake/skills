/*
 * ワイヤー共通シェル（雛形）
 *
 * 2画面以上に出てくる部分（ナビ・ヘッダ・バナー・モーダル外枠・確認ダイアログ）を
 * ここ1か所に持つ。各ページは中身を書かず、プレースホルダだけを置く:
 *
 *   <div data-wf="nav" data-active="01"></div>
 *   <div data-wf="confirm" data-id="deleteConfirm" data-title="削除しますか？" data-action="削除">
 *     …本文（対象の明示や影響範囲。<strong> 等を含んでよい）…
 *   </div>
 *
 * ページごとにコピーすると複製が黙って分岐し、「画面ごとの仕様差」なのか
 * 「描き落とし」なのかが読み手に区別できなくなる。共通部分は必ずここに置く。
 * classic script なので file:// で直接開いても動く（zip で渡す前提を壊さない）。
 *
 * 使い方:
 * 1. このファイルを wireframes/assets/shell.js にコピーする
 * 2. TODO の付いた builder（NAV_ITEMS / nav / tabbar）をプロジェクトに合わせて書き換える
 * 3. 各ページの <head> で lucide の次に読み込む
 */
(function () {
  'use strict';

  /* ============ アイコン（lucide） ============ */

  function icon(name, cls) {
    return '<i data-lucide="' + name + '"' + (cls ? ' class="' + cls + '"' : '') + '></i>';
  }

  // <i data-lucide> をインライン SVG に変換する。JS で markup を差し込んだあとは再度呼ぶ
  window.wfIcons = function () {
    if (window.lucide) lucide.createIcons();
  };

  /* ============ 開閉ヘルパー ============ */

  // onclick に document.getElementById(...).classList... を直接書くと
  // 同じ式が何十回も並ぶため、意図が読める名前で包む
  window.wfOpen   = function (id) { document.getElementById(id).classList.remove('hidden'); };
  window.wfClose  = function (id) { document.getElementById(id).classList.add('hidden'); };
  window.wfToggle = function (id) { document.getElementById(id).classList.toggle('hidden'); };

  /* ============ 丸ごと生成するパーツ ============ */
  // 中身を持たない共通部分（ナビ・ヘッダ・告知バナー等）は markup ごとここで生成する。
  // TODO: プロジェクトの画面構成に合わせて書き換える

  var NAV_ITEMS = [
    { id: '01', href: '01-screen-a.html',    icon: 'book-open', label: '画面A' },
    { id: '02', href: '02-next-screen.html', icon: 'list',      label: '画面B' }
  ];

  // デスクトップのサイドナビ。<div data-wf="nav" data-active="01"></div> で置き、
  // data-active に現在画面の番号を渡す
  function nav(data) {
    var items = NAV_ITEMS.map(function (m) {
      var current = m.id === data.active;
      return '<a href="' + m.href + '" class="flex items-center gap-2 rounded px-2 py-1 ' +
             (current ? 'bg-neutral-100' : 'hover:bg-neutral-100') + '">' +
             icon(m.icon) + m.label + '</a>';
    }).join('');
    return '<nav class="w-44 shrink-0 border-r border-neutral-200 p-3 space-y-1 text-sm">' +
             '<div class="font-bold mb-2">PJ名</div>' + items +
           '</nav>';
  }

  // モバイルの下部タブ。使い方は nav と同じ（<div data-wf="tabbar" data-active="01"></div>）
  function tabbar(data) {
    var items = NAV_ITEMS.map(function (m) {
      var current = m.id === data.active;
      return '<a href="' + m.href + '" class="flex flex-col items-center gap-0.5 flex-1 py-2 text-[10px] ' +
             (current ? 'text-neutral-900 font-bold' : 'text-neutral-400') + '">' +
             icon(m.icon, 'text-lg') + m.label + '</a>';
    }).join('');
    return '<nav class="shrink-0 border-t border-neutral-200 flex bg-white">' + items + '</nav>';
  }

  /* ============ 外枠だけ包むパーツ（モーダル / 確認ダイアログ） ============ */
  // フォームのフィールド構成は画面ごとに別物なので共通化せず、
  // 全画面で同一になるオーバーレイ・パネル・見出し行・フッターだけをここが受け持つ。

  // 確認ダイアログはフォームより上に出す必要があるので、重ね順だけ分ける
  function overlayClass(z) {
    return 'hidden absolute inset-0 ' + z + ' bg-neutral-900/40 flex items-center justify-center';
  }

  function panelClass(width, scroll, maxh) {
    return 'w-[' + width + 'px] ' + (scroll ? 'max-h-[' + (maxh || '720') + 'px] ' : '') +
           'bg-white border border-neutral-400 rounded-xl shadow-xl overflow-hidden' +
           (scroll ? ' flex flex-col' : '');
  }

  // 見出し行（タイトル＋閉じるボタン）。フォーム系モーダルで共通
  function modalHead(id, title, scroll) {
    return '<div class="' + (scroll ? 'shrink-0 ' : '') +
             'px-5 py-3 border-b border-neutral-300 flex items-center justify-between">' +
             '<p class="text-sm font-bold">' + title + '</p>' +
             '<button onclick="wfClose(\'' + id + '\')" class="text-neutral-500 hover:text-neutral-800">' +
               icon('x') +
             '</button>' +
           '</div>';
  }

  /*
   * フォーム系モーダルの外枠。
   *   <div data-wf="modal" data-id="editForm" data-title="◯◯の編集" data-width="520">
   *     …本体と、そのページ固有のフッター…
   *   </div>
   * 縦に長い中身は data-scroll="true"（と任意の data-maxh）で本文だけ枠内スクロールさせる。
   */
  function wrapModal(el) {
    var d = el.dataset;
    var scroll = d.scroll === 'true';
    var overlay = document.createElement('div');
    overlay.id = d.id;
    overlay.className = overlayClass('z-30');

    var panel = document.createElement('div');
    panel.className = panelClass(d.width || '520', scroll, d.maxh);
    panel.innerHTML = modalHead(d.id, d.title || '', scroll);

    // ページが書いた子要素をそのまま本体として移す（組み立て直さないので中身は無傷）
    while (el.firstChild) panel.appendChild(el.firstChild);
    overlay.appendChild(panel);
    el.replaceWith(overlay);
  }

  /*
   * 確認ダイアログ。見出し・本文・実行ボタンの3点だけが画面ごとに違い、外側は全部同じ。
   *   <div data-wf="confirm" data-id="deleteConfirm" data-title="削除しますか？" data-action="削除">
   *     …本文…
   *   </div>
   * 実行ボタンは既定で赤（破壊的操作）。取り消しではない実行は data-tone="neutral"。
   * 既定の onclick は閉じるだけ。差し替えるときは data-on-action / data-on-cancel。
   * 幅の既定は 420px（desktop 向け）。phone は枠 375px に収まるよう data-width で絞る。
   */
  function wrapConfirm(el) {
    var d = el.dataset;
    var danger = d.tone !== 'neutral';
    var overlay = document.createElement('div');
    overlay.id = d.id;
    overlay.className = overlayClass('z-40'); // 常にフォームより上

    var panel = document.createElement('div');
    panel.className = panelClass(d.width || '420');

    var body = document.createElement('div');
    body.className = 'p-5';
    body.innerHTML = '<p class="text-sm font-bold">' + (d.title || '') + '</p>';
    while (el.firstChild) body.appendChild(el.firstChild);

    var actionCls = danger
      ? 'bg-red-600 text-white rounded px-4 py-1.5 text-sm font-bold hover:bg-red-700'
      : 'bg-neutral-700 text-white rounded px-4 py-1.5 text-sm font-bold hover:bg-neutral-800';
    var foot =
      '<div class="px-5 py-3 border-t border-neutral-300 flex items-center justify-end gap-2">' +
        '<button onclick="' + (d.onCancel || "wfClose('" + d.id + "')") + '" ' +
                'class="border border-neutral-400 rounded px-4 py-1.5 text-sm hover:bg-neutral-100">キャンセル</button>' +
        '<button onclick="' + (d.onAction || "wfClose('" + d.id + "')") + '" ' +
                'class="' + actionCls + '">' + (d.action || 'OK') + '</button>' +
      '</div>';

    panel.appendChild(body);
    panel.insertAdjacentHTML('beforeend', foot);
    overlay.appendChild(panel);
    el.replaceWith(overlay);
  }

  /* ============ 登録と描画 ============ */

  var BUILDERS = { 'nav': nav, 'tabbar': tabbar };
  var WRAPPERS = { 'modal': wrapModal, 'confirm': wrapConfirm };

  // 追加パーツの登録口。一部の画面群だけで使う共通パーツ（チャット画面のサイドバー等）を
  // 別ファイルから足せる。mode 'wrap' は子要素を保ったまま外枠で包むパーツ用
  window.wfRegister = function (kind, fn, mode) {
    if (mode === 'wrap') WRAPPERS[kind] = fn;
    else BUILDERS[kind] = fn;
  };

  /* ============ URL ハッシュで状態を直接開く ============ */
  // 02-screen.html#editForm → そのモーダルが開いた状態で表示される。
  // index から「開いた状態」へ直接リンクでき、レビュアーがトグルを探さなくてよくなる。
  // 排他状態（3状態切替等）を持つページは window.wfShowState を定義してそちらに委ねる
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    if (typeof window.wfShowState === 'function') { window.wfShowState(id); return; }
    var el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }

  function render() {
    // 差し替えた markup がさらにプレースホルダを含むことがあるので、無くなるまで繰り返す
    for (var pass = 0; pass < 5; pass++) {
      var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-wf]'))
        .filter(function (el) {
          var k = el.getAttribute('data-wf');
          return BUILDERS[k] || WRAPPERS[k];
        });
      if (!nodes.length) break;
      nodes.forEach(function (el) {
        var kind = el.getAttribute('data-wf');
        // 中身を持たないパーツは丸ごと置換、modal / confirm は子要素を保って外枠で包む
        if (BUILDERS[kind]) { el.outerHTML = BUILDERS[kind](el.dataset); return; }
        WRAPPERS[kind](el);
      });
    }
    wfIcons();
    openFromHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
