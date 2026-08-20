/* =============================================================================
 * wf-kit.js — Penpot ワイヤーフレーム用ヘルパ（実機検証済み）
 *
 * 使い方: 最初の execute_code でこのファイルの中身をそのまま流し、`storage.WF` に
 *         載せる。storage は execute_code の呼び出しをまたいで生き残るので、
 *         2回目以降は `const WF = storage.WF;` の1行で使い回せる。
 *
 * 設計方針:
 *   - 図形を絶対座標で積まず、ボード＋フレックスレイアウトで組む。
 *     ワイヤーは何度も作り直すので、要素の増減で崩れない構造が要る。
 *   - 1ページ = 1台紙ボード。Penpot の PDF 出力は「ページ内の全ボード → 1ボード1ページ」で
 *     束ねるため、ボードの外に置いた要素は PDF に載らない。注釈も画面枠も台紙の中に入れる。
 * ========================================================================== */

storage.WF = (() => {
  // 低忠実度を強制するためのグレー階調。ブランド色はここに足さない。
  // 色は大文字の hex で書く（Penpot の要求）。
  const palette = {
    frame: '#FFFFFF',
    frameBorder: '#C9C9C9',
    box: '#EFEFEF',
    boxBorder: '#D9D9D9',
    text: '#333333',
    muted: '#8A8A8A',
    warn: '#F0E7D0',
    note: '#7A5C00',
  };

  // 実機の見え方を保つため、枠は W×H 固定。中身なりに伸縮させない。
  const devices = {
    phone: { w: 375, h: 760 },
    tablet: { w: 768, h: 1024 },
    desktop: { w: 1280, h: 800 },
  };

  const PREFIX = 'WF-';
  const created = [];
  const fill = (c) => [{ fillColor: c, fillOpacity: 1 }];
  const stroke = (c) => [{ strokeColor: c, strokeStyle: 'solid', strokeWidth: 1, strokeAlignment: 'inner' }];

  /* --- レイアウト配下のサイズ指定 ---------------------------------------
   * ここが実機で二度こけた箇所。両方ともコードは例外なく通り、書き出し画像を
   * 見るまで気づけない類の失敗なので、必ずこの関数を通してサイズを決める。
   *   (1) resize() は layoutChild の sizing を 'fix' に戻す（Text の growType と同じ挙動）
   *       → resize してから sizing を設定する。逆順だと指定が消える。
   *   (2) 寸法を指定しないまま 'fix' にすると既定の 100px で固定され、中身が枠から溢れる
   *       → 高さ未指定なら 'auto'（中身なり）にする。
   * -------------------------------------------------------------------- */
  function place(shape, { w, h, grow = false } = {}) {
    if (w || h) shape.resize(w ?? shape.width, h ?? shape.height);
    const lc = shape.layoutChild;
    if (lc) {
      lc.horizontalSizing = w ? 'fix' : 'fill';
      lc.verticalSizing = grow ? 'fill' : (h ? 'fix' : 'auto');
    }
    return shape;
  }

  /* --- 再実行のためのリセット -------------------------------------------
   * 同じコードを2回流しても同じ結果になるように、前回分を消してから作り直す。
   * ユーザーが Penpot 上で直接手を入れている場合はその手直しごと消えるので、
   * その状況では reset を呼ばず、対象ボードだけ差し替えること。
   * -------------------------------------------------------------------- */
  function reset(prefix = PREFIX) {
    const targets = penpot.currentPage.root.children.filter((s) => s.name && s.name.startsWith(prefix));
    targets.forEach((s) => s.remove());
    created.length = 0;
    pages.length = 0;
    groups.clear();
    stateSeq.clear();
    return targets.length;
  }


  /* --- 行/列コンテナ ---------------------------------------------------- */
  // bg 未指定なら透明。塗ると枠だらけで読めなくなるので、領域を分けたいとき（サイドナビ等）だけ与える。
  // 透明のままだとサイドナビが本文と一体に見え、レビュアーが領域の切れ目を読み取れない。
  function container(parent, dir, { w, h, grow = false, gap = 8, padding = 0, align = 'start', justify = 'start', bg } = {}) {
    const c = penpot.createBoard();
    c.name = dir === 'row' ? 'row' : 'col';
    c.fills = bg ? fill(bg) : [];
    parent.appendChild(c);
    const f = c.addFlexLayout();
    f.dir = dir;
    f.alignItems = align;
    f.justifyContent = justify;
    f[dir === 'row' ? 'columnGap' : 'rowGap'] = gap;
    f.horizontalPadding = padding;
    f.verticalPadding = padding;
    return place(c, { w, h, grow });
  }
  const row = (p, o) => container(p, 'row', o);
  const col = (p, o) => container(p, 'column', o);

  /* --- テキスト ----------------------------------------------------------
   * fontSize / fontWeight は数値でなく文字列。数値を渡すと例外にならず無視される。
   * 自動サイズは即座に反映されない。幅・高さを読む必要があるなら ~150ms 待つ。
   * -------------------------------------------------------------------- */
  function text(parent, str, { size = 12, weight = '400', color = palette.text } = {}) {
    const t = penpot.createText(str);
    if (!t) throw new Error(`createText が null を返した: ${str}`);
    t.growType = 'auto-width';
    t.fontSize = String(size);
    t.fontWeight = String(weight);
    t.fills = fill(color);
    parent.appendChild(t);
    return t;
  }

  /* --- プレースホルダ ----------------------------------------------------
   * 画像・カード・入力欄など「中身が未確定な箱」。ラベルには役割名を書く。
   * justify: 'center'（アイコン等）/ 'start'（入力欄。実際の見え方に合わせる）
   * -------------------------------------------------------------------- */
  function box(parent, { w, h = 48, label = '', grow = false, bg = palette.box, justify = 'center', padding = 0 } = {}) {
    const b = penpot.createBoard();
    b.name = label || 'box';
    b.fills = fill(bg);
    b.strokes = stroke(palette.boxBorder);
    b.borderRadius = 2;
    parent.appendChild(b);
    const f = b.addFlexLayout();
    f.dir = 'row';
    f.alignItems = 'center';
    f.justifyContent = justify;
    f.horizontalPadding = padding;
    place(b, { w, h, grow });
    if (label) text(b, label, { size: 11, color: palette.muted });
    return b;
  }

  // 入力欄 = ラベル + 箱（+ 補助文）。フォームは1画面に何度も出るのでまとめる
  function field(parent, label, { value = '', hint = '' } = {}) {
    const c = col(parent, { gap: 4 });
    text(c, label, { size: 11, color: palette.muted });
    box(c, { h: 44, label: value, justify: 'start', padding: 12 });
    if (hint) text(c, hint, { size: 10, color: palette.muted });
    return c;
  }

  // w 未指定だと親幅いっぱいに伸びる。モバイルの全幅ボタンは既定で正しいが、
  // デスクトップのツールバー内などでは w を与えないと不自然に間延びする。
  const button = (parent, label, { primary = true, w, h = 48 } = {}) =>
    box(parent, { w, h, label, bg: primary ? '#DADADA' : palette.frame });

  // 触れないと流れは検証できない。遷移は口頭説明でなく Penpot 上の接続として残す
  const link = (shape, destination) => shape.addInteraction('click', { type: 'navigate-to', destination });

  /* --- 台紙（＝PDF 1ページ） --------------------------------------------
   * Penpot の PDF 出力はボード単位でページを作る。ボード外の要素は PDF に載らないので、
   * 画面枠・見出し・注釈をすべて1枚の台紙ボードに収める。
   * 台紙サイズは資料内で揃える（ページごとに紙の大きさが変わる資料は読みづらい）。
   * -------------------------------------------------------------------- */
  const LANE = 320, PAD = 40, GAP = 32, HEAD = 40;
  let SHEET = null;                       // { w, h, device } — doc() で確定する
  const pages = [];                       // 作成順
  const groups = new Map();               // 画面ID -> その画面の全状態のボード（配置の行になる）
  const stateSeq = new Map();             // 画面ID -> その画面で何個目の状態か

  function sheetSize(device) {
    const d = devices[device];
    return { w: PAD + d.w + GAP + LANE + PAD, h: PAD + HEAD + 16 + d.h + PAD, device };
  }

  function page(name, group) {
    if (!SHEET) throw new Error('先に WF.doc({ device, title }) を呼ぶ');
    const b = penpot.createBoard();
    b.name = `${PREFIX}${name}`;   // name は `01-タスク一覧-通常` の形
    b.resize(SHEET.w, SHEET.h);
    b.fills = fill(palette.frame);
    b.strokes = stroke(palette.frameBorder);
    const f = b.addFlexLayout();
    f.dir = 'column'; f.alignItems = 'stretch'; f.rowGap = 16;
    f.horizontalPadding = PAD; f.verticalPadding = PAD;
    created.push(b.name);
    pages.push(b);
    const g = group || name;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(b);
    return b;
  }

  /* --- 資料の初期化 ------------------------------------------------------
   * 台紙サイズを確定する。以降のページはすべてこのサイズで作られる。
   * ページごとに紙の大きさが変わる資料は読みづらいので、最初に一度だけ決める。
   * -------------------------------------------------------------------- */
  function doc({ device = 'desktop' } = {}) {
    SHEET = sheetSize(device);
    pages.length = 0;
    groups.clear();
    stateSeq.clear();
    return SHEET;
  }

  /* --- 画面IDと状態の枝番 ------------------------------------------------
   * 状態は画面の一部なので、画面IDを共有して枝番で分ける（01-01 / 01-02）。
   * 画面ID自体は呼び出し側が明示する。自動採番にすると、あとから画面を1枚挟んだだけで
   * 以降の番号が全部ずれ、先方と共有済みの「画面02の件」が別物を指してしまう。
   * -------------------------------------------------------------------- */
  function stateId(id) {
    const n = (stateSeq.get(id) || 0) + 1;
    stateSeq.set(id, n);
    return `${id}-${String(n).padStart(2, '0')}`;
  }

  /* --- 注釈 --------------------------------------------------------------
   * 画面の上には番号も引き出し線も描かない。指したい要素そのものを隠したり、
   * 画面を横切って中身を分断したりして、ワイヤーが読みにくくなるため。
   * 対象は「画面に見えているラベル」で名指しする。ワイヤーのプレースホルダには
   * すでに役割名が書いてあるので、それをそのまま引けば対応が取れる。
   * -------------------------------------------------------------------- */
  function annotator(lane) {
    let todoHead = false;
    // note('「＋ 新規作成」ボタン', '押下すると 04 …') — 対象名は太字で頭出しする
    const note = (label, str) => {
      const r = col(lane, { gap: 2 });
      text(r, label, { size: 11, weight: '700' });
      text(r, str, { size: 11 });
      return r;
    };
    // 未確定事項。挙動の説明と地続きだと読み分けられないので小見出しを挟む
    const todo = (str) => {
      if (!todoHead) { text(lane, '未確定事項', { size: 10, color: palette.muted }); todoHead = true; }
      return text(lane, `・${str}`, { size: 11, color: palette.note });
    };
    return { note, todo };
  }

  /* --- 画面ページ --------------------------------------------------------
   * 左に画面枠、右に注釈レーン。返り値の frame に中身を組み、note()/todo() で注釈を足す。
   * -------------------------------------------------------------------- */
  function screen({ id, name, state = '通常', device }) {
    const dev = devices[device || (SHEET && SHEET.device) || 'phone'];
    if (!dev) throw new Error(`未知の device: ${device}（phone/tablet/desktop）`);
    const sid = stateId(id);
    const sheet = page(`${sid}-${name}-${state}`, id);

    const head = row(sheet, { h: HEAD, align: 'center', gap: 12 });
    text(head, sid, { size: 20, weight: '700' });
    text(head, `${name} / ${state}`, { size: 14 });

    const body = row(sheet, { grow: true, gap: GAP });
    const frame = penpot.createBoard();
    frame.name = 'frame';
    frame.fills = fill(palette.frame);
    frame.strokes = stroke(palette.frameBorder);
    body.appendChild(frame);
    const ff = frame.addFlexLayout();
    ff.dir = 'column'; ff.alignItems = 'stretch'; ff.rowGap = 0;
    place(frame, { w: dev.w, h: dev.h });

    const lane = col(body, { w: LANE, grow: true, gap: 10 });
    lane.name = 'lane';
    text(lane, '注釈', { size: 10, color: palette.muted });

    return Object.assign({ id: sid, sheet, frame, lane }, annotator(lane));
  }

  /* --- デスクトップの共通シェル ------------------------------------------
   * トップバー +（サイドナビ | 本体）。デスクトップ画面のほぼ全部がこの形になる。
   * 低忠実度では DRY より閲覧性を優先し、各画面にコピーして持たせる。
   * -------------------------------------------------------------------- */
  function shell(s, { title, items = [], active, user = 'ユーザー名 ▾', navWidth = 240 }) {
    const top = row(s, { h: 56, padding: 16, align: 'center', justify: 'space-between' });
    text(top, title, { size: 16, weight: '700' });
    if (user) text(top, user, { size: 11, color: palette.muted });

    const main = row(s, { grow: true });
    const nav = col(main, { w: navWidth, grow: true, padding: 16, gap: 4, bg: '#F7F7F7' });
    items.forEach((item) => {
      box(nav, { h: 36, label: item, justify: 'start', padding: 12, bg: item === active ? '#E4E4E4' : palette.frame });
    });
    const content = col(main, { grow: true, padding: 24, gap: 16 });
    return { top, nav, content };
  }

  /* --- テーブル ----------------------------------------------------------
   * 列幅は透明な固定幅コンテナで揃える。テキストを直に並べると列が揃わない。
   * columns: [[見出し, 幅], …] / rows: [[セル, …], …]
   * -------------------------------------------------------------------- */
  function table(parent, { columns, rows }) {
    const head = row(parent, { h: 36, gap: 16, align: 'center', padding: 12 });
    columns.forEach(([label, w]) => text(col(head, { w }), label, { size: 10, color: palette.muted }));
    rows.forEach((cells) => {
      const r = box(parent, { h: 52, justify: 'start', padding: 12, bg: palette.frame });
      const inner = row(r, { grow: true, gap: 16, align: 'center' });
      cells.forEach((c, i) => text(col(inner, { w: columns[i][1] }), c, { size: 11 }));
    });
  }

  /* --- オーバーレイ状態 --------------------------------------------------
   * モーダル・ドロワー等は、下地の画面ページをクローンしてその上に重ねる。
   * 空の画面に中身だけ置くと「モーダル」に見えず、レビュアーが別画面と誤解する。
   * 引数は screen() の返り値。返り値も同じ形なので、そのまま note()/todo() が使える。
   * -------------------------------------------------------------------- */
  function overlay(base, { id, name, state = 'モーダル', w = 560, top = 120 }) {
    const sid = stateId(id);
    const sheet = base.sheet.clone();
    sheet.name = `${PREFIX}${sid}-${name}-${state}`;
    created.push(sheet.name);
    pages.push(sheet);
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(sheet);

    const frame = penpotUtils.findShape((sh) => sh.name === 'frame', sheet);
    const lane = penpotUtils.findShape((sh) => sh.name === 'lane', sheet);
    // 見出しを差し替え、下地から引き継いだ注釈と番号を捨てる（この画面の注釈は別物）
    const head = sheet.children[0];
    head.children[0].characters = sid;
    head.children[1].characters = `${name} / ${state}`;
    lane.children.slice(1).forEach((c) => c.remove());
    penpotUtils.findShapes((sh) => /^(mark|lead)-/.test(sh.name), sheet).forEach((c) => c.remove());

    const dim = penpot.createBoard();
    frame.appendChild(dim);
    dim.name = 'dim';
    dim.fills = [{ fillColor: '#000000', fillOpacity: 0.25 }];
    dim.strokes = [];
    dim.resize(frame.width, frame.height);
    if (dim.layoutChild) { dim.layoutChild.absolute = true; dim.layoutChild.zIndex = 10; }
    penpotUtils.setParentXY(dim, 0, 0);

    const panel = penpot.createBoard();
    frame.appendChild(panel);
    panel.name = 'modal';
    panel.fills = fill(palette.frame);
    panel.strokes = stroke(palette.frameBorder);
    panel.borderRadius = 4;
    const f = panel.addFlexLayout();
    f.dir = 'column'; f.alignItems = 'stretch'; f.rowGap = 16;
    f.horizontalPadding = 24; f.verticalPadding = 24;
    panel.resize(w, 400);
    if (panel.layoutChild) {
      panel.layoutChild.absolute = true;      // absolute にすると x/y が親相対になる
      panel.layoutChild.zIndex = 11;
      panel.layoutChild.verticalSizing = 'auto';
    }
    penpotUtils.setParentXY(panel, Math.round((frame.width - w) / 2), top);

    return Object.assign({ id: sid, sheet, frame, panel, lane }, annotator(lane));
  }

  /* --- ページの配置 ------------------------------------------------------
   * 行＝画面、列＝その画面の状態。開いた瞬間に「画面がいくつあるか」と
   * 「どの画面の状態を取りこぼしているか」が同時に読める並びになる。
   * 縦一列だと網羅の穴が見えず、意味を持たないグリッドだと状態の対応が読めない。
   *
   * PDF のページ順はレイヤー順で決まり、キャンバス上の位置とは無関係。
   * だから配置は俯瞰しやすさだけで決めてよく、順序は setParentIndex が別に保証する。
   * ただし PDF の順と紙面の読み順（左→右、上→下）は一致させる。ずれると
   * 「3ページ目の…」と「上から2行目の…」が別のものを指してレビューが混乱する。
   * -------------------------------------------------------------------- */
  function layoutPages({ gap = 60, originX = 0, originY = 0 } = {}) {
    const rows = [...groups.values()].filter((r) => r.length);
    if (!rows.length) return [];
    const colW = Math.max(...pages.map((b) => b.width)) + gap;
    const rowH = Math.max(...pages.map((b) => b.height)) + gap;
    const ordered = [];
    rows.forEach((row, r) => row.forEach((b, c) => {
      b.x = originX + c * colW;
      b.y = originY + r * rowH;
      ordered.push(b);
    }));
    // Penpot の PDF 出力は「最前面のボードが1ページ目」。つまりレイヤー順の逆にページが並ぶ。
    // さらに overlay() の clone() は下地の隣に挿入されるので、作成順のままでは順序が崩れる。
    // 読み順どおりの並びを children の逆順に置き直して、両方まとめて解消する。
    ordered.forEach((b, i) => b.setParentIndex(ordered.length - 1 - i));
    return ordered;
  }

  function gridPlace(boards, { cols = 4, gap = 80, originX = 0, originY = 0 } = {}) {
    const colW = Math.max(...boards.map((b) => b.width)) + gap;
    const rowH = Math.max(...boards.map((b) => b.height)) + gap;
    boards.forEach((b, i) => {
      b.x = originX + (i % cols) * colW;
      b.y = originY + Math.floor(i / cols) * rowH;
    });
    return boards;
  }

  const report = () => ({ pages: pages.map((b) => b.name), count: pages.length });

  return { palette, devices, reset, doc, page, screen, overlay,
           row, col, text, box, field, button, shell, table, link, layoutPages, gridPlace, place, report,
           get pages() { return [...pages]; } };
})();

return { kit: 'loaded', members: Object.keys(storage.WF) };
