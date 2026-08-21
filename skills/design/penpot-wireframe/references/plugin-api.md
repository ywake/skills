# Penpot プラグイン API — 検証済みシグネチャと落とし穴

`execute_code` の中で使える API のうち、ワイヤー作成でよく使うものを公式リファレンス
（https://doc.plugins.penpot.app/）から確認した範囲でまとめる。

ここに無いプロパティを使うときは、**推測で書かず `penpot_api_info` ツールで確認する**。
プラグイン API は不正な値を渡しても例外にならず「黙って無視される」ことがあり、
その場合は書き出し画像を見るまで失敗に気づけない。

## 目次

- [実行環境 (storage / penpotUtils)](#実行環境-storage--penpotutils)
- [生成 (penpot.*)](#生成-penpot)
- [ページ](#ページ)
- [ボード](#ボード)
- [フレックスレイアウト](#フレックスレイアウト)
- [テキスト](#テキスト)
- [全シェイプ共通](#全シェイプ共通)
- [プロトタイプ接続](#プロトタイプ接続)
- [オーバーレイ（重ね置き）](#オーバーレイ重ね置き)
- [共有ライブラリ（アイコン）](#共有ライブラリアイコン)
- [型の落とし穴](#型の落とし穴)

## 実行環境 (storage / penpotUtils)

`execute_code` のコードは「関数の本体」として実行され、`return` した値がツールの戻り値になる。
利用できるグローバルは `penpot`（プラグイン API）、`penpotUtils`（ユーティリティ）、`storage`。

`storage` は **呼び出しをまたいで永続する**オブジェクト。ヘルパ関数や中間結果を載せておけば、
次の呼び出しで `storage.WF` のように参照できる。同じコードを毎回貼り直す必要はない。
ただし永続なのは**同じ接続の間だけ**。タブのリロード・フォーカス喪失からの再接続・プラグイン UI の
再読み込みで黙って空になる（ボードはファイル側に保存済みなので消えない）。接続が戻ったら
`Object.keys(storage)` で生存確認してから使う。

`execute_code` / `export_shape` の**クライアント側タイムアウトは失敗を意味しない**。Penpot 側は
最後まで完走していることが多く、盲目的に再実行するとボードが二重にできる。タイムアウト後は
必ずページのボード一覧で状態を確認してから再開する。図形への一括ミューテーション（数百件の
プロパティ変更）や、シェイプ数が数千に達したファイルの書き出しは特にタイムアウトしやすい。
書き出しが返ってこなくなったら、Penpot タブのリロード（ユーザー操作）で復旧する。

`shape.setPluginData(key, value)` / `getPluginData(key)` はシェイプに任意の文字列を永続化する。
「あとで一括処理する対象」の印付けに使える（storage と違いファイルに保存され、消えない）。

シェイプ探索は自前で書かず `penpotUtils` を使う:

```ts
penpotUtils.getPages(): { id, name }[]
penpotUtils.getPageByName(name): Page | null
penpotUtils.findShape(predicate, root?): Shape | null
penpotUtils.findShapes(predicate, root?): Shape[]
penpotUtils.shapeStructure(shape, maxDepth?): { id, name, type, children?, layout? }
penpotUtils.setParentXY(shape, parentX, parentY): void   // parentX/parentY は読み取り専用のため
penpotUtils.isContainedIn(shape, container): boolean     // はみ出し検出に使える
penpotUtils.analyzeDescendants(root, evaluator, maxDepth?)
penpotUtils.addFlexLayout(container, dir)                // 既に子がある板に後付けするときはこちら
```

`board.addFlexLayout()` を子のある板に直接呼ぶと表示順が入れ替わる。後付けは `penpotUtils.addFlexLayout()`。

## 生成 (penpot.*)

| API | 戻り値 |
| --- | --- |
| `penpot.createBoard()` | `Board` |
| `penpot.createRectangle()` | `Rectangle` |
| `penpot.createEllipse()` | `Ellipse` |
| `penpot.createPath()` | `Path` |
| `penpot.createText(text: string)` | `Text \| null` |
| `penpot.createShapeFromSvg(svg: string)` | `Group \| null` |
| `penpot.createShapeFromSvgWithImages(svg: string)` | `Promise<Group \| null>` |
| `penpot.createPage()` | `Page` |
| `penpot.group(shapes)` | `Group \| null` |
| `penpot.ungroup(group, ...other)` | `void` |

主なプロパティ: `penpot.currentPage` / `currentFile` / `root` / `selection` / `viewport` / `library` / `theme` / `version`

生成系は `content:write` 権限を要する。

## ページ

```ts
page.findShapes(criteria?: {
  name?: string;
  nameLike?: string;
  type?: 'board' | 'rectangle' | 'ellipse' | 'path' | 'text' | 'group' | 'image' | 'boolean' | 'svg-raw';
}): Shape[]

page.getShapeById(id: string): Shape | null
page.createFlow(name: string, board: Board): Flow
page.root      // 全シェイプの親。トップレベル判定に使う
page.flows     // 定義済みフロー
```

## ボード

```ts
board.name / x / y
board.resize(width: number, height: number): void
board.appendChild(child: Shape): void
board.addFlexLayout(): FlexLayout
board.addGridLayout(): GridLayout
board.horizontalSizing: 'auto' | 'fix'   // 'auto' = 中身に合わせる
board.verticalSizing:   'auto' | 'fix'
board.fills: Fill[]
board.borderRadius: number
board.layoutChild                        // 親がレイアウトのときだけ存在（readonly コンテナ）
```

## フレックスレイアウト

```ts
layout.dir: 'row' | 'row-reverse' | 'column' | 'column-reverse'
layout.wrap: 'wrap' | 'nowrap'
layout.alignItems:      'start' | 'center' | 'end' | 'stretch'
layout.alignContent:    'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly'
layout.justifyItems:    'start' | 'center' | 'end' | 'stretch'
layout.justifyContent:  'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly'
layout.rowGap / columnGap: number
layout.horizontalPadding / verticalPadding: number
layout.topPadding / rightPadding / bottomPadding / leftPadding: number
layout.horizontalSizing / verticalSizing: 'fill' | 'auto' | 'fix'
layout.appendChild(child: Shape): void
layout.remove(): void
```

子要素側のサイズは `child.layoutChild.horizontalSizing = 'fill'` のように指定する。
`'fill'` は親の残りを埋める、`'auto'` は中身に合わせる、`'fix'` は `resize()` した寸法で固定。

## テキスト

```ts
text.characters: string
text.growType: 'fixed' | 'auto-width' | 'auto-height'
text.align: 'left' | 'center' | 'right' | 'justify' | 'mixed' | null
text.verticalAlign: 'top' | 'center' | 'bottom' | null
text.fontFamily / fontSize / fontWeight / lineHeight / letterSpacing: string
text.fills: Fill[]
```

## 全シェイプ共通

```ts
shape.name / x / y / parent / interactions / layoutChild / strokes / borderRadius
shape.remove(): void
shape.clone(): Shape
shape.resize(width: number, height: number): void
```

## プロトタイプ接続

```ts
shape.addInteraction(trigger, action, delay?): Interaction
```

トリガーは `'click'` ほか（`'mouse-enter'` / `'mouse-leave'` / `'after-delay'`）。
アクションは `navigate-to` / `open-overlay` / `toggle-overlay` / `close-overlay` /
`previous-screen` / `open-url`。画面遷移の形:

```js
shape.addInteraction('click', {
  type: 'navigate-to',
  destination: targetBoard,        // Board オブジェクト（id 文字列ではない）
  preserveScrollPosition: false,   // 任意
  // animation: { ... }            // Dissolve / Slide / Push。ワイヤーでは基本つけない
});
```

## オーバーレイ（重ね置き）

モーダルのように「下地の画面の上に重ねる」表現は、下地を `clone()` してから絶対配置の子を足す。

```js
const clone = base.clone();          // 子孫ごと複製。位置は元と同じなので後で動かす
clone.appendChild(panel);
panel.layoutChild.absolute = true;   // レイアウトの制御から外れ、x/y が「親相対」になる
panel.layoutChild.zIndex = 11;       // 数字が大きいほど手前
penpotUtils.setParentXY(panel, x, y);// parentX/parentY は読み取り専用なのでこの関数で
```

`absolute = true` にすると `x` / `y` の意味が絶対座標から親相対に変わる点に注意。
暗幕は不透明度つきの塗りで作る: `[{ fillColor: '#000000', fillOpacity: 0.25 }]`。

## SVG の取り込み

`penpot.createShapeFromSvg(svgString)` は Group を返す（失敗時 null）。図を一発で持ち込めるが、
`<text>` が Penpot の Text にならず **`svg-raw` のまま入るため、文言を編集できない**。
あとから直す可能性があるものは、ネイティブ図形（ボード＋テキスト＋矩形）で組むこと。

## 共有ライブラリ（アイコン）

```ts
penpot.library.connected: Library[]          // 接続済み
penpot.library.availableLibraries(): Promise<LibrarySummary[]>
penpot.library.connectLibrary(id): Promise<Library>
library.components: LibraryComponent[]
component.instance(): Shape                  // 実体をカレントページに作る
shape.detach(): void                         // 元コンポーネントとの結び付きを切る
```

Penpot Hub の **Lucide Icons** を取り込んだ場合に実機で確認できたこと:

- コンポーネント数は 1420。名前は lucide と同じフラット名（`settings` / `plus` / `bell`）で、階層区切りは無い
- `instance()` は **24×24 のボード**を返す。子は `base-background` という境界用の矩形＋黒ストローク2pxの `path` / `ellipse` / `rectangle`
- `base-background` には**黒ストロークが付いていることがある**。消さずに置くとアイコンが「黒い箱入り」で描画される。`strokes = []; fills = []` で消す
- 寸法・色を変えるなら `detach()` してから。コンポーネントのままだと子孫への変更が反映されないことがある
- **縮小は「子の constraints → resize」の順**。`inst.resize(16,16)` を直接呼ぶと枠だけ縮んで中身のパスが 24px のまま残る。先に全子へ `constraintsHorizontal = constraintsVertical = 'scale'` を設定してから resize する
- 原寸 24px のストローク幅 2px は、16px に縮めると太い。`strokeWidth: 1.5` 程度に落とすと締まる
- 1枚のワイヤーでアイコンを何十回も置くなら、`components` の線形 `find` を毎回呼ばず `new Map(components.map(c => [c.name, c]))` の索引を一度だけ作って引く

## 型の落とし穴

レイアウト系の行はすべて実機で踏んだもの。いずれも**例外を出さず、見た目だけが壊れる**。

| 落とし穴 | 症状 | 対処 |
| --- | --- | --- |
| `resize()` が `layoutChild` の sizing を `'fix'` に戻す | `'fill'` を指定したのに親幅に広がらない | **resize → sizing の順**で設定する |
| 寸法未指定のまま sizing が `'fix'` | 既定 100px で固定され、中身が枠から溢れる | 高さを決めないコンテナは `verticalSizing = 'auto'` |
| sizing を一律 `'fill'` にする | 幅を決めたはずの箱が横一杯に伸びる | 幅指定した要素は `horizontalSizing = 'fix'` |
| 高さ固定の要素に `verticalSizing = 'fill'` | 兄弟と親の高さを分け合い、0px に潰れる／間延びする | 高さを決めた要素は縦 `'fix'` |
| `'auto'` を子を入れる前に指定 | 既定 100px のまま焼き付き、子を足しても再計算されない | 組み終えてから `'fix'`→`'auto'` と設定し直す（再計算が走る） |
| 高さ固定の行に同値の縦パディング | 内側の余地（h − padding×2）が消えて中身が切れる | 縦パディングを外す。中央寄せは `alignItems` で足りる |
| コンポーネント instance を直接 `resize()` | 枠だけ縮んで中身が 24px のまま | 全子の constraints を `'scale'` にしてから resize（共有ライブラリの節を参照） |
| `resize()` が Text の `growType` を `'fixed'` に戻す | 自動サイズが効かなくなる | resize の後に `growType` を再設定する |
| テキストの自動サイズは即時反映されない | 直後に `width` を読むと 1 が返る | 計測が要るなら ~150ms 待つ |
| `fontSize` / `fontWeight` は **string** | 数値を渡すと無視され、既定サイズのまま | `String(size)` で渡す |
| `createText` は **null を返しうる** | 後続で `.characters` を触って例外 → 途中の図形が残る | null チェックして早期に投げる |
| `width` / `height` / `parentX` / `parentY` / `bounds` は読み取り専用 | 代入しても何も起きない | `resize()` / `penpotUtils.setParentXY()` を使う |
| `fills` / `strokes` の配列は中身が読み取り専用 | 個別の fill を書き換えても反映されない | 配列ごと差し替える |
| 色は大文字 hex で渡す | 小文字は不可 | `#FF5533` |
| 読み戻した `fillColor` は**小文字** | `fills[0].fillColor === '#C4C4C4'` が常に false になる | 比較は `toUpperCase()` を通す |
| `navigate-to` の `destination` は Board オブジェクト | id 文字列だと接続されない | 生成した Board 変数をそのまま渡す |
| `export_shape` に `shapeId:'page'` | ルートフレームは幅0扱いでタイムアウトする | 各ボードの `id` を渡す |
| `fetch` は存在するが**ブロックされる** | 外部から画像やアイコンを取ってこようとして `Failed to fetch` | 実行時取得は諦め、共有ライブラリ経由にする |
| `library.components` の全件展開が重い | 呼び出しのたびに 1420 件を走査するとタイムアウトを誘発する | 数個なら `find` で早期に打ち切る。何十個も置くなら `Map` の索引を**一度だけ**作って storage に置く |
| PDF のページ順はレイヤー順の**逆** | 最前面のボードが1ページ目になり、資料が逆順で出る | 意図したページ順を `setParentIndex(n-1-i)` で children の逆順に置く |
| `clone()` は元の隣に挿入される | クローンしたページが下地の直後に割り込み、順序が崩れる | 生成後にまとめて `setParentIndex` で並べ直す |
