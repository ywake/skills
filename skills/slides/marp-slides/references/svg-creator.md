# svg-creator.md — 図解 SVG 生成規約

アーキ図やフロー図など、Tailwind のボックス組み合わせだけでは表現しづらい図解を、Claude Code が直接手書きの SVG として作成するための規約。外部の作図ツール（mermaid・drawio・excalidraw 等）は使わず、`<svg>` を直接書く。patterns.md の G-10（アーキ図）と SKILL.md ワークフロー Step 5（図解 SVG 生成）から参照される。

## 1. 比率とファイル

- **viewBox 比率**: 縦2:横5 で固定する（例: `viewBox="0 0 1000 400"`）。同じ比率であれば `0 0 1200 480` のようにスケールしてもよい。スライドの横長フォーマットに合わせるための既定値であり、崩さない。
- **保存先**: `./svg/`。
- **ファイル名**: 内容を表すケバブケース（例: `data-pipeline.svg`, `auth-flow.svg`）。1図1ファイルとし、使い回さない。

## 2. 配色

配色はプロジェクトの `docs/style-guide.md`（`style-guide-template.md` から生成したもの）に追従する。プロジェクト側でブランド色を差し替えている場合はそちらを優先し、以下は差し替えがない場合の既定値。

`<img>` で読み込む SVG は Marp のページとは別ドキュメント扱いになり Tailwind クラスが効かないため、色は **Tailwind クラス名ではなく hex 値で直接指定**する（インライン `<svg>` の場合も一貫性のため hex 指定で統一する）。

| 役割 | Tailwind 相当 | hex |
| --- | --- | --- |
| 背景・パネル濃淡（明） | `gray-100` | `#f3f4f6` |
| 罫線・区切り線 | `gray-300` | `#d1d5db` |
| 矢印・補助線 | `gray-400` | `#9ca3af` |
| キャプション文字 | `gray-500` | `#6b7280` |
| 本文文字 | `gray-700` | `#374151` |
| 見出し文字 | `gray-800` | `#1f2937` |
| 主アクセント | `brand-navy` | `#1B4565` |
| 副アクセント | `brand-teal` | `#3E9BA4` |
| 補助アクセント（1点強調のみ） | `brand-ruby` | `#B23A6B` |

- 1図あたりのアクセント色は **1〜2色まで**（既定は navy＋teal のペア、ruby は「ここぞ」という1点強調にのみ足す）。3色以上を混在させない。
- 強調に赤・緑（信号色）は使わない。重要度の差は色相を増やすのではなく、グレーの濃淡やアクセントの `fill-opacity` で表現する。

## 3. 設計ルール

- **余白**: 図の要素を viewBox の端に接触させない。`0 0 1000 400` なら左右は 40〜60px、上下は内容量に応じて広めに取る（例では上下 120px 程度）。
- **テキスト**: 文字は必ず SVG 内の `<text>` で書き、`font-family` をデッキと同じ日本語フォントスタックに明示する（`"Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif`）。SVG は Tailwind の em クラスを参照できないため、サイズは px 直値で指定する（見出し 24〜28px・本文/ラベル 16〜18px が目安）。
- **線**: 矢印・枠線は細め（`stroke-width` 1.5〜2）にし、色は `gray-300`/`gray-400` を基本にする。
- **塗り**: 重要度の階層は色数を増やさず濃淡で表現する。主要素はアクセントの実色、補助要素は同アクセントの `fill-opacity` を下げた薄塗り、その他はグレー系という3段階が扱いやすい。

## 4. 埋め込み方法

スライドへの取り込みは用途に応じて2通り。いずれもローカルファイル参照になるため `--allow-local-files` が前提（`setup.md` / `layout-fix.md` 参照）。

```html
<!-- 単純な画像として読み込む（既定・再利用しやすい）。slides/deck.md から見て svg/ は一つ上の階層のため ../ を付ける -->
<img src="../svg/diagram.svg" class="w-full" />
```

```html
<!-- インラインで直接埋め込む（同一デッキ内でしか使わない/差分管理を1ファイルに閉じたい場合） -->
<svg viewBox="0 0 1000 400" ...>...</svg>
```

## 5. 生成手順

1. 図の内容を3〜5要素程度に単純化する（要素が多すぎる場合は1枚のSVGに詰め込まず、スライドを分けるか箇条書きに戻すことを検討する）。
2. `viewBox="0 0 1000 400"` を基準に、余白を引いた領域へボックス・矢印の座標を計算する。
3. `rect`（ボックス）・`line`/`polygon`（矢印・矢じり）・`text`（ラベル）で作図し、色は「2. 配色」の表に従う。
4. `./svg/` に保存する（ファイル名はケバブケース）。
5. スライドに埋め込みレンダリングし、`layout-fix.md` と同じ目視基準（はみ出し・テキスト切れ・余白バランス・コントラスト）で確認する。崩れがあれば座標やフォントサイズを調整し、崩れゼロになるまで再レンダリングする。

### サンプル: 3ボックス＋矢印のフロー図

`viewBox="0 0 1000 400"`（縦2:横5）、中央のボックスを navy、右のボックスを teal の薄塗りでアクセントにし、残りはグレートーンにした最小構成。

```html
<svg viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
  <!-- 入力: グレー基調のニュートラルなボックス -->
  <rect x="60" y="120" width="220" height="160" rx="12" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1.5" />
  <text x="170" y="210" text-anchor="middle" font-family="&quot;Hiragino Kaku Gothic ProN&quot;, &quot;Yu Gothic&quot;, &quot;Noto Sans JP&quot;, sans-serif" font-size="26" font-weight="bold" fill="#111827">入力</text>

  <!-- 処理: 主アクセント(navy)で強調 -->
  <rect x="390" y="120" width="220" height="160" rx="12" fill="#1B4565" />
  <text x="500" y="210" text-anchor="middle" font-family="&quot;Hiragino Kaku Gothic ProN&quot;, &quot;Yu Gothic&quot;, &quot;Noto Sans JP&quot;, sans-serif" font-size="26" font-weight="bold" fill="#ffffff">処理</text>

  <!-- 出力: 副アクセント(teal)を薄塗りで対にする -->
  <rect x="720" y="120" width="220" height="160" rx="12" fill="#3E9BA4" fill-opacity="0.12" stroke="#3E9BA4" stroke-width="1.5" />
  <text x="830" y="210" text-anchor="middle" font-family="&quot;Hiragino Kaku Gothic ProN&quot;, &quot;Yu Gothic&quot;, &quot;Noto Sans JP&quot;, sans-serif" font-size="26" font-weight="bold" fill="#111827">出力</text>

  <!-- 矢印1: 入力→処理 -->
  <line x1="280" y1="200" x2="380" y2="200" stroke="#9ca3af" stroke-width="2" />
  <polygon points="380,200 366,193 366,207" fill="#9ca3af" />

  <!-- 矢印2: 処理→出力 -->
  <line x1="610" y1="200" x2="710" y2="200" stroke="#9ca3af" stroke-width="2" />
  <polygon points="710,200 696,193 696,207" fill="#9ca3af" />
</svg>
```
